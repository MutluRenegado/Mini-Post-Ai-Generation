# Text Summary Stage Specification — Mini Post App

**Directory Path:** `docs/Image Pipeline Repair/text_summary_stage.md`  
**Service:** `FinalTextVisualSummarizer.ts`  
**Date:** August 2, 2026  

---

## Summarization Flow

1. Validates text status is `FINAL` or `APPROVED`.
2. Passes final text to `VisualConceptResolver` to extract domain and scene.
3. Produces typed `ContentVisualSummary` containing main subject, core message, environment, people, objects, and prohibited elements.

---
*Specification maintained by Antigravity Agent.*
