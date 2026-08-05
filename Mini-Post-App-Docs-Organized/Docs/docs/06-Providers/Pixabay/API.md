# Pixabay API Specification — Mini Post App

Status: **Planned API Integration**  
Upstream Base URL: `https://pixabay.com/api/`

---

## 1. Upstream Endpoint & Parameter Requirements

- **Search Endpoint**: `GET https://pixabay.com/api/`
- **Query Parameter Constraints**:
  - `key`: Required API key parameter (Server-side injected only).
  - `q`: Search query. **Maximum length: 100 characters**. URL encoded.
  - `image_type`: Optional (`'all'`, `'photo'`, `'illustration'`, `'vector'`). Default: `'photo'`.
  - `orientation`: Optional (`'all'`, `'horizontal'`, `'vertical'`).
  - `category`: Optional Pixabay category filter.
  - `min_width` / `min_height`: Minimum pixel dimensions.
  - `colors`: Optional color filter string.
  - `editors_choice`: Optional boolean flag (`true`, `false`).
  - `safesearch`: Enforced boolean flag (`true`).
  - `order`: Sorting order (`'popular'`, `'latest'`).
  - `page`: Page number. Default: 1.
  - `per_page`: **Range: 3 to 200**. Default: 20.
