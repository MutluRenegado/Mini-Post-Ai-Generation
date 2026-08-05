# Unsplash Rate Limits — Mini Post App

Status: **Planned Specification**

---

## Rate Limit Governance

- **Demo Tier Limit**: 50 requests per hour.
- **Production Tier Limit**: 5,000 requests per hour.
- Response headers: `X-Ratelimit-Limit`, `X-Ratelimit-Remaining`.
- `UnsplashRateLimitTracker` will track remaining quota in-memory and halt requests when quota reaches 0.
