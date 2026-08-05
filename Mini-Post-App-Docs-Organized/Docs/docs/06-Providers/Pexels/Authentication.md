# Pexels Authentication — Mini Post App

Status: **Verified Security Protocol**  
Runtime Verification: `PexelsClient.getApiKey()` in [pexels.client.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/pexels.client.ts)

---

## 1. Authentication Protocol

Pexels API uses single API key header-based authentication:
- **Header Name**: `Authorization`
- **Header Value**: `<PEXELS_API_KEY>` (raw key string without Bearer prefix, as required by Pexels API).

---

## 2. Server-Only Execution Rules

- The key is read dynamically at request time via `process.env.PEXELS_API_KEY`.
- If `PEXELS_API_KEY` is missing or empty, `PexelsClient` throws `PexelsConfigurationError('PEXELS_API_KEY is not defined in server environment secrets.')`.
- The secret is NEVER sent to the client browser or included in frontend JavaScript bundles.
- Unit tests verify `process.env.NEXT_PUBLIC_PEXELS_API_KEY` is `undefined`.
