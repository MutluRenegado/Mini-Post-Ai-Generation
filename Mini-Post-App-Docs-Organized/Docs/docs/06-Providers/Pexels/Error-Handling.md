# Pexels Error Handling — Mini Post App

Status: **Verified Domain Error Classes**  
Source Implementation: [pexels.errors.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/pexels.errors.ts)

---

## Domain Error Class Hierarchy

```
PexelsError (base class, extends Error)
├── PexelsConfigurationError  (PEXELS_CONFIG_MISSING, HTTP 500)
├── PexelsAuthenticationError (PEXELS_AUTH_FAILED, HTTP 401)
├── PexelsRateLimitError      (PEXELS_RATE_LIMIT_EXCEEDED, HTTP 429)
└── PexelsNotFoundError       (PEXELS_NOT_FOUND, HTTP 404)
```

All errors sanitize messages to ensure secret API keys are never included in error output.
