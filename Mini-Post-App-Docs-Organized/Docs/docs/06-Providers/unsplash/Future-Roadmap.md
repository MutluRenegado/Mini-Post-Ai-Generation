# Unsplash Future Roadmap — Mini Post App

Status: **Planned Roadmap**

---

## Planned Implementation Phases

1. Create `src/providers/unsplash/` isolated module (`UnsplashClient`, `UnsplashProvider`, `UnsplashMapper`, `UnsplashRateLimitTracker`).
2. Bind `UNSPLASH_ACCESS_KEY` in Secret Manager and `apphosting.yaml`.
3. Implement mandatory server-side download tracking trigger logic.
4. Implement photographer UTM link formatting in UI components.
5. Connect Unsplash provider into Image Creator UI search.
