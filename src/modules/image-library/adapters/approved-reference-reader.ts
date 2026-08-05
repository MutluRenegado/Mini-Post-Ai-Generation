import type { VisualReference } from '../models/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';
import { FirestoreImageLibraryRepository } from '../repositories/firestore-image-library.repository';

export interface ApprovedReferenceQuery {
  topic?: string;
  industry?: string;
  scene?: string;
  roles?: string[];
  objects?: string[];
  platform?: string;
  aspectRatio?: string;
  limit?: number;
}

export interface ApprovedReferenceResult {
  id: string;
  title: string;
  scene?: string;
  peoplePresent?: boolean;
  peopleDescription?: string;
  professionalRoles?: string[];
  objects?: string[];
  environment?: string;
  lighting?: string;
  composition?: string;
  cameraAngle?: string;
  photographyStyle?: string;
  mustInclude?: string[];
  mustAvoid?: string[];
  overallQualityScore?: number;
  rightsConfirmed: boolean;
  retrievalExplanation: string;
}

export interface ApprovedReferenceResponse {
  matched: boolean;
  code: 'APPROVED_REFERENCE_MATCH' | 'NO_REFERENCE_MATCH';
  references: ApprovedReferenceResult[];
  reason?: string;
}

export class ApprovedReferenceReader {
  private repo: IImageLibraryRepository;

  constructor(repository?: IImageLibraryRepository) {
    this.repo = repository || new FirestoreImageLibraryRepository();
  }

  /**
   * Retrieves strictly APPROVED and RIGHTS-CONFIRMED visual references for Image Intelligence prompt enrichment.
   * If no records satisfy all conditions, returns code NO_REFERENCE_MATCH cleanly without blocking.
   */
  async getApprovedReferences(query: ApprovedReferenceQuery): Promise<ApprovedReferenceResponse> {
    const allApproved = await this.repo.getApprovedReferences();

    if (!allApproved || allApproved.length === 0) {
      return {
        matched: false,
        code: 'NO_REFERENCE_MATCH',
        references: [],
        reason: 'No approved and rights-confirmed visual references exist in the Image Library.',
      };
    }

    let filtered = allApproved.filter((ref) => {
      // MANDATORY SAFETY CHECKS
      if (ref.review?.status !== 'APPROVED') return false;
      if (!ref.rights?.rightsConfirmed) return false;
      if (ref.rights?.commercialUseReviewStatus !== 'APPROVED') return false;
      return true;
    });

    if (query.industry) {
      const ind = query.industry.toLowerCase();
      filtered = filtered.filter((r) => r.industry?.toLowerCase().includes(ind));
    }

    if (query.topic) {
      const top = query.topic.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.topic?.toLowerCase().includes(top) ||
          r.title.toLowerCase().includes(top) ||
          (r.caption && r.caption.toLowerCase().includes(top))
      );
    }

    if (query.aspectRatio) {
      filtered = filtered.filter((r) => r.aspectRatio === query.aspectRatio);
    }

    if (filtered.length === 0) {
      return {
        matched: false,
        code: 'NO_REFERENCE_MATCH',
        references: [],
        reason: 'No approved visual reference matches the requested topic/industry/aspectRatio criteria.',
      };
    }

    const maxResults = query.limit || 3;
    const topMatches = filtered.slice(0, maxResults);

    const references: ApprovedReferenceResult[] = topMatches.map((ref) => ({
      id: ref.id,
      title: ref.title,
      scene: ref.scene,
      peoplePresent: ref.peoplePresent,
      peopleDescription: ref.peopleDescription,
      professionalRoles: ref.professionalRoles,
      objects: ref.objects,
      environment: ref.environment,
      lighting: ref.lighting,
      composition: ref.composition,
      cameraAngle: ref.cameraAngle,
      photographyStyle: ref.photographyStyle,
      mustInclude: ref.mustInclude,
      mustAvoid: ref.mustAvoid,
      overallQualityScore: ref.qualityScores?.overallQualityScore,
      rightsConfirmed: ref.rights.rightsConfirmed,
      retrievalExplanation: `Matched approved reference "${ref.title}" (Quality Score: ${
        ref.qualityScores?.overallQualityScore || 'N/A'
      }) for topic "${ref.topic || query.topic || 'General'}"`,
    }));

    return {
      matched: true,
      code: 'APPROVED_REFERENCE_MATCH',
      references,
    };
  }
}
