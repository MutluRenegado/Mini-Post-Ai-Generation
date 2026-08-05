# Standards Module Architecture Specification — Mini Post App

**Directory Path:** `docs/Standards Modules/standards_module_architecture.md`  
**Date:** August 2, 2026  
**Status:** IMPLEMENTED & VALIDATED

---

## 1. Architectural Principles

The Standards Module is designed around four key principles:

1. **Single Source of Truth**: Standard definitions are maintained exclusively in `src/modules/company/content/engineeringStandards.ts`.
2. **Strict Type Safety**: All standards adhere to `EngineeringStandard` interface definitions.
3. **Decoupled Presentation**: Presentation components (`EngineeringStandardsTable.tsx`) consume data reactively without hardcoding UI rows.
4. **Route-Scoped Header Integration**: Route-scoped header switching (`TrustSafetyHeader.tsx`) isolates Trust & Safety navigation without polluting the global `Navbar`.

---

## 2. Data Model & Types

```typescript
export type StandardSourceType = 'INTERNAL' | 'PLATFORM_REFERENCE' | 'INDUSTRY_REFERENCE';

export type StandardCategory =
  | 'Internal Engineering'
  | 'AI and Content'
  | 'Design System'
  | 'Social Platform'
  | 'Video'
  | 'Publishing'
  | 'Accessibility'
  | 'Compliance';

export interface EngineeringStandard {
  id: string;
  order: number;
  name: string;
  reference: string;
  implementation: string;
  publishedBy: string;
  category: StandardCategory;
  sourceType: StandardSourceType;
}
```

---

## 3. Data Flow Diagram

```
[ engineeringStandards.ts ]  <-- Typed Single Source of Truth (31 Standards)
            │
            ├──> [ EngineeringStandardsTable.tsx ]  <-- Real-time Search & Filter Engine
            │             │
            │             ├──> Desktop Table View (4 Columns)
            │             └──> Mobile Card Stack View (Single Column)
            │
            └──> [ /company/trust/trust-safety/page.tsx ]  <-- Public Route Page Shell
```

---
*Architecture specification authored by Antigravity Agent.*
