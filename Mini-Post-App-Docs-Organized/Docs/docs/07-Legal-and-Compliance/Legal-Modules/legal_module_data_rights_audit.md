# Legal Data Rights & Erasure Audit — Mini Post App

**Directory Path:** `docs/Legal Modules/legal_module_data_rights_audit.md`  
**Date:** August 2, 2026  

---

## Data Subject Rights & Erasure Audit

- **Active Erasure Route**: `/data-deletion` (Preserved active client component).
- **Authentication Check**: Verifies `useAuth()` state; prompts unauthenticated users to sign in or email `deletion@minipostapp.space`.
- **Confirmation Flow**: Requires explicit checkbox confirmation before submission.
- **Processing Timeframe**: Account records purged within 30 calendar days; OAuth tokens revoked immediately.

---
*Data rights audit authored by Antigravity Agent.*
