# Pixabay Authentication — Mini Post App

Status: **Planned Authentication Protocol**

---

## 1. Authentication Protocol

Pixabay API uses query parameter authentication:
- **Parameter Name**: `key`
- **Request Format**: `https://pixabay.com/api/?key=PIXABAY_API_KEY&q=search_term`

---

## 2. Mandatory Security Protocol

1. **Server-Side Injection**: The `key` parameter MUST be appended strictly within server-side fetch requests in `PixabayClient`.
2. **URL Redaction**: The key MUST NEVER be logged, written to error stack traces, or included in client-visible response URLs.
3. **No Frontend Access**: The key MUST NOT use `NEXT_PUBLIC_` prefix and MUST NOT be accessible in browser environments.
