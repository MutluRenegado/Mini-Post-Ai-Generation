# 40 — Image Library Module Overview — Mini Post App

**Target Path:** `src/modules/image-library/`  
**System Status:** ACTIVE (MILESTONE 1 COMPLETE)  
**Date:** August 2, 2026  

---

## 1. Executive Summary

The **Image Library Module** provides a visual administration interface for reference photos and media assets within Mini Post App. It replaces temporary folder and batch-file workflows with a real application module featuring file upload, metadata editing, rights management, approval workflows, duplicate detection, and direct integration with the Visual Intelligence retrieval layer.

---

## 2. Key Capabilities (Milestone 1)

- **Drag & Drop / Multi-File Upload**: Supports JPG, JPEG, PNG, WebP format validation and max 25MB file limits.
- **Visual Grid & Previews**: Aspect-ratio preserving thumbnail grid with pagination and status badges.
- **Structured Metadata Editor**: Multi-section editor covering Basic Info, Classification, Visual Style, People & Roles, Objects, Sizing, Quality, Rights, and Review Audit.
- **Mandatory Rights Gating**: Approval is strictly blocked unless rights confirmation, licence type, source provider, and commercial-use approval are verified.
- **Approved-Only Retrieval**: `ApprovedReferenceReader` supplies only approved and rights-confirmed reference images to `CanonicalImageService`, falling back cleanly to `NO_REFERENCE_MATCH` if no approved reference exists.
- **Duplicate Detection**: Computes SHA-256 exact checksums and dHash perceptual hashes on upload.

---

*Specification maintained by Antigravity Agent.*
