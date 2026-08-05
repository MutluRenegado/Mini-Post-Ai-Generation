# Provider Router Architecture — Mini Post App

Status: **Verified Architecture Specification**  
Runtime Adapters: `src/modules/image-kernel/LiveImageProviderAdapter.ts` & `src/providers/external-image-provider.interface.ts`

---

## 1. Provider Router Overview

The Provider Router coordinates requests across multiple stock image providers and AI generation adapters. It presents a unified execution gateway to upper-level application features (Image Creator, Asset Library) while enforcing server-only authentication, provider independence, and failover resilience.

---

## 2. Architectural Design & Flow

```
[UI Components: Image Creator / Asset Library]
                    │
                    ▼ (Server-Side Route Request)
      [Server API / Image Kernel]
                    │
                    ▼
          [Provider Router / Adapter]
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   [Pexels]     [Pixabay]   [Unsplash]
(Implemented)   (Planned)    (Planned)
```

---

## 3. Mandatory Provider Router Rules

1. **Server-Side Only**: Provider selection, credential resolution, and HTTP dispatch MUST occur exclusively on the server.
2. **Provider Neutrality**: Upper-level components interact solely with standard `ExternalImageSearchResult` and `ExternalImageAsset` payloads.
3. **Failover Execution**: If a primary provider returns an HTTP 429 Rate Limit Exceeded or HTTP 5xx Server Error, the router automatically attempts dispatch to secondary available providers.
4. **Normalized Error Handling**: Provider-specific errors (e.g. `PexelsRateLimitError`) are mapped into normalized platform error structures before returning responses to the caller.
5. **Federated Search (Status: Planned)**: Multi-provider query aggregation (executing simultaneous searches across Pexels, Pixabay, and Unsplash and merging results by relevance score) is documented as **Planned** functionality.
