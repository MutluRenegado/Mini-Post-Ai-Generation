# Provider Development Guide — Mini Post App

Status: **Verified Standard Workflow**  
Scope: Guidelines for introducing and maintaining stock photo providers.

---

## 1. The 14-Phase Provider Onboarding Lifecycle

When adding a new stock photo provider (or completing a planned provider such as Pixabay or Unsplash), developer workflows MUST follow these 14 sequential phases:

```
[Phase 1: Research] ──> [Phase 2: Directory] ──> [Phase 3: Auth] ──> [Phase 4: Req Types]
                                                                            │
[Phase 8: Provider] <── [Phase 7: Mapper] <── [Phase 6: Client] <── [Phase 5: Res Types]
        │
        ├───> [Phase 9: Registry] ──> [Phase 10: Secret Binding] ──> [Phase 11: Unit Tests]
        │
        └───> [Phase 12: Regressions] ──> [Phase 13: Docs] ──> [Phase 14: UI Connection Phase]
```

### Phase 1: Research Provider API & Terms
Inspect official API documentation, rate limits, authentication schemes, license agreements, hotlinking policies, and attribution rules. Document findings in `docs/Providers/<ProviderName>/README.md`.

### Phase 2: Create Isolated Runtime Folder
Create a dedicated runtime module directory: `src/providers/<provider-id>/` (lowercase directory name).

### Phase 3: Define Authentication Strategy
Determine whether the API uses header-based bearer tokens (`Authorization: KEY`), query parameters (`?key=KEY`), or OAuth access tokens. Ensure credentials remain strictly server-side.

### Phase 4: Define Request Types & Parameters
Create `<provider>.types.ts` defining search input parameters, filters, pagination inputs, and query parameters.

### Phase 5: Define Native Response Payloads
Add typed TypeScript interfaces matching the raw JSON payload structures returned by the provider's API endpoints.

### Phase 6: Implement HTTP Client
Create `<provider>.client.ts` with static methods for API interaction:
- Read secret via `process.env.<PROVIDER>_API_KEY`.
- Enforce 15-second HTTP request timeout via `AbortController`.
- Parse rate-limit response headers and update rate-limit tracker.
- Throw custom domain error classes on HTTP errors (401, 404, 429, 500).

### Phase 7: Implement Data Mapper
Create `<provider>.mapper.ts` implementing transformation from raw native JSON objects to normalized `ExternalImageAsset` records:
- Preserve provider asset ID.
- Extract image URLs (original, large, medium, thumbnail).
- Preserve photographer name and photographer profile URL.
- Construct standardized `attributionText` and `attributionUrl`.

### Phase 8: Implement Provider Wrapper Class
Create `<provider>.provider.ts` implementing `ExternalImageProvider`. Assign standard uppercase `providerId` (e.g. `'PIXABAY'`, `'UNSPLASH'`).

### Phase 9: Register Provider
Register the new provider instance in `ProviderRegistry` and the server-side router.

### Phase 10: Add Secret Manager Binding
Bind the secret environment variable in `apphosting.yaml` and verify local `.env.local` fallback parsing.

### Phase 11: Write Isolated Unit Tests
Create `tests/<provider>-integration.test.ts` covering missing key errors, photo normalization, rate limit parsing, and zero secret key leakage.

### Phase 12: Run Regression Test Suites
Execute all existing provider tests and system regression suites to verify zero breaking changes.

### Phase 13: Complete Documentation Package
Populate all 21 (or 22) markdown files under `docs/Providers/<ProviderName>/`.

### Phase 14: Separate UI Connection Phase
Connect provider backend endpoints to UI components (Image Creator, Asset Library) in a distinct, approved implementation task. Never mix UI wiring with provider client development.
