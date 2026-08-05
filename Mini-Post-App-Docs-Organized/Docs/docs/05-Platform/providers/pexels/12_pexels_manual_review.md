# Pexels Manual Review Checklist

Checklist:
- [x] Brand Enforcement: Customer-visible brand is strictly **Mini Post App**.
- [x] Secret Manager Key: `PEXELS_API_KEY` referenced in `apphosting.yaml` and `process.env.PEXELS_API_KEY`.
- [x] Provider Module: Dedicated `src/providers/pexels/` implementation.
- [x] Server API Routes: `/api/admin/pexels/*` protected routes active.
- [x] Selective Import: Default max 20, hard cap 50.
- [x] Mandatory Unreviewed State: Imported records start as `PENDING`, `rightsConfirmed: false`, `commercialUseReviewStatus: 'PENDING'`.
- [x] Source Attribution: Full attribution stored (`photographerName`, `attributionText`).
- [x] Duplicate Control: Checked against `ALREADY_IMPORTED`, `EXACT_DUPLICATE`, `NEAR_DUPLICATE`.
- [x] Test Coverage: Provider test suite, Phase 2A regression, Phase 2B regression passed.
- [x] Build Verification: `npx tsc --noEmit` passed with 0 errors.
