# Pixabay Testing Specification — Mini Post App

Status: **Planned Test Specifications**

---

## Planned Test Assertions

When implemented, `src/providers/pixabay/tests/pixabay-integration.test.ts` MUST implement the standard 7 test assertions:
1. Missing `PIXABAY_API_KEY` configuration error.
2. Server-side key isolation (zero `NEXT_PUBLIC_` key).
3. Data mapping from raw Pixabay JSON to `ExternalImageAsset`.
4. Rate limit parsing from headers.
5. Rate limit exhaustion guard.
6. `providerId === 'PIXABAY'`.
7. Zero key leakage in JSON serialized outputs.
