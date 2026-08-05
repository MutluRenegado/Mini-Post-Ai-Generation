# Pixabay Security — Mini Post App

Status: **Planned Security Controls**

---

## Key Redaction & SSRF Rules

1. **Query-Parameter Redaction**: `PIXABAY_API_KEY` is passed via URL query parameter `?key=...`. The HTTP client MUST strip or mask `?key=` parameters before logging requests or returning error tracebacks.
2. **SSRF Protection**: Target URL strictly enforced: `https://pixabay.com/api/`.
3. **Server-Side Fetch**: Browser NEVER makes direct calls to `pixabay.com/api/`.
