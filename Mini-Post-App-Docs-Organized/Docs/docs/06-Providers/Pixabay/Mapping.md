# Pixabay Mapping Specification — Mini Post App

Status: **Planned Data Mapping**

---

## Field Transformation Matrix (Planned)

| Pixabay JSON Field | `ExternalImageAsset` Target Field | Transformation Logic |
| :--- | :--- | :--- |
| `hit.id` | `asset.id` | `hit.id.toString()` |
| `'PIXABAY'` | `asset.provider` | Hardcoded `'PIXABAY'` |
| `hit.imageWidth` | `asset.width` | Direct number assignment |
| `hit.imageHeight` | `asset.height` | Direct number assignment |
| `hit.pageURL` | `asset.url` | Pixabay source page URL |
| `hit.user` | `asset.photographerName` | Contributor display name |
| `https://pixabay.com/users/${hit.user}-${hit.user_id}/` | `asset.photographerUrl` | Contributor profile URL |
| `hit.largeImageURL` / `hit.webformatURL` | `asset.sourceImageUrl` | High-res display image URL |
| `hit.previewURL` | `asset.thumbnailUrl` | Preview thumbnail URL |
| `hit.tags` | `asset.altText` | Image tags string |
| — | `asset.attributionText` | `'Image by ' + hit.user + ' from Pixabay'` |
| `hit.pageURL` | `asset.attributionUrl` | Source webpage URL |
