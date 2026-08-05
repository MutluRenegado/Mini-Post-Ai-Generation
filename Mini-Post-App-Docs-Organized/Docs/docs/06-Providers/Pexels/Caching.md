# Pexels Caching — Mini Post App

Status: **Verified Behavior**

---

## Caching Behavior

- **Rate Limit State**: In-memory rate limit header values are cached globally within `PexelsRateLimitTracker`.
- **Search & Photo Response Caching**: Upstream Pexels API responses leverage standard HTTP cache control headers (`Cache-Control: max-age=...`). Advanced server-side redis caching is **Planned / Not Implemented**.
