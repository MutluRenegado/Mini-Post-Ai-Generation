# Pexels Provider Architecture — Mini Post App

Status: **Verified Architecture**  
Runtime Module: [src/providers/pexels/](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/)

---

## 1. Directory Component Structure

```
src/providers/pexels/
├── index.ts                 # Barrel exports for Pexels module
├── pexels.types.ts          # TypeScript interfaces for raw Pexels JSON payloads
├── pexels.errors.ts         # Pexels error domain classes (PexelsError hierarchy)
├── pexels.rate-limit.ts     # In-memory X-Ratelimit response header tracker
├── pexels.client.ts         # Static HTTP fetch client with 15s timeout
├── pexels.mapper.ts         # Raw JSON to ExternalImageAsset data transformer
├── pexels.provider.ts       # Implementation of ExternalImageProvider interface
└── tests/
    └── pexels-integration.test.ts # 7-point isolated node:test integration suite
```

---

## 2. Component Responsibility Breakdown

1. **`PexelsClient`**: Handles outbound HTTP requests to `https://api.pexels.com/v1/`. Reads `process.env.PEXELS_API_KEY`, sets `Authorization` header, enforces 15-second timeout, updates `PexelsRateLimitTracker`, and translates HTTP error status codes into domain error exceptions.
2. **`PexelsMapper`**: Maps raw native `RawPexelsPhoto` objects into normalized `ExternalImageAsset` structures. Constructs `attributionText` ("Photo by [Photographer] on Pexels") and `attributionUrl`.
3. **`PexelsRateLimitTracker`**: Parses `X-Ratelimit-Limit`, `X-Ratelimit-Remaining`, and `X-Ratelimit-Reset` headers. Rejects requests immediately if remaining requests hit 0.
4. **`PexelsProvider`**: Wraps client and mapper methods behind the `ExternalImageProvider` contract.
