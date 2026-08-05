# Unsplash Troubleshooting — Mini Post App

Status: **Planned Guide**

---

## Troubleshooting Guide

- Missing key error: Verify `UNSPLASH_ACCESS_KEY` in `.env.local` or Secret Manager.
- Rate limit hit (HTTP 429): Demo apps limited to 50 requests/hour; apply for Production tier (5,000 req/hr).
- Download tracking error: Ensure `download_location` GET request includes valid Authorization header.
