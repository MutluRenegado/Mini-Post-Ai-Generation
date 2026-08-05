# Unsplash Caching — Mini Post App

Status: **Planned Specification**

---

## Caching Guidelines

- In-memory rate limit state caching inside `UnsplashRateLimitTracker`.
- HTTP standard response caching for static photo lookups (`Cache-Control: max-age=...`).
