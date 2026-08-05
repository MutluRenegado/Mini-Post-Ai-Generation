# 50 — Image Library Testing Suite — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/50_image_library_testing.md`  
**Date:** August 2, 2026  

---

## Test Matrix & Execution

- **Test Suite Location**: `src/modules/image-library/tests/image-library.test.ts`
- **Execution Command**: `node --experimental-strip-types src/modules/image-library/tests/image-library.test.ts`
- **Test Scenarios**:
  1. Valid image upload initialization (PENDING & unconfirmed rights).
  2. Unsupported file type rejection (`UNSUPPORTED_FILE_TYPE`).
  3. Exact SHA-256 duplicate detection & upload blocking.
  4. Approval gating (blocked when rights unconfirmed).
  5. Successful approval after confirming rights.
  6. ApprovedReferenceReader exclusion of pending/rejected/unconfirmed images.
  7. Paginated search and faceted filtering logic.

---
*Specification maintained by Antigravity Agent.*
