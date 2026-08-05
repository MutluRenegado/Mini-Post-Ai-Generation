import type { IImageLibraryRepository } from '../../library/repositories/image-library-repository.interface';
import { VisualReferenceRetriever } from '../retrieval/VisualReferenceRetriever';
import { VisualReferenceRanker } from '../ranking/VisualReferenceRanker';
import { ReferenceEnrichmentBuilder } from './ReferenceEnrichmentBuilder';
import { RetrievalAuditService } from '../audit/RetrievalAuditService';
import type { VisualResolverInput, VisualResolverOutput, ResolverMode, RetrievalStatus } from './resolution.types';
import type { TransparentRankingResult } from '../ranking/ranking.types';
import { RankingWeights } from '../ranking/RankingWeights';

export class VisualReferenceResolver {
  private retriever: VisualReferenceRetriever;
  private auditService: RetrievalAuditService;

  constructor(repository: IImageLibraryRepository) {
    this.retriever = new VisualReferenceRetriever(repository);
    this.auditService = new RetrievalAuditService();
  }

  /**
   * Resolves visual references according to requested mode.
   * Default mode is REFERENCE_ENRICHMENT.
   * Existing library photos NEVER silently replace AI generation unless mode === EXISTING_ASSET_SELECTION.
   */
  async resolve(input: VisualResolverInput): Promise<VisualResolverOutput> {
    const startTime = Date.now();
    const query = input.query;
    const mode: ResolverMode = input.mode || 'REFERENCE_ENRICHMENT';
    const limit = input.limit || 5;
    const minimumScore = input.minimumScore !== undefined ? input.minimumScore : 30;

    const auditId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      // 1. Candidate Retrieval
      const retrievalRes = await this.retriever.retrieveCandidates(query);

      if (retrievalRes.eligibleCandidates.length === 0) {
        const noMatchOutput: VisualResolverOutput = {
          queryId: query.queryId,
          retrievalStatus: retrievalRes.totalInspected > 0 ? 'FILTERED_BY_RIGHTS' : 'NO_REFERENCE_MATCH',
          mode,
          references: [],
          rankingVersion: RankingWeights.DEFAULT_CONFIG.version,
          auditId,
          explanation: `No approved, rights-confirmed candidates available. (Inspected: ${retrievalRes.totalInspected}, Excluded: ${retrievalRes.excludedCandidates.length}).`,
        };

        this.auditService.logRetrieval(noMatchOutput, query, startTime, retrievalRes.totalInspected, retrievalRes.excludedCandidates.length);
        return noMatchOutput;
      }

      // 2. Multi-Component Transparent Ranking
      const rankedCandidates: TransparentRankingResult[] = retrievalRes.eligibleCandidates
        .map((ref, idx) => VisualReferenceRanker.rankCandidate(ref, retrievalRes.normalizedQuery, idx + 1))
        .filter((r) => r.finalScore >= minimumScore)
        .sort((a, b) => b.finalScore - a.finalScore);

      // Re-assign rank position after sorting
      rankedCandidates.forEach((r, idx) => (r.rankPosition = idx + 1));

      if (rankedCandidates.length === 0) {
        const noMatchOutput: VisualResolverOutput = {
          queryId: query.queryId,
          retrievalStatus: 'NO_REFERENCE_MATCH',
          mode,
          references: [],
          rankingVersion: RankingWeights.DEFAULT_CONFIG.version,
          auditId,
          explanation: `Inspected ${retrievalRes.eligibleCandidates.length} eligible candidates, but none reached the minimum similarity threshold of ${minimumScore}.`,
        };

        this.auditService.logRetrieval(noMatchOutput, query, startTime, retrievalRes.totalInspected, retrievalRes.excludedCandidates.length);
        return noMatchOutput;
      }

      const topMatches = rankedCandidates.slice(0, limit);
      const topReferences = topMatches.map((m) => m.reference);
      const recommendedReference = mode === 'EXISTING_ASSET_SELECTION' ? topReferences[0] : undefined;

      // 3. Build Reference Enrichment Payload
      const enrichment = ReferenceEnrichmentBuilder.buildEnrichment(topReferences);

      const status: RetrievalStatus = topMatches[0].finalScore >= 75 ? 'MATCH_FOUND' : 'PARTIAL_MATCH';

      const output: VisualResolverOutput = {
        queryId: query.queryId,
        retrievalStatus: status,
        mode,
        references: topReferences,
        recommendedReference,
        enrichment,
        rankingVersion: RankingWeights.DEFAULT_CONFIG.version,
        auditId,
        explanation: `Resolved ${topReferences.length} candidates under mode ${mode}. Top match: "${topReferences[0].title}" (Score: ${topMatches[0].finalScore}).`,
        rankedCandidates: input.includeExplanations ? topMatches : undefined,
      };

      this.auditService.logRetrieval(output, query, startTime, retrievalRes.totalInspected, retrievalRes.excludedCandidates.length);
      return output;
    } catch (err: any) {
      const errorOutput: VisualResolverOutput = {
        queryId: query?.queryId || 'unknown_query',
        retrievalStatus: 'RETRIEVAL_ERROR',
        mode,
        references: [],
        rankingVersion: RankingWeights.DEFAULT_CONFIG.version,
        auditId,
        explanation: `Retrieval error: ${err.message}`,
      };

      this.auditService.logRetrieval(errorOutput, query, startTime, 0, 0, err.message);
      return errorOutput;
    }
  }
}
