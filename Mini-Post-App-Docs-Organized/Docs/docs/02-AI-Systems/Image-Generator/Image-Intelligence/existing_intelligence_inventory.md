# Existing Intelligence Inventory — Mini Post App

**Directory Path:** `docs/Image Intelligence Module/existing_intelligence_inventory.md`  
**Date:** August 2, 2026  

---

## Active Services & Classes Inventory

| Service / Class | File Location | Responsibilities |
| :--- | :--- | :--- |
| `CanonicalImageService` | `src/lib/ai/images/CanonicalImageService.ts` | Orchestrates end-to-end image generation pipeline |
| `FinalTextVisualSummarizer` | `src/lib/ai/images/FinalTextVisualSummarizer.ts` | Summarizes final approved post text |
| `VisualConceptResolver` | `src/lib/ai/images/VisualConceptResolver.ts` | Translates abstract topics into concrete visual scenes |
| `PostVisualBriefExtractor` | `src/lib/ai/images/PostVisualBriefExtractor.ts` | Extracts typed `PostVisualBrief` |
| `ImagePromptBuilder` | `src/lib/ai/images/ImagePromptBuilder.ts` | Assembles provider prompt with negative constraints |
| `ImagePromptValidator` | `src/lib/ai/images/ImagePromptValidator.ts` | Validates 95% semantic score before provider dispatch |
| `VisualDiversityTracker` | `src/lib/ai/images/VisualDiversityTracker.ts` | Prevents repetitive visual patterns |
| `ImageStorageService` | `src/lib/ai/images/ImageStorageService.ts` | Stores generated image assets in Firebase Storage |

---
*Inventory maintained by Antigravity Agent.*
