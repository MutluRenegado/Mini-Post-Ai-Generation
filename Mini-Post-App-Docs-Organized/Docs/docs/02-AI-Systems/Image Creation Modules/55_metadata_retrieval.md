# 55 — Metadata Retrieval & Gating Rules — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/55_metadata_retrieval.md`  
**Date:** August 2, 2026  

---

## 1. Approved-Only Metadata Retrieval

Reference image retrieval operates **metadata-first**, matching query parameters against 15+ visual taxonomy fields.

### Mandatory Gating Criteria:
Only references satisfying all required conditions participate in retrieval:
1. `reviewStatus === 'APPROVED'`
2. `rightsConfirmed === true`
3. `commercialUseReviewStatus === 'APPROVED'`
4. `sourceAvailability === 'AVAILABLE'`
5. Not archived (`reviewStatus !== 'ARCHIVED'`)
6. Not rejected (`reviewStatus !== 'REJECTED'`)

Pending, unconfirmed, archived, rejected, or missing images are **strictly excluded**.

---
*Specification maintained by Antigravity Agent for Mini Post App.*
