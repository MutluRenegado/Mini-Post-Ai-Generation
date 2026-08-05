# Pexels Troubleshooting — Mini Post App

Status: **Verified Guide**

---

## Common Issues & Solutions

1. **`PexelsConfigurationError: PEXELS_API_KEY is not defined`**:
   - Cause: Missing secret variable.
   - Solution: Add `PEXELS_API_KEY` to `.env.local` locally or check Secret Manager binding in `apphosting.yaml`.
2. **`PexelsRateLimitError` (HTTP 429)**:
   - Cause: Exceeded 200 requests/hour limit.
   - Solution: Wait until the rate-limit reset window expires or request an upgraded API key limit from Pexels.
3. **`PexelsAuthenticationError` (HTTP 401)**:
   - Cause: Invalid or revoked API key string.
   - Solution: Re-issue key in Pexels developer portal and update Secret Manager.
