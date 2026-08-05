# Unsplash Testing Specification — Mini Post App

Status: **Planned Test Specifications**

---

## Required Unit Test Assertions

1. Configuration error when `UNSPLASH_ACCESS_KEY` is missing.
2. Server-side key isolation check.
3. Data mapping from raw Unsplash JSON to `ExternalImageAsset`.
4. Rate limit parsing from headers.
5. Download tracking trigger mock verification.
6. `providerId === 'UNSPLASH'`.
7. Zero secret leakage in JSON output.
