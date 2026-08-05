# Pexels Integration Overview

The Pexels Stock Photo Integration provides stock photo searching, collection browsing, and selective photo importing directly into the Mini Post App Image Library (`src/library/`).

## Key Guarantees
- **Brand Enforcement**: Customer-visible brand is strictly **Mini Post App**.
- **Secret Security**: Accesses `process.env.PEXELS_API_KEY` server-side only. Secret is never sent to the browser.
- **Provider-Neutral Interface**: Uses `ExternalImageProvider` (`src/providers/external-image-provider.interface.ts`).
- **Selective Import**: Default import limit 20 (hard cap 50).
- **Mandatory Unreviewed State**: Imported images start as `PENDING`, `rightsConfirmed: false`, `commercialUseReviewStatus: 'PENDING'`.
