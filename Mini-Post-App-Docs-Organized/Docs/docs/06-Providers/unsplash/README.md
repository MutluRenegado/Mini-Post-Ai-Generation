# Unsplash Provider Documentation — Mini Post App

Status: **Partial / Planned**  
Target Directory: `src/providers/unsplash/` (Planned)  
Secret Binding: `UNSPLASH_ACCESS_KEY` (Planned)

---

## 1. Overview & Scope

The Unsplash Stock Photo Integration will provide high-resolution photo search capabilities for Mini Post App via the official Unsplash API (`https://api.unsplash.com/`).

---

## 2. Mandatory Unsplash API Guidelines Summary

1. **Header Authentication**: Requests MUST pass `Authorization: Client-ID UNSPLASH_ACCESS_KEY` server-side.
2. **Mandatory Download Tracking**: Whenever an Unsplash image is selected or downloaded for use in a post, the app MUST trigger a call to the photo's `links.download_location` endpoint. (See [Download-Tracking.md](./Download-Tracking.md)).
3. **Photographer Credit & Referral Parameters**: Attribution links MUST include UTM referral parameters (`utm_source=mini_post_app&utm_medium=referral`).
4. **Rate Limit Awareness**: Demo tier apps are capped at 50 requests/hour; Production tier apps receive 5,000 requests/hour.

---

## 3. Documentation Index

- [Architecture.md](./Architecture.md) — Planned module design.
- [API.md](./API.md) — Upstream endpoints and parameters.
- [Authentication.md](./Authentication.md) — Access key header format rules.
- [Configuration.md](./Configuration.md) — Environment variable specifications.
- [Secret-Manager.md](./Secret-Manager.md) — Secret Manager binding standards.
- [Endpoints.md](./Endpoints.md) — External and internal route definitions.
- [Search.md](./Search.md) — Photo search query, orientation, and color filters.
- [Mapping.md](./Mapping.md) — Unsplash JSON mapping to `ExternalImageAsset`.
- [Image-Model.md](./Image-Model.md) — Canonical image model alignment.
- [Rate-Limits.md](./Rate-Limits.md) — Demo vs Production rate limit header handling.
- [Download-Tracking.md](./Download-Tracking.md) — Mandatory download tracking trigger specification.
- [Caching.md](./Caching.md) — Response caching guidelines.
- [Error-Handling.md](./Error-Handling.md) — Domain error hierarchy.
- [Attribution.md](./Attribution.md) — Photographer credit & UTM parameters.
- [Licensing.md](./Licensing.md) — Unsplash license terms governance.
- [Storage.md](./Storage.md) — Selective import and CDN hotlinking rules.
- [Security.md](./Security.md) — Access key protection and URL sanitization.
- [Testing.md](./Testing.md) — Test suite requirements.
- [Troubleshooting.md](./Troubleshooting.md) — Common error fixes.
- [Changelog.md](./Changelog.md) — Change history.
- [Future-Roadmap.md](./Future-Roadmap.md) — Planned implementation phases.
