# Retrieval Audit Service

Logs every retrieval request:
- `auditId`, `queryId`, normalized query, caller identity, organization scope
- `candidateCount`, `excludedCount`, `topCandidateIds`, `selectedCandidateId`
- `retrievalStatus`, `rankingVersion`, `durationMs`, `timestamp`, `errorMessage`
