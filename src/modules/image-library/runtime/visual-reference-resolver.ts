import type { AssetMode, RankingResult, VisualReference } from '../models/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';
import { FirestoreImageLibraryRepository } from '../repositories/firestore-image-library.repository';
import { VisualRankingService, VisualRankingQuery } from './visual-ranking.service';

export interface VisualResolverInput extends VisualRankingQuery {
  mode?: AssetMode;
  limit?: number;
  userId?: string;
  organizationId?: string;
}

export interface ReferenceEnrichmentData {
  photographyStyle?: string;
  lighting?: string;
  composition?: string;
  cameraAngle?: string;
  mustInclude?: string[];
  mustAvoid?: string[];
  referenceId: string;
  title: string;
  explanation: string;
}

export interface VisualResolverOutput {
  mode: AssetMode;
  retrievalStatus: 'APPROVED_REFERENCE_MATCH' | 'NO_REFERENCE_MATCH';
  references: VisualReference[];
  selectedAsset?: VisualReference;
  enrichment?: ReferenceEnrichmentData;
  rankingVersion: string;
  explanation: string;
}

export class VisualReferenceResolver {
  private repo: IImageLibraryRepository;

  constructor(repository?: IImageLibraryRepository) {
    this.repo = repository || new FirestoreImageLibraryRepository();
  }

  /**
   * Resolves visual references according to requested mode.
   * Default mode is AI_GENERATED_WITH_REFERENCE_ENRICHMENT.
   * Existing library photos NEVER silently replace AI generation unless explicitly requested in mode.
   */
  async resolveVisualReference(input: VisualResolverInput): Promise<VisualResolverOutput> {
    const mode = input.mode || 'AI_GENERATED_WITH_REFERENCE_ENRICHMENT';
    const limit = input.limit || 5;

    // Retrieve approved and rights-confirmed references
    const allApproved = await this.repo.getApprovedReferences();

    if (!allApproved || allApproved.length === 0) {
      return {
        mode,
        retrievalStatus: 'NO_REFERENCE_MATCH',
        references: [],
        rankingVersion: '2.0.0-metadata-transparent',
        explanation: 'No approved and rights-confirmed visual references exist in the library.',
      };
    }

    // Rank all candidate references
    const rankedResults: RankingResult[] = allApproved
      .map((ref) => VisualRankingService.rankCandidate(ref, input))
      .filter((r) => r.selectionStatus !== 'DISQUALIFIED')
      .sort((a, b) => b.finalScore - a.finalScore);

    if (rankedResults.length === 0 || rankedResults[0].finalScore < 50) {
      return {
        mode,
        retrievalStatus: 'NO_REFERENCE_MATCH',
        references: [],
        rankingVersion: '2.0.0-metadata-transparent',
        explanation: 'No approved visual references reached the required metadata similarity threshold.',
      };
    }

    const topMatches = rankedResults.slice(0, limit);
    const topReference = topMatches[0].reference;

    // Construct enrichment payload
    const enrichment: ReferenceEnrichmentData = {
      referenceId: topReference.id,
      title: topReference.title,
      photographyStyle: topReference.photographyStyle,
      lighting: topReference.lighting,
      composition: topReference.composition,
      cameraAngle: topReference.cameraAngle,
      mustInclude: topReference.mustInclude,
      mustAvoid: topReference.mustAvoid,
      explanation: topMatches[0].explanation,
    };

    // Asset selection occurs ONLY when mode explicitly permits asset substitution
    const selectedAsset =
      mode === 'LIBRARY_REFERENCE' || mode === 'USER_SELECT' ? topReference : undefined;

    return {
      mode,
      retrievalStatus: 'APPROVED_REFERENCE_MATCH',
      references: topMatches.map((m) => m.reference),
      selectedAsset,
      enrichment,
      rankingVersion: '2.0.0-metadata-transparent',
      explanation: `Resolved ${topMatches.length} approved reference candidates under mode ${mode}. Top match: "${topReference.title}" (Score: ${topMatches[0].finalScore}).`,
    };
  }
}
