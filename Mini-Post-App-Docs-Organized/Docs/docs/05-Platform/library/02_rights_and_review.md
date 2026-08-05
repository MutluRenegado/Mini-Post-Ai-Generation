# Rights & Review Workflow — Visual Intelligence Platform

**Document Path:** `docs/platform/library/02_rights_and_review.md`  
**Date:** August 2, 2026  

---

## 1. Mandatory Rights Gate

All imported visual references initialize with `reviewStatus = 'PENDING'` and `rightsConfirmed = false`.

### State Machine Rules:
- Transition to `reviewStatus = 'APPROVED'` is **strictly blocked** unless `rightsConfirmed === true` and `commercialUseReviewStatus === 'APPROVED'`.
- Mandatory rights fields: `rightsConfirmed`, `sourceProvider`, `licenceType`, `attributionRequired`, `commercialUseReviewStatus`, `reviewedBy`, `reviewedAt`.
- Audit history tracks all state changes in `auditHistory`.

---
*Specification maintained by Antigravity Agent for Visual Intelligence Platform.*
