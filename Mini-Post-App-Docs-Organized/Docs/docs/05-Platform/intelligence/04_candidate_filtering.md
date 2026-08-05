# Approved-Only Candidate Filtering

Only candidates satisfying ALL required conditions participate in retrieval:
- `reviewStatus === 'APPROVED'`
- `rightsConfirmed === true`
- `commercialUseReviewStatus === 'APPROVED'`
- `sourceAvailability === 'AVAILABLE'`
- Not archived & not rejected
- Organization scope match (`PRIVATE`, `ORGANIZATION`, `GLOBAL_APPROVED`)

Pending, rejected, archived, missing, or rights-unconfirmed records are strictly excluded.
