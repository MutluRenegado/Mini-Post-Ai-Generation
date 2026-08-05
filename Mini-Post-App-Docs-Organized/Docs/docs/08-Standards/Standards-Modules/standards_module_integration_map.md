# Standards Module Integration Map — Mini Post App

**Directory Path:** `docs/Standards Modules/standards_module_integration_map.md`  
**Date:** August 2, 2026  

---

## 1. Runtime Integration Points

| Module / Component | Consumed Standard | Integration Behavior |
| :--- | :--- | :--- |
| `src/app/api/generate/route.ts` | AI Writing, Prompt, Quality | Validates Gemini Flash prompts and scores output text quality |
| `src/app/api/text/generate/route.ts` | Platform Rules, Content Policy | Enforces platform character limits and community guidelines |
| `src/modules/posts/components/` | Image, Sizing, Layout | Resizes visual assets for Facebook, IG, X, LinkedIn, TikTok |
| `src/app/company/trust/trust-safety/` | All 31 Standards | Public UI directory rendered via `EngineeringStandardsTable.tsx` |
| `src/app/AppLayoutClient.tsx` | UI, Layout, Accessibility | Route-scoped header integration for Trust & Safety |

---
*Integration map maintained by Antigravity Agent.*
