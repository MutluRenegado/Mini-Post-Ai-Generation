# Recommended Image Intelligence Module Architecture — Mini Post App

**Directory Path:** `docs/Image Intelligence Module/recommended_architecture.md`  
**Date:** August 2, 2026  

---

## Proposed Module Structure (`src/modules/image-intelligence/`)

```text
src/modules/image-intelligence/
├── index.ts
│
├── core/
│   ├── ImageIntelligenceService.ts
│   ├── ImageIntelligencePipeline.ts
│   └── ImageIntelligenceContext.ts
│
├── summarization/
│   └── FinalTextVisualSummarizer.ts
│
├── concepts/
│   ├── VisualConceptResolver.ts
│   ├── AbstractConceptMapper.ts
│   └── DomainSceneResolver.ts
│
├── knowledge/
│   ├── VisualKnowledgeBase.ts
│   ├── SceneLibrary.ts
│   ├── IndustryLibrary.ts
│   ├── ObjectLibrary.ts
│   ├── RoleLibrary.ts
│   ├── StyleLibrary.ts
│   └── NegativePromptLibrary.ts
│
├── retrieval/
│   ├── ReferenceImageRetriever.ts
│   ├── SimilaritySearch.ts
│   └── ImageEmbeddingService.ts
│
├── briefs/
│   ├── VisualBriefBuilder.ts
│   └── visual-brief.types.ts
│
├── prompts/
│   ├── ImagePromptOptimizer.ts
│   ├── NegativePromptBuilder.ts
│   └── PromptCorrectionService.ts
│
├── validation/
│   ├── ImageRelevanceValidator.ts
│   ├── ImageRealismValidator.ts
│   ├── ImageCompositionValidator.ts
│   ├── ImageBrandValidator.ts
│   └── ImageAcceptanceGate.ts
│
├── feedback/
│   ├── ImageFeedbackService.ts
│   ├── RejectionReasonRegistry.ts
│   └── LearningSignalBuilder.ts
│
├── references/
│   ├── ReferenceImageService.ts
│   ├── ReferenceImageMetadata.ts
│   └── ReferenceDatasetService.ts
│
└── adapters/
    ├── studioos.adapter.ts
    ├── image-engine.adapter.ts
    ├── provider.adapter.ts
    └── storage.adapter.ts
```

---
*Proposed architecture authored by Antigravity Agent.*
