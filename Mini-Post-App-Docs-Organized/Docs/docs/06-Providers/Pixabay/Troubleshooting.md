# Pixabay Troubleshooting — Mini Post App

Status: **Planned Guide**

---

## Planned Troubleshooting Checklist

- Key missing: Check `.env.local` or Secret Manager.
- Query truncation: Ensure search query is under 100 characters.
- HTTP 429: Rate limit exceeded (5,000 requests/hour limit).
- Hotlinking error: Ensure selected assets are downloaded locally before rendering in published posts.
