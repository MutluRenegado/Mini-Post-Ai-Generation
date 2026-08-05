# Pixabay Search Specification — Mini Post App

Status: **Planned Search Specification**

---

## Query & Filtering Rules

1. **Query Character Cap**: Query strings MUST NOT exceed 100 characters. Longer strings MUST be truncated before dispatch.
2. **Per Page Boundary**: `per_page` parameter MUST be clamped between 3 and 200.
3. **Safe Search**: `safesearch=true` MUST be explicitly appended to all API requests.
4. **Orientation Values**: `'all'`, `'horizontal'`, `'vertical'`.
