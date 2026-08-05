import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { NormalizedQuery } from './retrieval.types';

export interface FilterResult {
  eligibleCandidates: VisualReference[];
  excludedCandidates: { reference: VisualReference; reason: string }[];
}

export class CandidateFilter {
  /**
   * Filters candidates according to Phase 2A approved-only rights gate and organization scoping.
   */
  static filterCandidates(
    candidates: VisualReference[],
    normalizedQuery: NormalizedQuery
  ): FilterResult {
    const query = normalizedQuery.originalQuery;
    const eligibleCandidates: VisualReference[] = [];
    const excludedCandidates: { reference: VisualReference; reason: string }[] = [];

    const excludedIds = new Set(query.excludedReferenceIds || []);

    for (const ref of candidates) {
      // 1. Exclude explicitly listed IDs
      if (excludedIds.has(ref.id)) {
        excludedCandidates.push({ reference: ref, reason: 'Explicitly excluded in query.' });
        continue;
      }

      // 2. Mandatory Phase 2A Rights & Status Gate
      if (ref.review?.status !== 'APPROVED') {
        excludedCandidates.push({
          reference: ref,
          reason: `Review status is ${ref.review?.status} (Must be APPROVED).`,
        });
        continue;
      }

      if (!ref.rights?.rightsConfirmed) {
        excludedCandidates.push({
          reference: ref,
          reason: 'Commercial rights remain unconfirmed (rightsConfirmed === false).',
        });
        continue;
      }

      if (ref.rights?.commercialUseReviewStatus !== 'APPROVED') {
        excludedCandidates.push({
          reference: ref,
          reason: `Commercial use review status is ${ref.rights?.commercialUseReviewStatus} (Must be APPROVED).`,
        });
        continue;
      }

      if (ref.sourceAvailability === 'MISSING') {
        excludedCandidates.push({
          reference: ref,
          reason: 'Source photograph file is missing on local storage (sourceAvailability === MISSING).',
        });
        continue;
      }

      // 3. Organization & Visibility Scope Filtering
      if (query.organizationId && ref.rights?.ownerId) {
        if (ref.rights.ownerId !== query.organizationId && ref.rights.ownerId !== 'GLOBAL') {
          excludedCandidates.push({
            reference: ref,
            reason: `Cross-organization boundary violation. Asset owned by ${ref.rights.ownerId}, query org is ${query.organizationId}.`,
          });
          continue;
        }
      }

      // Candidate passed all hard gates
      eligibleCandidates.push(ref);
    }

    return {
      eligibleCandidates,
      excludedCandidates,
    };
  }
}
