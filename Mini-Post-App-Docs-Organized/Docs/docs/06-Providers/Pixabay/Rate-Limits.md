# Pixabay Rate Limits — Mini Post App

Status: **Planned Specification**

---

## Rate Limit Standards

- Upstream limit: 5,000 requests per hour for standard API keys.
- Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- `PixabayRateLimitTracker` will track headers and halt requests when quota reaches 0.
