# Provider Architecture Standard — Mini Post App

Status: **Verified Mandatory Standard**  
Target Scope: All Stock Image Provider Integrations  
Authoritative Code Interface: [external-image-provider.interface.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/external-image-provider.interface.ts)

---

## 1. Core Architectural Mandates

All stock photo provider integrations in Mini Post App MUST strictly adhere to the following core architectural rules:

### Rule 1 — Single Provider, Single Isolated Directory
Every provider MUST exist in its own self-contained directory under `src/providers/<provider-id>/` (e.g., `src/providers/pexels/`, `src/providers/pixabay/`).

Each provider directory MUST contain its own dedicated components:
- `index.ts` — Barrel export for the provider module.
- `<provider>.client.ts` — Isolated HTTP client handling API requests, headers, and timeouts.
- `<provider>.provider.ts` — Implementation of `ExternalImageProvider`.
- `<provider>.mapper.ts` — Data transformation logic mapping native API JSON to `ExternalImageAsset`.
- `<provider>.types.ts` — TypeScript interfaces for native API request and response structures.
- `<provider>.errors.ts` — Custom error domain classes extending `PexelsError` / `ProviderError`.
- `<provider>.rate-limit.ts` — Server-side in-memory rate limit header tracker.
- `tests/` — Directory containing isolated integration unit tests.

### Rule 2 — Absolute Module Independence
No provider module may import implementation details, types, error classes, or clients from another provider module. Cross-provider imports are strictly forbidden to prevent cascading breakages. Shared logic must reside exclusively in root provider contracts (`src/providers/external-image-provider.interface.ts`).

### Rule 3 — Strict Server-Side Authentication
Provider API credentials MUST NEVER be accessible to the client or bundled into browser code.
- All requests to external provider APIs MUST originate from server-side code (Next.js API routes or Server Actions).
- Provider API keys MUST NOT use the `NEXT_PUBLIC_` prefix.
- Keys MUST be loaded via `process.env.<PROVIDER>_API_KEY` bound through Secret Manager.

### Rule 4 — Provider-Neutral Interface Contract
All providers MUST implement the standard `ExternalImageProvider` interface:

```typescript
export interface ExternalImageProvider {
  providerId: string;
  searchPhotos(input: ExternalImageSearchInput): Promise<ExternalImageSearchResult>;
  getPhoto(id: string): Promise<ExternalImageAsset>;
  listCollections?(input: CollectionListInput): Promise<CollectionListResult>;
  getCollectionPhotos?(
    collectionId: string,
    input: ExternalImageSearchInput
  ): Promise<ExternalImageSearchResult>;
}
```

### Rule 5 — Additive Integration & Zero Regression Guarantee
Adding a new provider or modifying an existing provider MUST NOT require changing existing provider modules. All provider integrations MUST be purely additive. Existing test suites MUST pass without modification.

---

## 2. Directory & Module Boundaries

```
src/providers/
├── external-image-provider.interface.ts  <-- Shared contract (Read-only for providers)
├── pexels/                                <-- Isolated Pexels module
│   ├── index.ts
│   ├── pexels.client.ts
│   ├── pexels.errors.ts
│   ├── pexels.mapper.ts
│   ├── pexels.provider.ts
│   ├── pexels.rate-limit.ts
│   ├── pexels.types.ts
│   └── tests/
│       └── pexels-integration.test.ts
├── pixabay/                               <-- Planned isolated Pixabay module
└── unsplash/                               <-- Planned isolated Unsplash module
```

---

## 3. Mandatory Error & Rate Limit Controls

1. **Timeout Control**: Every provider HTTP client MUST implement an `AbortController` timeout cap of 15 seconds.
2. **Rate Limit Parsing**: Every provider MUST parse rate-limit HTTP response headers (e.g. `X-Ratelimit-Remaining`) and maintain an in-memory tracker to prevent sending requests when quota is exhausted.
3. **Error Redaction**: Provider error classes MUST sanitize messages and stack traces to guarantee zero key leakage.
