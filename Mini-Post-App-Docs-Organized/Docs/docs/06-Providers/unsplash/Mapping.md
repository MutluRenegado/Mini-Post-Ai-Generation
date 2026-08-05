# Unsplash Mapping Specification — Mini Post App

Status: **Planned Data Mapping**

---

## Planned Mapping Matrix

| Unsplash JSON Field | `ExternalImageAsset` Target Field | Transformation Rules |
| :--- | :--- | :--- |
| `photo.id` | `asset.id` | Direct string assignment |
| `'UNSPLASH'` | `asset.provider` | Hardcoded `'UNSPLASH'` |
| `photo.width` | `asset.width` | Direct number assignment |
| `photo.height` | `asset.height` | Direct number assignment |
| `photo.links.html` | `asset.url` | Source asset webpage link |
| `photo.user.name` | `asset.photographerName` | Creator display name |
| `photo.user.links.html` | `asset.photographerUrl` | Appends `?utm_source=mini_post_app&utm_medium=referral` |
| `photo.urls.regular` / `full` | `asset.sourceImageUrl` | High-res display image URL |
| `photo.urls.small` / `thumb` | `asset.thumbnailUrl` | Preview thumbnail URL |
| `photo.alt_description` | `asset.altText` | Image alt text |
| — | `asset.attributionText` | `'Photo by ' + user.name + ' on Unsplash'` |
| `photo.links.html` | `asset.attributionUrl` | Source webpage URL |
