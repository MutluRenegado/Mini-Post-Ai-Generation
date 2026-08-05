# Pexels Mapping Specification — Mini Post App

Status: **Verified Data Transformation**  
Source Implementation: [pexels.mapper.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/pexels.mapper.ts)

---

## Field Transformation Matrix

| `RawPexelsPhoto` Field | `ExternalImageAsset` Field | Transformation Rule |
| :--- | :--- | :--- |
| `photo.id` | `asset.id` | Converted to string (`photo.id.toString()`) |
| `'PEXELS'` | `asset.provider` | Hardcoded string `'PEXELS'` |
| `photo.width` | `asset.width` | Direct number assignment |
| `photo.height` | `asset.height` | Direct number assignment |
| `photo.url` | `asset.url` | Pexels photo page URL |
| `photo.photographer` | `asset.photographerName` | Fallback to `'Pexels Contributor'` if missing |
| `photo.photographer_url` | `asset.photographerUrl` | Fallback to `'https://www.pexels.com'` |
| `photo.src.large2x` | `asset.sourceImageUrl` | Fallback order: `large2x` -> `large` -> `original` |
| `photo.src.medium` | `asset.thumbnailUrl` | Fallback order: `medium` -> `small` -> `tiny` |
| `photo.alt` | `asset.altText` | Fallback to `'Photo by [Photographer] on Pexels'` |
| `photo.avg_color` | `asset.averageColor` | Direct hex string assignment |
| — | `asset.attributionText` | Constructed: `'Photo by ' + photographerName + ' on Pexels'` |
| `photo.url` | `asset.attributionUrl` | Pexels asset webpage URL |
| `photo` | `asset.raw` | Native API response object preserved server-side |
