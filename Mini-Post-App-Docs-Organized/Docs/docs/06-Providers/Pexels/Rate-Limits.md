# Pexels Rate Limits — Mini Post App

Status: **Verified Header Tracker Implementation**  
Source Reference: [pexels.rate-limit.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/pexels.rate-limit.ts)

---

## Rate Limit Tracking Logic

1. Pexels API provides 200 requests per hour by default on standard API keys.
2. `PexelsRateLimitTracker` parses response headers:
   - `X-Ratelimit-Limit`
   - `X-Ratelimit-Remaining`
   - `X-Ratelimit-Reset` (Unix timestamp in seconds)
3. **Exhaustion Guard**: Before sending any HTTP request, `PexelsClient` calls `PexelsRateLimitTracker.isExhausted()`. If `remaining <= 0` and current time is less than reset timestamp, `PexelsClient` throws `PexelsRateLimitError` immediately without executing an upstream network request.
