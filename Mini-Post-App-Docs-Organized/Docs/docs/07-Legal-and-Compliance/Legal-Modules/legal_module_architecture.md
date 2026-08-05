# Legal Module Architecture Specification — Mini Post App

**Directory Path:** `docs/Legal Modules/legal_module_architecture.md`  
**Date:** August 2, 2026  

---

## 1. Codebase Architecture (`src/modules/legal/`)

```text
src/modules/legal/
├── config/
│   ├── legalFacts.ts            <-- Verified corporate identity single source of truth
│   └── legalNavigation.ts       <-- 4-group legal navigation taxonomy
├── content/                     <-- 16 typed legal content modules
│   ├── privacy.ts
│   ├── terms.ts
│   ├── cookies.ts
│   ├── gdpr.ts
│   ├── dpa.ts
│   ├── subprocessors.ts
│   ├── disclaimer.ts
│   ├── acceptableUse.ts
│   ├── aiContentDisclaimer.ts
│   ├── copyright.ts
│   ├── trademark.ts
│   ├── retention.ts
│   ├── legalRequests.ts
│   ├── accessibility.ts
│   ├── securityDisclosure.ts
│   └── responsibleAi.ts
├── components/
│   └── LegalPageShell.tsx       <-- Universal responsive legal layout wrapper
├── metadata/
│   └── createLegalMetadata.ts   <-- SEO, canonical URL, and OpenGraph generator
├── services/
│   └── LegalDocumentService.ts  <-- Document registry & lookup service
└── types/
    ├── legalDocument.types.ts
    ├── legalNavigation.types.ts
    └── legalReview.types.ts
```

---
*Architecture specification authored by Antigravity Agent.*
