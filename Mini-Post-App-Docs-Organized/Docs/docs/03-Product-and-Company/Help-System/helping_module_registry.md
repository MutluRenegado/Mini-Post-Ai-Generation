# Helping Module Registry Specification — Mini Post App

**Directory Path:** `docs/Helping Modules/helping_module_registry.md`  
**Registry Source File:** `src/modules/helping/registry/helpingRegistry.ts`  
**Date:** August 2, 2026  

---

## 1. Registry API Methods

- `getById(id: string): HelpItem | undefined`
- `getByRoute(route: string): HelpItem[]`
- `getByCategory(category: string): HelpItem[]`
- `getAll(): HelpItem[]`
- `getCount(): number`

---
*Registry specification maintained by Antigravity Agent.*
