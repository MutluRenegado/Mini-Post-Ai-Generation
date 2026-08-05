# Image System Inventory — Mini Post App

**Directory Path:** `docs/AI Modules/Image Creation Modules/01_image_system_inventory.md`  
**Date:** August 2, 2026  

---

## Complete Codebase Inventory

| File Path | Component Name | Primary Purpose | Status |
| :--- | :--- | :--- | :---: |
| `src/lib/ai/images/CanonicalImageService.ts` | `CanonicalImageService` | Central image pipeline entry point | ACTIVE |
| `src/lib/ai/images/FinalTextVisualSummarizer.ts` | `FinalTextVisualSummarizer` | Summarizes final approved post text | ACTIVE |
| `src/lib/ai/images/VisualConceptResolver.ts` | `VisualConceptResolver` | Translates abstract concepts into real-world scenes | ACTIVE |
| `src/lib/ai/images/ContentSummarizer.ts` | `ContentSummarizer` | Extracts visual summary from post text | ACTIVE |
| `src/lib/ai/images/PostVisualBriefExtractor.ts` | `PostVisualBriefExtractor` | Constructs `PostVisualBrief` model | ACTIVE |
| `src/lib/ai/images/ImagePromptBuilder.ts` | `ImagePromptBuilder` | Builds provider prompt with negative constraints | ACTIVE |
| `src/lib/ai/images/ImagePromptValidator.ts` | `ImagePromptValidator` | Validates 95% semantic score before dispatch | ACTIVE |
| `src/lib/ai/images/VisualRelevanceAnalyzer.ts` | `VisualRelevanceAnalyzer` | Analyzes visual intent and relevance | ACTIVE |
| `src/lib/ai/images/VisualDiversityTracker.ts` | `VisualDiversityTracker` | Prevents repetitive visual output | ACTIVE |
| `src/lib/ai/images/ImageStorageService.ts` | `ImageStorageService` | Persists images to Firebase Storage | ACTIVE |
| `src/lib/ai/images/ImageGenerationProvider.ts` | `ImageGenerationProvider` | Resolves aspect ratio dimensions | ACTIVE |
| `src/lib/ai/images/ImageResponseNormalizer.ts` | `ImageResponseNormalizer` | Normalizes provider image payloads | ACTIVE |
| `src/lib/ai/images/image.types.ts` | Image Types & Models | Typed interfaces & `isImageGenerationAllowed` gate | ACTIVE |
| `src/modules/image-kernel/` | Image Kernel System | Rules repository, loader, & live provider adapter | ACTIVE |
| `src/standards/ai/image.standard.ts` | Image Quality Standard | Thresholds for semantic validation | ACTIVE |
| `src/app/api/orchestrate/route.ts` | Orchestrate API Route | `recreate_image` and `regenerate_image` endpoint | ACTIVE |

---
*Inventory maintained by Antigravity Agent.*
