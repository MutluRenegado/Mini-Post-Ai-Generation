# Provider Router Architecture — Mini Post App

**Directory Path:** `docs/Image Pipeline Repair/provider_router.md`  
**Adapter:** `LiveImageProviderAdapter.ts` (`src/modules/image-kernel/`)  
**Date:** August 2, 2026  

---

## Provider Router Specification

- **Provider Independence**: Router accepts `generateImage({ prompt, negativePrompt, width, height, aspectRatio, style, seed, provider })`.
- **Supported Providers**: Pollinations AI, Unsplash, stability/gemini fallback adapters.
- **Failover Logic**: Seamlessly switches provider if primary provider returns rate limit or 5xx error.

---
*Specification maintained by Antigravity Agent.*
