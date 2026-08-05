# Standards Module Prebuild Audit — Mini Post App

**Directory Path:** `docs/Standards Modules/standards_module_prebuild_audit.md`  
**Date:** August 2, 2026  
**Status:** AUDIT COMPLETE

---

## 1. Audit Scope & Context

Prior to establishing the formal Standards Module, content rules, image specs, AI writing guidelines, and social channel constraints were scattered ad-hoc across page components, prompt templates, and billing features.

### Objectives of Prebuild Audit
1. Identify all implicit and explicit engineering standards across the codebase.
2. Consolidate fragmented platform limits (character lengths, image aspect ratios, video guidelines) into a single typed data layer.
3. Establish clear source attribution for internal standards vs. third-party platform guidelines.

---

## 2. Findings & Discovered Assets

| Domain | Previous Location | Identified Standard | Action Taken |
| :--- | :--- | :--- | :--- |
| **AI Generation** | `src/app/api/generate/route.ts` | Gemini Flash prompt rules & formatting | Encapsulated in `Prompt Standard` & `AI Writing Standard` |
| **Image Workflow** | `src/modules/posts/components/` | Aspect ratios & quality thresholds | Encapsulated in `Image Standard` & `Sizing Standard` |
| **Social Networks** | Hardcoded UI badges | FB, IG, LinkedIn, X, TikTok, YouTube limits | Encapsulated in 9 Social Platform Standards |
| **Accessibility** | `LegalLayout.tsx` | High-contrast & ARIA patterns | Encapsulated in `Accessibility Standard` (WCAG 2.2 AA) |
| **Design System** | `tailwind.config.ts` & CSS | Font hierarchy, color palettes, spacing | Encapsulated in 5 Design System Standards |

---

## 3. Recommendations & Architecture Plan

1. Create a centralized typed dataset: `src/modules/company/content/engineeringStandards.ts`.
2. Define a clear `StandardSourceType` enum (`INTERNAL`, `PLATFORM_REFERENCE`, `INDUSTRY_REFERENCE`).
3. Build a high-performance, responsive presentation component: `EngineeringStandardsTable.tsx`.
4. Surface all 31 standards publicly on `/company/trust/trust-safety`.

---
*Prebuild audit completed by Antigravity Agent.*
