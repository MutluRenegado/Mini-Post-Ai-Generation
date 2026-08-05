# Attribution Rules — Mini Post App

Status: **Verified Standard**  
Scope: Guidelines for Displaying Photographer and Provider Attribution.

---

## 1. Mandatory Attribution Metadata Fields

Every provider mapper MUST extract and populate four mandatory attribution fields inside `ExternalImageAsset`:

```typescript
{
  photographerName: "Jane Developer",
  photographerUrl: "https://www.pexels.com/@janedev",
  attributionText: "Photo by Jane Developer on Pexels",
  attributionUrl: "https://www.pexels.com/photo/12345"
}
```

---

## 2. Standardized Format Rules

- **Pexels Format**: `Photo by [Photographer Name] on Pexels` (linking to Pexels asset URL)
- **Pixabay Format**: `Image by [Contributor Name] from Pixabay` (linking to Pixabay asset URL)
- **Unsplash Format**: `Photo by [Photographer Name] on Unsplash` (linking to photographer profile with `utm_source=mini_post_app&utm_medium=referral`)

---

## 3. UI Display & Persistence Requirements

1. **Image Creator UI**: Search thumbnail cards MUST display photographer name on hover and include clickable source links.
2. **Asset Library**: Asset detail modals MUST display creator name, profile link, provider badge, and license details.
3. **Published Posts**: Where platform formatting allows (e.g. blog posts, web previews), attribution metadata MUST be preserved in asset post captions or image alt tags.
