# Helping Module Architecture Specification — Mini Post App

**Directory Path:** `docs/Helping Modules/helping_module_architecture.md`  
**Date:** August 2, 2026  

---

## Codebase Architecture (`src/modules/helping/`)

```text
src/modules/helping/
├── components/
│   ├── ExplainControl.tsx       <-- Interactive "E" Explain button component
│   └── ExplainBox.tsx           <-- Accessible contextual popover dialog
├── context/
│   └── HelpingContext.tsx       <-- HelpingProvider & state management
├── registry/
│   └── helpingRegistry.ts       <-- Centralized HelpItem registry
├── content/
│   ├── globalHelp.ts            <-- Header/footer navigation help items
│   ├── formsHelp.ts             <-- Data deletion & contact form help items
│   └── studioHelp.ts            <-- Creator Studio prompt & platform help items
└── types/
    ├── explain-item.types.ts
    └── helping.types.ts
```

---
*Architecture specification authored by Antigravity Agent.*
