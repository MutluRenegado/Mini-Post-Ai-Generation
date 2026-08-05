# Image System Architecture — Mini Post App

**Directory Path:** `docs/AI Modules/Image Creation Modules/02_image_architecture.md`  
**Date:** August 2, 2026  

---

## Architectural Layers

```text
Application UI / API Layer
  ├── /api/orchestrate
  ├── Fast Post Dashboard
  └── Creator Studio Wizard
        ↓
Image Pipeline Orchestration Layer (src/lib/ai/images/)
  ├── CanonicalImageService.ts
  ├── FinalTextVisualSummarizer.ts
  ├── VisualConceptResolver.ts
  ├── PostVisualBriefExtractor.ts
  ├── ImagePromptBuilder.ts
  └── ImagePromptValidator.ts
        ↓
Image Kernel & Rules Layer (src/modules/image-kernel/)
  ├── FileSystemImageRulesRepository.ts
  ├── MasterImageRulesLoader.ts
  └── LiveImageProviderAdapter.ts
        ↓
Storage & Persistence Layer
  ├── ImageStorageService.ts (Firebase Storage)
  └── VisualDiversityTracker.ts
```

---
*Architecture documentation maintained by Antigravity Agent.*
