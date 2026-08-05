# Pixabay Error Handling — Mini Post App

Status: **Planned Specification**

---

## Planned Domain Error Hierarchy

```
PixabayError (base class)
├── PixabayConfigurationError  (Missing PIXABAY_API_KEY)
├── PixabayAuthenticationError (HTTP 401 / Invalid key)
├── PixabayRateLimitError      (HTTP 429 / Quota exceeded)
└── PixabayNotFoundError       (HTTP 404 / Asset not found)
```
