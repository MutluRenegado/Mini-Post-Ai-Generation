# 43 — Image Library Upload System — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/43_image_library_upload.md`  
**Date:** August 2, 2026  

---

## Upload Workflow & Validation

1. **Client Selection**: Drag-and-drop or file picker (single or multi-file).
2. **Format Gating**: Validates JPG, JPEG, PNG, WebP format. Rejects unsupported formats with `UNSUPPORTED_FILE_TYPE`.
3. **Size Limit**: Enforces 25MB maximum file size limit (`FILE_SIZE_EXCEEDED`).
4. **Hashing**: Calculates SHA-256 byte checksum and 64-bit dHash perceptual hash.
5. **Duplicate Check**: Evaluates against existing records for `EXACT_DUPLICATE` (blocked), `NEAR_DUPLICATE` (warned), or `POSSIBLE_DUPLICATE`.
6. **Thumbnail Generation**: Creates aspect-ratio preserving web thumbnail.
7. **Initialization**: Creates `VisualReference` record in Firestore with `reviewStatus = 'PENDING'` and `rightsConfirmed = false`.

---
*Specification maintained by Antigravity Agent.*
