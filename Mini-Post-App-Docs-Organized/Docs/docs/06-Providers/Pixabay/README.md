# Pixabay Provider Documentation — Mini Post App

Status: **Planned Integration**  
Runtime Module Path: `src/providers/pixabay/` (Planned)  
Secret Binding: `PIXABAY_API_KEY` (Planned)

---

## 1. Overview & Integration Scope

The Pixabay Stock Media Integration will provide stock photo and illustration search capabilities for Mini Post App using the official Pixabay REST API (`https://pixabay.com/api/`).

All runtime code, secret bindings, client mappers, and UI components described in this folder represent **Planned** standards and are not currently active in production runtime source code.

---

## 2. Key Compliance & Technical Requirements

- **Base Endpoint**: `https://pixabay.com/api/`
- **Secret Variable**: `PIXABAY_API_KEY` (Server-only query parameter auth).
- **Mandatory 24-Hour Cache**: Search results MUST be cached locally/in-memory for at least 24 hours per Pixabay API terms.
- **Permanent Hotlinking Restrictions**: Permanent hotlinking of Pixabay CDN image URLs in published posts is strictly prohibited. Selected images MUST be downloaded to approved local or Firebase storage prior to permanent publishing.
- **Attribution & Metadata**: Contributor username, user ID, profile link, and source page link MUST be preserved.

---

## 3. Documentation Index

- [Architecture.md](./Architecture.md) — Planned isolated module structure.
- [API.md](./API.md) — Endpoint specifications and parameter boundaries.
- [Authentication.md](./Authentication.md) — Server-side query parameter key injection rules.
- [Configuration.md](./Configuration.md) — Planned environment variable setup.
- [Secret-Manager.md](./Secret-Manager.md) — App Hosting binding requirements.
- [Endpoints.md](./Endpoints.md) — Upstream and internal planned routes.
- [Search.md](./Search.md) — Query filtering, orientation, and 100-character caps.
- [Mapping.md](./Mapping.md) — Transformation mapping to `ExternalImageAsset`.
- [Image-Model.md](./Image-Model.md) — Canonical model normalization.
- [Rate-Limits.md](./Rate-Limits.md) — Rate limit header parsing rules.
- [Caching.md](./Caching.md) — Mandatory 24-hour search cache specification.
- [Error-Handling.md](./Error-Handling.md) — Planned domain error classes.
- [Attribution.md](./Attribution.md) — Contributor credit display standards.
- [Licensing.md](./Licensing.md) — Pixabay Content License compliance.
- [Storage.md](./Storage.md) — Server-side download and anti-hotlinking rules.
- [Security.md](./Security.md) — Query key redaction and SSRF prevention.
- [Testing.md](./Testing.md) — Required test coverage specifications.
- [Troubleshooting.md](./Troubleshooting.md) — Common error resolution guide.
- [Changelog.md](./Changelog.md) — Version history.
- [Future-Roadmap.md](./Future-Roadmap.md) — Implementation schedule.
