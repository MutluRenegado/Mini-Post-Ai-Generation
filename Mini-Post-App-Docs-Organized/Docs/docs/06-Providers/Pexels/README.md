# Pexels Provider Documentation — Mini Post App

Status: **Implemented (Backend Module)** / **Partial (UI Wiring)**  
Runtime Location: [src/providers/pexels/](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/)  
Secret Binding: `PEXELS_API_KEY` (Firebase App Hosting bound)

---

## 1. Overview & Purpose

The Pexels Stock Photo Provider integration allows Mini Post App to search, browse collections, and selectively import stock photos from the Pexels API (`https://api.pexels.com/v1`).

The backend module is fully implemented in TypeScript, follows the provider-neutral `ExternalImageProvider` contract, and passes an isolated 7-point integration test suite (`src/providers/pexels/tests/pexels-integration.test.ts`).

---

## 2. Status Summary

| Aspect | Status | Evidence / Location |
| :--- | :--- | :--- |
| **Provider Module** | `Implemented` | `src/providers/pexels/` (client, provider, mapper, rate-limit, errors) |
| **Unit Tests** | `Verified` | `src/providers/pexels/tests/pexels-integration.test.ts` (7 / 7 PASSED) |
| **Secret Configuration** | `Verified` | Bound in `apphosting.yaml` as `PEXELS_API_KEY` |
| **Server API Routes** | `Implemented` | `/api/admin/pexels/status`, `/api/admin/pexels/search`, `/api/admin/pexels/import` |
| **UI Integration** | `Partial` / `Orphaned` | Admin routes exist; main Image Creator UI wiring is pending verification |
| **Production Deployment** | `Pending Verification` | Requires complete UI wiring verification |

---

## 3. Provider Documentation Index

- [Architecture.md](./Architecture.md) — Internal components, call graph, and dependencies.
- [API.md](./API.md) — Upstream Pexels API endpoints and capabilities.
- [Authentication.md](./Authentication.md) — Server-side API key header authentication rules.
- [Configuration.md](./Configuration.md) — Environment variable setup.
- [Secret-Manager.md](./Secret-Manager.md) — App Hosting binding and rotation.
- [Endpoints.md](./Endpoints.md) — Admin and backend API route specifications.
- [Search.md](./Search.md) — Photo search query inputs, pagination, and orientation options.
- [Mapping.md](./Mapping.md) — Field transformation from `RawPexelsPhoto` to `ExternalImageAsset`.
- [Image-Model.md](./Image-Model.md) — Provider image representation.
- [Rate-Limits.md](./Rate-Limits.md) — Header tracking (`X-Ratelimit-Remaining`) and exhaustion protection.
- [Caching.md](./Caching.md) — In-memory caching and header evaluation.
- [Error-Handling.md](./Error-Handling.md) — Custom error domain classes (`PexelsConfigurationError`, `PexelsRateLimitError`).
- [Attribution.md](./Attribution.md) — Photographer credit rules (`Photo by [Photographer] on Pexels`).
- [Licensing.md](./Licensing.md) — Pexels free commercial license compliance.
- [Storage.md](./Storage.md) — Selective import to local library (`01_Incoming`).
- [Security.md](./Security.md) — Zero client key exposure and key redaction.
- [Testing.md](./Testing.md) — Test suite results and assertions.
- [Troubleshooting.md](./Troubleshooting.md) — Common error resolution steps.
- [Changelog.md](./Changelog.md) — Verified historical change log.
- [Future-Roadmap.md](./Future-Roadmap.md) — Planned UI integration and enhancements.
