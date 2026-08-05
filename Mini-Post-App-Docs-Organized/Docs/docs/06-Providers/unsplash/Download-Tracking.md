# Unsplash Download Tracking Specification — Mini Post App

Status: **Mandatory Planned Requirement**

---

## 1. Overview & Unsplash API Requirement

> [!IMPORTANT]
> **Mandatory Unsplash API Guideline**
> Per the official Unsplash API Guidelines, applications MUST send an HTTP GET request to an asset's `links.download_location` endpoint whenever a user selects, downloads, or embeds an Unsplash photo in a post.
> 
> This trigger signals a legitimate download event to Unsplash, ensuring correct photographer stats and platform analytics.

---

## 2. Triggering Workflow & Rules

```
[User Selects Unsplash Photo in UI]
                 │
                 ▼ (Server Action / API Call)
   [Server Resolves download_location URL]
                 │
                 ▼ (Outbound Server Request with Authorization Header)
   [GET photo.links.download_location] ──> [Unsplash Analytics Endpoint]
                 │
                 ▼ (Returns { "url": "https://images.unsplash.com/..." })
   [Store Asset / Return Final Media URL]
```

### Protocol Rules
1. **Trigger Stage**: The download tracking request MUST be triggered strictly when an asset is explicitly selected, imported, or downloaded for post generation. (It MUST NOT be triggered during general thumbnail search browsing).
2. **Server-Side Authorization**: The request to `download_location` MUST include the server `Authorization: Client-ID UNSPLASH_ACCESS_KEY` header.
3. **Response Handling**: The endpoint returns a JSON payload containing the final target image download URL. The application MUST use this returned URL for asset fetching.
