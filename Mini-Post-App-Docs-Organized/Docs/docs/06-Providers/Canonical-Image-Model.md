# Canonical Image Model — Mini Post App

Status: **Verified Contract Specification**  
Source Interface: [external-image-provider.interface.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/external-image-provider.interface.ts)

---

## 1. Overview

The Canonical Image Model defines the standard normalized data representation for external stock photos across Mini Post App. Regardless of whether an image originates from Pexels, Pixabay, or Unsplash, provider mappers transform raw native API JSON into this unified structure.

---

## 2. Standard Interface Definition (`ExternalImageAsset`)

```typescript
export interface ExternalImageAsset {
  id: string;              // Provider unique asset ID
  provider: string;        // Provider identifier ('PEXELS', 'PIXABAY', 'UNSPLASH')
  width: number;           // Original pixel width
  height: number;          // Original pixel height
  url: string;             // External source webpage URL
  photographerName: string;// Creator / photographer display name
  photographerUrl: string; // Creator profile URL
  sourceImageUrl: string;  // High-resolution display image URL
  thumbnailUrl: string;    // Low-resolution preview thumbnail URL
  altText: string;         // Descriptive alt text for accessibility
  averageColor?: string;   // Dominant hex color (e.g. '#334155')
  attributionText: string; // Formatted credit string ('Photo by Jane on Pexels')
  attributionUrl: string;  // Canonical attribution URL
  raw?: any;               // Raw native API JSON object (Server-only)
}
```

---

## 3. Current vs Proposed Canonical Fields

| Field | Status in Current Code | Description | Proposed Canonical Extensions |
| :--- | :--- | :--- | :--- |
| `id` | `Implemented` | String asset identifier | UUID prefixing |
| `provider` | `Implemented` | Uppercase provider ID | Provider version tagging |
| `width` / `height` | `Implemented` | Numeric dimensions | Calculated aspect ratio (`width/height`) |
| `url` | `Implemented` | Provider webpage URL | Canonical shortlink |
| `photographerName` | `Implemented` | Creator display name | Creator handle / user ID |
| `photographerUrl` | `Implemented` | Creator profile URL | Verified profile flag |
| `sourceImageUrl` | `Implemented` | Full image display URL | Direct CDN storage URL |
| `thumbnailUrl` | `Implemented` | Preview thumbnail URL | WebP / AVIF responsive srcset |
| `altText` | `Implemented` | Accessibility alt text | AI-generated semantic captions |
| `averageColor` | `Implemented` | Dominant hex color | Color palette array |
| `attributionText` | `Implemented` | Standard credit string | HTML formatted credit badge |
| `attributionUrl` | `Implemented` | Asset link URL | License verification URL |
