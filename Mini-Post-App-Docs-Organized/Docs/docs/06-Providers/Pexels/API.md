# Pexels API Specification — Mini Post App

Status: **Verified Backend API Integration**  
Upstream Base URL: `https://api.pexels.com/v1`

---

## 1. Integrated Endpoints

The Pexels client (`PexelsClient`) integrates the following upstream Pexels API endpoints:

| Action | Upstream Endpoint | Client Method | Description |
| :--- | :--- | :--- | :--- |
| **Search Photos** | `GET /v1/search` | `PexelsClient.search()` | Search photos by query, orientation, page, perPage. |
| **Curated Photos** | `GET /v1/curated` | `PexelsClient.getCurated()` | Retrieve curated popular photos. |
| **Single Photo** | `GET /v1/photos/:id` | `PexelsClient.getPhoto()` | Lookup single photo by numeric asset ID. |
| **Featured Collections** | `GET /v1/collections/featured` | `PexelsClient.getFeaturedCollections()` | List featured Pexels collections. |
| **Collection Media** | `GET /v1/collections/:id` | `PexelsClient.getCollectionMedia()` | Retrieve photos within a specific collection. |

---

## 2. Parameter Constraints

- `page`: Minimum 1. Default: 1.
- `per_page`: Minimum 1, Maximum 50 (hard cap enforced in `PexelsProvider`). Default: 15.
- `orientation`: Optional string: `'landscape'`, `'portrait'`, `'square'`.
