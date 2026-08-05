# Pexels Search Specification — Mini Post App

Status: **Verified Backend Search Implementation**  
Runtime Implementation: `PexelsProvider.searchPhotos()` in [pexels.provider.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/pexels.provider.ts)

---

## Search Execution Logic

1. If `input.query` is present, `PexelsClient.search(query, page, perPage, orientation)` is invoked.
2. If `input.query` is empty or whitespace, `PexelsClient.getCurated(page, perPage)` is invoked as a fallback.
3. Pagination cap: `perPage` is automatically capped at 50 (`Math.min(input.perPage || 15, 50)`).
4. Orientation parameter supports `'landscape'`, `'portrait'`, `'square'`.
