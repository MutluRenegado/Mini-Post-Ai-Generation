# Pexels Security & Scope

- `process.env.PEXELS_API_KEY` is referenced exclusively on the server.
- All `/api/admin/pexels/*` endpoints run server-side and require admin authorization.
- Zero secret values appear in HTTP API responses or client bundles.
