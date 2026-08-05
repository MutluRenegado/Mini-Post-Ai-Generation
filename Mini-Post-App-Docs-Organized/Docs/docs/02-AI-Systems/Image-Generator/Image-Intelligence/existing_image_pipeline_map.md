# Existing Image Pipeline Map — Mini Post App

**Directory Path:** `docs/Image Intelligence Module/existing_image_pipeline_map.md`  
**Date:** August 2, 2026  

---

## Active Image Generation Pipeline Trace

```text
USER INPUT
  ↓
TEXT GENERATION & EDITING
  ↓
FINAL TEXT GATE (textStatus === "FINAL" / "APPROVED")
  ↓
FINAL TEXT VISUAL SUMMARIZATION (FinalTextVisualSummarizer.ts)
  ↓
VISUAL CONCEPT RESOLUTION (VisualConceptResolver.ts)
  ↓
VISUAL BRIEF EXTRACTION (PostVisualBriefExtractor.ts)
  ↓
IMAGE PROMPT BUILDER (ImagePromptBuilder.ts)
  ↓
IMAGE PROMPT VALIDATOR (ImagePromptValidator.ts >= 95% semantic score)
  ↓
IMAGE KERNEL EXECUTION (GenerateImage / LiveImageProviderAdapter)
  ↓
IMAGE STORAGE & VERSIONING (ImageStorageService.ts -> Firebase Storage)
```

---
*Pipeline trace maintained by Antigravity Agent.*
