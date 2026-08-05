# Runtime Execution Flow — Mini Post App

**Directory Path:** `docs/AI Modules/Image Creation Modules/16_runtime_flow.md`  
**Date:** August 2, 2026  

---

## Runtime Sequence Diagram

```text
Client UI / API Request
  ↓
Final Text Gate Verification (isImageGenerationAllowed)
  ↓
Final Text Visual Summarization (FinalTextVisualSummarizer)
  ↓
Visual Concept Resolution (VisualConceptResolver)
  ↓
Post Visual Brief Extraction (PostVisualBriefExtractor)
  ↓
Image Prompt Construction (ImagePromptBuilder)
  ↓
Semantic Score Audit (ImagePromptValidator >= 95%)
  ↓
Provider Dispatch (LiveImageProviderAdapter)
  ↓
Firebase Asset Storage & Return (ImageStorageService)
```

---
*Flow documentation maintained by Antigravity Agent.*
