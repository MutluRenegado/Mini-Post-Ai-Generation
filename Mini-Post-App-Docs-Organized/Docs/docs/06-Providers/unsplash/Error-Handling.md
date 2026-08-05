# Unsplash Error Handling — Mini Post App

Status: **Planned Specification**

---

## Planned Domain Error Hierarchy

```
UnsplashError (base class)
├── UnsplashConfigurationError  (Missing UNSPLASH_ACCESS_KEY)
├── UnsplashAuthenticationError (HTTP 401 / Invalid access key)
├── UnsplashRateLimitError      (HTTP 429 / Quota exceeded)
└── UnsplashNotFoundError       (HTTP 404 / Photo not found)
```
