# Retry Strategy Specification — Mini Post App

**Directory Path:** `docs/Image Pipeline Repair/retry_strategy.md`  
**Date:** August 2, 2026  

---

## Corrective Retry Flow

1. On validation failure, prompt is NOT resent unmodified.
2. Failure reason is analyzed (e.g. `text_artifact_detected` or `abstract_concept_unresolved`).
3. Targeted negative constraints are appended (`no text, no letters, no written documents facing camera`).
4. Re-executed with updated seed / modified prompt up to 2 automated retries before triggering manual review.

---
*Specification maintained by Antigravity Agent.*
