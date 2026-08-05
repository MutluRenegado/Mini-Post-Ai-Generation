# Pexels Storage — Mini Post App

Status: **Verified Import Persistence**  
Route Reference: `/api/admin/pexels/import`

---

## Selective Import Workflow

1. **Import Cap**: Default maximum 20 photos per import request (hard cap: 50).
2. **Local Storage Target**: Writes imported asset files to local directory (`D:\Library\Images Library\01_Incoming`).
3. **Mandatory Unreviewed Metadata State**: Imported asset records start with default governance flags:
   - `rightsConfirmed`: `false`
   - `commercialUseReviewStatus`: `'PENDING'`
   - `reviewStatus`: `'PENDING'`
