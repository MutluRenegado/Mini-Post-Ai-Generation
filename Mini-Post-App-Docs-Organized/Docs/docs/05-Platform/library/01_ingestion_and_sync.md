# Ingestion & Local Folder Synchronization — Visual Intelligence Platform

**Document Path:** `docs/platform/library/01_ingestion_and_sync.md`  
**Date:** August 2, 2026  

---

## 1. Local Folder Synchronizer CLI

Local folder synchronization with `D:\Library\Images Library` is executed via administrative CLI commands:

- `npm run image-library:scan` (Read-only scan of source directory)
- `npm run image-library:sync` (Full incremental synchronization)
- `npm run image-library:sync -- --dry-run` (Dry-run mode)

### Operational Rules:
1. **Preserves Source Files**: Source photographs on disk are never moved, renamed, overwritten, or deleted.
2. **Incremental Manifest**: Manifest tracked at `db/sync-manifest.json`.
3. **Exact Duplicate Blocking**: Blocks exact byte matches (`EXACT_DUPLICATE` via `SHA-256`).
4. **Near Duplicate Warning**: Emits warnings for visual near-matches (`NEAR_DUPLICATE` via 64-bit `dHash`).
5. **Missing File Preservation**: Missing local files update `sourceAvailability = 'MISSING'` while preserving Firestore records, rights history, and thumbnails.

---
*Specification maintained by Antigravity Agent for Visual Intelligence Platform.*
