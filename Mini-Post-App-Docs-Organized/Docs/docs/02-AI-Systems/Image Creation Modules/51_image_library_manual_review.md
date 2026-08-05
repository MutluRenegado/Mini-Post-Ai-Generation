# 51 — Image Library Manual Review Package — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/51_image_library_manual_review.md`  
**Date:** August 2, 2026  

---

## Manual Review Instructions

1. Navigate to `/admin/image-library` or `/studio?tool=image-library`.
2. Upload test image files using drag-and-drop or file selection.
3. Observe initial status: `reviewStatus = PENDING` and `rightsConfirmed = false`.
4. Attempt to approve directly without editing rights; verify approval is blocked.
5. Open Image Detail Editor, navigate to Rights & Licensing tab, set rights to Confirmed Valid and Commercial Use to Approved.
6. Click "Confirm Rights & Approve Reference"; verify state transitions to `APPROVED`.
7. Trigger image generation via studio; inspect logs to verify matching approved reference retrieval.

---
*Specification maintained by Antigravity Agent.*
