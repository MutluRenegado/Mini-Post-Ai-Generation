# Security Requirements — Mini Post App

Status: **Verified Security Standard**  
Scope: Mandatory Security Controls for Stock Photo Integrations.

---

## 1. Mandatory Security Controls Matrix

| Control Category | Requirement | Implementation Standard | Status |
| :--- | :--- | :--- | :--- |
| **Credential Protection** | Zero provider keys exposed to client bundles. | Server-only fetch & `process.env` access. | `Verified` |
| **SSRF Prevention** | Whitelisted target domain endpoints only. | Enforce `https://api.pexels.com`, `https://pixabay.com/api/`, `https://api.unsplash.com`. | `Verified` |
| **Input Sanitization** | Trim and validate user query strings. | Cap search queries at 100 characters max. Strip control characters. | `Verified` |
| **Request Timeout** | Limit upstream HTTP request duration. | Enforce 15-second timeout via `AbortController`. | `Verified` |
| **Rate Limit Control** | Prevent API quota exhaustion and HTTP 429 bans. | In-memory header tracking & early rejection. | `Verified` |
| **MIME Validation** | Validate remote image content types before download. | Allow only `image/jpeg`, `image/png`, `image/webp`. | `Verified` |
| **File Size Limits** | Cap imported image file sizes. | Enforce 25 MB maximum payload download size limit. | `Verified` |
| **Log Redaction** | Prevent secret leakage in error logs and traces. | Redact `Authorization` headers and secret query string parameters. | `Verified` |

---

## 2. Server-Side Request Forgery (SSRF) Prevention

All image downloads, preview fetching, or provider API calls MUST validate that remote URLs resolve strictly to approved domain whitelists:

- **Pexels Domain Whitelist**: `api.pexels.com`, `images.pexels.com`
- **Pixabay Domain Whitelist**: `pixabay.com`, `cdn.pixabay.com`
- **Unsplash Domain Whitelist**: `api.unsplash.com`, `images.unsplash.com`

Any request attempting to query IP addresses, local network endpoints (`127.0.0.1`, `169.254.169.254`), or unapproved domains MUST be immediately rejected with an HTTP 400 Bad Request error.
