# 41 — Image Library Architecture — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/41_image_library_architecture.md`  
**Date:** August 2, 2026  

---

## Architecture & Layering

```
                     ┌──────────────────────────────────────────────┐
                     │          Admin User / Reviewer               │
                     └──────────────────────┬───────────────────────┘
                                            │
               ┌────────────────────────────┴───────────────────────────┐
               ▼                                                        ▼
   /admin/image-library                                   /studio?tool=image-library
               │                                                        │
               └────────────────────────────┬───────────────────────────┘
                                            │
                                            ▼
                                   [ImageLibraryPage]
                                            │
                     ┌──────────────────────┼──────────────────────┐
                     ▼                      ▼                      ▼
           [ImageLibraryFilterPanel] [ImageThumbnailGrid]   [ImageDetailModal]
                                            │
                                            ▼
                              [ImageLibraryAdminService]
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
           [Firebase Storage]                          [Firestore Database]
            (Originals/Thumbnails)                 (image_library_references)

-----------------------------------------------------------------------------------------
                     Approved Reference Photo Lookup Flow
-----------------------------------------------------------------------------------------

  Post Text -> Visual Brief Extractor -> [ApprovedReferenceReader] -> ImagePromptBuilder
                                                     │
                                           (Only APPROVED & Rights-
                                             Confirmed References)
                                                     │
                                           (If match: enrich prompt)
                                           (If no match: NO_REFERENCE_MATCH)
```

---
*Specification maintained by Antigravity Agent.*
