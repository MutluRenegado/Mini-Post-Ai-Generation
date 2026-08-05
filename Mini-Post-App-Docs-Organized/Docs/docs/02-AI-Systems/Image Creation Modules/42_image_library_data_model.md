# 42 — Image Library Data Model — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/42_image_library_data_model.md`  
**Date:** August 2, 2026  

---

## Data Model Specifications (`VisualReference`)

The `VisualReference` model spans 40+ structured attributes:

- **Identity**: `id`, `title`, `caption`, `description`.
- **Source & Storage**: `sourceType`, `sourceProvider`, `originalFileName`, `storagePath`, `thumbnailPath`, `mimeType`, `fileSizeBytes`.
- **Hashes**: `checksum` (SHA-256), `perceptualHash` (dHash).
- **Dimensions**: `width`, `height`, `aspectRatio`, `orientation`.
- **Classification**: `topic`, `industry`, `category`, `scene`, `subjects`, `classificationState` (`SUGGESTED` | `MANUALLY_REVIEWED`).
- **People & Roles**: `peoplePresent`, `peopleCount`, `peopleDescription`, `professionalRoles`, `actions`.
- **Objects & Environment**: `objects`, `products`, `devices`, `documents`, `environment`.
- **Visual Style**: `photographyStyle`, `realismLevel`, `mood`, `lighting`, `cameraAngle`, `composition`, `colorPalette`.
- **Usage**: `platformSuitability`, `contentType`, `templateSuitability`.
- **Quality**: `qualityScores` (`relevanceScore`, `realismScore`, `compositionScore`, `technicalQualityScore`, `overallQualityScore`), `mustInclude`, `mustAvoid`.
- **Rights**: `rights` (`rightsConfirmed`, `ownerId`, `sourceProvider`, `licenceType`, `attributionRequired`, `attributionText`, `sourceUrl`, `commercialUseReviewStatus`, `reviewedBy`, `reviewedAt`).
- **Review**: `review` (`status`: `PENDING` | `APPROVED` | `REJECTED` | `NEEDS_CHANGES` | `ARCHIVED`, `reviewerId`, `reviewedAt`, `rejectionReason`, `reviewerNotes`).
- **Audit**: `createdAt`, `updatedAt`, `version`, `usageCount`, `retrievalCount`.

---
*Specification maintained by Antigravity Agent.*
