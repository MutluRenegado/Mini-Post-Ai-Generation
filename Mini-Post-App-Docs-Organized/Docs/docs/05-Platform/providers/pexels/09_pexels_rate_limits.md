# Pexels Rate Limit Management

Pexels API headers parsed:
- `X-Ratelimit-Limit`
- `X-Ratelimit-Remaining`
- `X-Ratelimit-Reset`

Tracked by `PexelsRateLimitTracker`. Stops requests automatically when rate limit is exhausted to prevent account suspension.
