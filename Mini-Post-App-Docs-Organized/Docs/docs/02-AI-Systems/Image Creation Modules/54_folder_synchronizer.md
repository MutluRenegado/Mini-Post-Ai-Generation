# 54 — Local Folder Synchronizer & Sync Manifest — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/54_folder_synchronizer.md`  
**Date:** August 2, 2026  

---

## 1. Local Folder Synchronizer Architecture

The local folder synchronizer is a standalone administrative tool that synchronizes local source photos from `D:\Library\Images Library` into Mini Post App.

### Key Rules & Behavior:
- **Preserves Source Files**: Never moves, renames, overwrites, or deletes original photographs on disk.
- **Standalone Execution**: Implemented in `scripts/image-library-sync.ts` and `src/modules/image-library/importer/folder-sync.service.ts`. Never runs automatically on Next.js startup or in browser runtime.
- **CLI Commands**:
  - `npm run image-library:scan` (Read-only recursive directory scan)
  - `npm run image-library:sync` (Full incremental sync to Firestore & Storage)
  - `npm run image-library:sync -- --dry-run` (Dry-run mode simulating sync)

---

## 2. Sync Manifest (`db/sync-manifest.json`)

The synchronizer maintains an incremental sync manifest tracking relative paths, SHA-256 byte checksums, dHash perceptual hashes, file modification times, and source availability status (`AVAILABLE` vs `MISSING`).

### Missing File Handling:
When a source file is removed from `D:\Library\Images Library`, its record is updated to `sourceAvailability = 'MISSING'`. The Firestore record, review history, rights details, and thumbnails are **preserved without automatic deletion**.

---
*Specification maintained by Antigravity Agent for Mini Post App.*
