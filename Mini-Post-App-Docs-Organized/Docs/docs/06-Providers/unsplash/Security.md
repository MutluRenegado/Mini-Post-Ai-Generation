# Unsplash Security — Mini Post App

Status: **Planned Security Controls**

---

## Security Audit Controls

1. **Access Key Protection**: `UNSPLASH_ACCESS_KEY` loaded server-side only. Zero client exposure.
2. **SSRF Prevention**: Target URL whitelisted strictly to `https://api.unsplash.com`.
3. **Timeout Protection**: 15-second HTTP request timeout cap via `AbortController`.
