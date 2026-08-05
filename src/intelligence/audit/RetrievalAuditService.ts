import type { VisualResolverOutput } from '../resolution/resolution.types';
import type { VisualReferenceQuery } from '../retrieval/retrieval.types';

export interface RetrievalAuditEntry {
  auditId: string;
  queryId: string;
  normalizedSubject?: string;
  normalizedIndustry?: string;
  organizationScope?: string;
  candidateCount: number;
  excludedCount: number;
  topCandidateIds: string[];
  selectedCandidateId?: string;
  retrievalStatus: string;
  rankingVersion: string;
  durationMs: number;
  timestamp: string;
  errorMessage?: string;
}

export class RetrievalAuditService {
  private auditLogs: RetrievalAuditEntry[] = [];

  logRetrieval(
    output: VisualResolverOutput,
    query: VisualReferenceQuery,
    startTimeMs: number,
    candidateCount: number,
    excludedCount: number,
    errorMessage?: string
  ): RetrievalAuditEntry {
    const entry: RetrievalAuditEntry = {
      auditId: output.auditId,
      queryId: query.queryId,
      normalizedSubject: query.subject,
      normalizedIndustry: query.industry,
      organizationScope: query.organizationId || 'GLOBAL_APPROVED',
      candidateCount,
      excludedCount,
      topCandidateIds: output.references.map((r) => r.id),
      selectedCandidateId: output.recommendedReference?.id,
      retrievalStatus: output.retrievalStatus,
      rankingVersion: output.rankingVersion,
      durationMs: Date.now() - startTimeMs,
      timestamp: new Date().toISOString(),
      errorMessage,
    };

    this.auditLogs.push(entry);
    return entry;
  }

  getAuditLogs(): RetrievalAuditEntry[] {
    return [...this.auditLogs];
  }
}
