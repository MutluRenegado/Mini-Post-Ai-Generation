# 47 — Image Library Rights & Licensing — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/47_image_library_rights.md`  
**Date:** August 2, 2026  

---

## Rights Confirmation Requirements

Approval is strictly blocked by `ImageLibraryAdminService` unless all mandatory rights fields are completed:

- `rightsConfirmed` === `true`
- `sourceProvider` (non-empty)
- `licenceType` (non-empty)
- `commercialUseReviewStatus` === `'APPROVED'`
- `reviewedBy` and `reviewedAt` set

Images with unknown or unconfirmed rights remain in state `PENDING` and are blocked from production prompt retrieval.

---
*Specification maintained by Antigravity Agent.*
