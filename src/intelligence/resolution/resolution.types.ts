import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { VisualReferenceQuery } from '../retrieval/retrieval.types';
import type { TransparentRankingResult } from '../ranking/ranking.types';

export type ResolverMode = 'REFERENCE_ENRICHMENT' | 'USER_SELECTION' | 'EXISTING_ASSET_SELECTION';

export type RetrievalStatus =
  | 'MATCH_FOUND'
  | 'PARTIAL_MATCH'
  | 'NO_REFERENCE_MATCH'
  | 'FILTERED_BY_RIGHTS'
  | 'FILTERED_BY_AVAILABILITY'
  | 'INVALID_QUERY'
  | 'RETRIEVAL_ERROR';

export interface ReferenceEnrichmentData {
  suggestedScene?: string;
  suggestedRoles?: string[];
  suggestedObjects?: string[];
  suggestedEnvironment?: string;
  suggestedLighting?: string;
  suggestedComposition?: string;
  suggestedCameraAngle?: string;
  suggestedMood?: string;
  suggestedVisualStyle?: string;
  suggestedColors?: string[];
  mustInclude?: string[];
  mustAvoid?: string[];
  referenceIdsUsed: string[];
  confidenceStatus: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
}

export interface VisualResolverInput {
  query: VisualReferenceQuery;
  mode?: ResolverMode;
  limit?: number;
  minimumScore?: number;
  includeExplanations?: boolean;
}

export interface VisualResolverOutput {
  queryId: string;
  retrievalStatus: RetrievalStatus;
  mode: ResolverMode;
  references: VisualReference[];
  recommendedReference?: VisualReference;
  enrichment?: ReferenceEnrichmentData;
  rankingVersion: string;
  auditId: string;
  explanation: string;
  rankedCandidates?: TransparentRankingResult[];
}
