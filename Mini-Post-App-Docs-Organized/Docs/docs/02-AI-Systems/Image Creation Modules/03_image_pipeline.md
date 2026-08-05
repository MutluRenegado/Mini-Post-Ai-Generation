# Image Generation Pipeline — Mini Post App

**Directory Path:** `docs/AI Modules/Image Creation Modules/03_image_pipeline.md`  
**Date:** August 2, 2026  

---

## Complete Runtime Pipeline Sequence

```text
1. USER TOPIC / INPUT
2. TEXT GENERATION
3. TEXT EDITING & PLATFORM ADAPTATION
4. FINAL TEXT GATE (textStatus === "FINAL" / "APPROVED")
5. FINAL TEXT SUMMARY (FinalTextVisualSummarizer.ts)
6. VISUAL CONCEPT RESOLUTION (VisualConceptResolver.ts)
7. VISUAL BRIEF EXTRACTION (PostVisualBriefExtractor.ts)
8. IMAGE PROMPT BUILDER (ImagePromptBuilder.ts)
9. PROMPT VALIDATION (ImagePromptValidator.ts >= 95% semantic score)
10. IMAGE PROVIDER EXECUTION (LiveImageProviderAdapter)
11. IMAGE RELEVANCE & QUALITY AUDIT (GeneratedImageAudit)
12. FIREBASE STORAGE & VERSION TAGGING (ImageStorageService.ts)
```

---
*Pipeline documentation maintained by Antigravity Agent.*
