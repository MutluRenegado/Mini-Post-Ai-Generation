# Company Module Prebuild Audit — Mini Post App

**Project Target:** `D:\Library\workspace\KKK\MINIPOSTAPP\mini-post-app-master`  
**Date:** August 2, 2026  
**Status:** COMPLETE (READ-ONLY AUDIT PHASE)

---

## 1. Executive Summary

This prebuild audit inspects all existing company, legal, trust, press, and resource-related pages, routes, headers, footers, components, and metadata across the Mini Post App repository prior to architectural restructuring.

- **Total Existing Company-Related Routes Audited:** 32 active routes in `src/app/` + 4 deprecated skeleton routes in `src/deprecated/app/`.
- **Preserved Routes:** `/data-deletion` (Functional account erasure workflow with auth & backend integration).
- **Target Replacement Module:** `src/modules/company/` and unified canonical routes under `/company/...`.
- **Skeleton Folder Location:** `src/deprecated/app/` (Existing project skeleton archive).

---

## 2. Global Brand & Company Verification Audit

| Fact Property | Verified Value | Source / Verification Status |
| :--- | :--- | :--- |
| **Product Name** | Mini Post App | Verified (Repo codebase & metadata) |
| **Primary Domain** | `minipostapp.space` | Verified (Domain configuration) |
| **Operating Entity** | Yoga Products Top Limited | Verified (`AppLayoutClient.tsx`, Footer) |
| **Support Email** | `support@minipostapp.space` | Verified (Mailto handlers & footer) |
| **Primary Workflow** | Create → Optimise → Publish → Analyse | Verified (Navbar subtitle & brand copy) |
| **Founding Date / Founders** | *Unverified* | OMITTED (Do not invent) |
| **Office Address / Phone** | *Unverified* | OMITTED (Do not invent) |
| **Testimonials / Clients** | *Unverified* | OMITTED (Do not invent) |
| **Certifications (SOC2/ISO)**| Reference alignment only | OMITTED unsupported compliance claims |

---

## 3. Audited Pages Inventory & Classification

Below is the exhaustive classification and itemized audit for all existing company-related pages.

### Classification Categories Defined
- **PRESERVE**: Active functional page that must remain unchanged (e.g. `/data-deletion`).
- **REUSE CONTENT**: Valid text, legal definitions, or product descriptions to be ported into the new module.
- **REUSE COMPONENT**: Reusable UI patterns or component structures.
- **REBUILD**: Page needs full reconstruction with structured content.
- **REPLACE**: Superseded by a new canonical module route.
- **REDIRECT**: Compatibility route redirecting to new canonical location.
- **MOVE TO SKELETON**: Obsolete active file to be migrated to `src/deprecated/app/` after new module validation.
- **DUPLICATE**: Redundant alias or duplicate route wrapper.
- **OBSOLETE**: Outdated or unneeded implementation.

---

### Itemized Page Audit

#### 1. `/company`
- **Source File:** `src/app/company/page.tsx`
- **Page Title:** Company & About Us | Mini Post App
- **Page Purpose:** High-level company introduction, mission, vision, target audience, and core differences.
- **Current Status:** Active
- **Current Navigation Links:** Header menu, Footer column 1
- **Metadata:** Custom metadata exported (`title`, `description`)
- **Reusable Content:** Excellent mission statement, vision statement, target audience personas, core platform advantages.
- **Reusable Components:** Icon-card layout, core advantage list.
- **Reusable Legal Text:** Entity declaration (Yoga Products Top Limited).
- **Reusable Assets:** Lucide icons (`Building2`, `Target`, `Eye`, `Users`, `Zap`, `Share2`, `Sparkles`).
- **Redirect Requirements:** Redirect `/company` → `/company/about`.
- **Replacement Route:** `/company/about`
- **Skeleton Migration Status:** MOVE TO SKELETON (after replacement validation).
- **Classification:** REUSE CONTENT, REBUILD, REDIRECT, MOVE TO SKELETON

#### 2. `/careers`
- **Source File:** `src/app/careers/page.tsx`
- **Page Title:** Careers & Open Positions | Mini Post App
- **Page Purpose:** Displays job opportunities and culture pillars.
- **Current Status:** Active (contains unverified open positions)
- **Current Navigation Links:** Footer column 1
- **Metadata:** Custom metadata exported
- **Reusable Content:** Culture pillars (Remote-first, Modern Tech Stack, Creator Impact, Engineering Quality).
- **Reusable Components:** Culture card layout.
- **Reusable Legal Text:** None.
- **Reusable Assets:** Lucide icons (`Briefcase`, `Globe`, `Code2`, `Cpu`, `Palette`).
- **Redirect Requirements:** Redirect `/careers` → `/company/careers`.
- **Replacement Route:** `/company/careers` (Must accurately state NO active vacancies per verified rules).
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REBUILD, REDIRECT, MOVE TO SKELETON

#### 3. `/values`
- **Source File:** `src/app/values/page.tsx`
- **Page Title:** Our Values | Mini Post App
- **Page Purpose:** Outlines company core values.
- **Current Status:** Active
- **Current Navigation Links:** Footer column 1
- **Metadata:** Custom metadata exported
- **Reusable Content:** Company values definitions (Clarity, User Control, Responsible AI, Engineering Standards, etc.).
- **Reusable Components:** Values card layout.
- **Reusable Legal Text:** None.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/values` → `/company/values`.
- **Replacement Route:** `/company/values`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 4. `/press`
- **Source File:** `src/app/press/page.tsx`
- **Page Title:** Press, Media Kit & Websites | Mini Post App
- **Page Purpose:** Press assets, quick facts, media kit requests, press contact.
- **Current Status:** Active
- **Current Navigation Links:** Footer column 1
- **Metadata:** Custom metadata exported
- **Reusable Content:** Quick facts table, media asset descriptions, press inquiry contact workflow.
- **Reusable Components:** Quick facts card grid.
- **Reusable Legal Text:** Entity details.
- **Reusable Assets:** Lucide icons (`Newspaper`, `Download`, `Mail`).
- **Redirect Requirements:** Redirect `/press` → `/company/media/press`.
- **Replacement Route:** `/company/media/press`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 5. `/help`
- **Source File:** `src/app/help/page.tsx`
- **Page Title:** Help Center | Mini Post App
- **Page Purpose:** Client-side searchable FAQ, troubleshooting quick links, support contact.
- **Current Status:** Active
- **Current Navigation Links:** Header help icon, Footer column 3
- **Metadata:** Client component (missing static metadata export)
- **Reusable Content:** FAQ data array, quick help category cards, troubleshooting links, support hours/turnaround.
- **Reusable Components:** Searchable FAQ accordion, categories grid.
- **Reusable Legal Text:** Support mailto link structure.
- **Reusable Assets:** Lucide icons (`HelpCircle`, `Search`, `ChevronDown`, `LifeBuoy`).
- **Redirect Requirements:** Redirect `/help` → `/company/resources/help`.
- **Replacement Route:** `/company/resources/help`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REUSE COMPONENT, REDIRECT, MOVE TO SKELETON

#### 6. `/trust-safety`
- **Source File:** `src/app/trust-safety/page.tsx`
- **Page Title:** Trust, Safety & Engineering Standards | Mini Post App
- **Page Purpose:** Trust & safety principles, engineering standards, compliance framework alignment.
- **Current Status:** Active
- **Current Navigation Links:** Header navigation, Footer trust banner
- **Metadata:** Custom metadata exported
- **Reusable Content:** Responsible AI principles, user safety standards, framework alignment breakdown.
- **Reusable Components:** Standards card grid.
- **Reusable Legal Text:** Security & compliance disclaimers.
- **Reusable Assets:** Lucide icons (`ShieldCheck`, `Lock`, `Scale`, `FileText`).
- **Redirect Requirements:** Redirect `/trust-safety` → `/company/trust/trust-safety`, `/trust-center` → `/company/trust/trust-safety`.
- **Replacement Route:** `/company/trust/trust-safety`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 7. `/trust-center`
- **Source File:** `src/app/trust-center/page.tsx`
- **Page Title:** Trust Center | Mini Post App
- **Page Purpose:** Alias page for Trust & Safety.
- **Current Status:** Active duplicate wrapper
- **Current Navigation Links:** None directly
- **Metadata:** Duplicate metadata
- **Reusable Content:** Re-exports `/trust-safety` content.
- **Reusable Components:** None.
- **Reusable Legal Text:** None.
- **Reusable Assets:** None.
- **Redirect Requirements:** Redirect `/trust-center` → `/company/trust/trust-safety`.
- **Replacement Route:** `/company/trust/trust-safety`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** DUPLICATE, REDIRECT, MOVE TO SKELETON

#### 8. `/data-deletion`
- **Source File:** `src/app/data-deletion/page.tsx`
- **Page Title:** Data Deletion Request | Mini Post App
- **Page Purpose:** Interactive account deletion & data erasure form with active `useAuth()` integration.
- **Current Status:** ACTIVE & PROTECTED (PRIMARY OBJECTIVE RULE)
- **Current Navigation Links:** Footer column 4, LegalLayout directory
- **Metadata:** Handled inside LegalLayout or parent wrapper
- **Reusable Content:** Full live functional component.
- **Reusable Components:** Live form, interactive confirmation workflow, error states, success feedback.
- **Reusable Legal Text:** Comprehensive GDPR/CCPA data erasure instructions.
- **Reusable Assets:** Lucide icons (`Trash2`, `ShieldCheck`, `AlertTriangle`, `CheckCircle2`).
- **Redirect Requirements:** DO NOT REDIRECT. Preserve route directly at `/data-deletion`.
- **Replacement Route:** `/data-deletion` (Preserved active implementation, linked directly into Trust group).
- **Skeleton Migration Status:** DO NOT MOVE TO SKELETON.
- **Classification:** PRESERVE

#### 9. `/privacy-policy` & `/privacy`
- **Source Files:** `src/app/privacy-policy/page.tsx`, `src/app/privacy/page.tsx`, `src/app/legal/privacy-policy/page.tsx`, `src/app/legal/privacy/page.tsx`
- **Page Title:** Privacy Policy | Mini Post App
- **Page Purpose:** Formal Privacy Policy legal terms.
- **Current Status:** Active across multiple duplicate paths
- **Current Navigation Links:** Footer column 4, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** Privacy terms, data collection categories, rights, contacts.
- **Reusable Components:** Legal text formatting.
- **Reusable Legal Text:** Verified privacy policy clauses for Yoga Products Top Limited.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/privacy-policy` → `/company/trust/privacy`, `/privacy` → `/company/trust/privacy`, `/legal/privacy-policy` → `/company/trust/privacy`, `/legal/privacy` → `/company/trust/privacy`.
- **Replacement Route:** `/company/trust/privacy`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, DUPLICATE, REDIRECT, MOVE TO SKELETON

#### 10. `/terms-of-service` & `/terms`
- **Source Files:** `src/app/terms-of-service/page.tsx`, `src/app/terms/page.tsx`, `src/app/legal/terms-of-service/page.tsx`, `src/app/legal/terms/page.tsx`
- **Page Title:** Terms of Service | Mini Post App
- **Page Purpose:** Formal Terms of Service legal contract.
- **Current Status:** Active across multiple duplicate paths
- **Current Navigation Links:** Footer column 4, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** Terms clauses, acceptable use, AI output ownership, subscription terms, limitation of liability.
- **Reusable Components:** Legal document structure.
- **Reusable Legal Text:** Verified terms text for Yoga Products Top Limited.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/terms-of-service` → `/company/trust/terms`, `/terms` → `/company/trust/terms`, `/legal/terms-of-service` → `/company/trust/terms`, `/legal/terms` → `/company/trust/terms`.
- **Replacement Route:** `/company/trust/terms`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, DUPLICATE, REDIRECT, MOVE TO SKELETON

#### 11. `/cookie-policy`
- **Source Files:** `src/app/cookie-policy/page.tsx`, `src/app/legal/cookie-policy/page.tsx`
- **Page Title:** Cookie Policy | Mini Post App
- **Page Purpose:** Cookie usage and disclosure document.
- **Current Status:** Active
- **Current Navigation Links:** Footer column 4, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** Cookie categories (essential, performance, functional), consent management description.
- **Reusable Components:** Legal document formatting.
- **Reusable Legal Text:** Verified cookie definitions.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/cookie-policy` → `/company/trust/cookies`, `/legal/cookie-policy` → `/company/trust/cookies`.
- **Replacement Route:** `/company/trust/cookies`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 12. `/gdpr` & `/gdpr-request`
- **Source Files:** `src/app/gdpr/page.tsx`, `src/app/gdpr-request/page.tsx`, `src/app/legal/gdpr/page.tsx`
- **Page Title:** GDPR Compliance Information | Mini Post App
- **Page Purpose:** General Data Protection Regulation compliance documentation & request procedures.
- **Current Status:** Active
- **Current Navigation Links:** Footer column 4, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** EU data rights breakdown, DPO contact, lawful bases for processing.
- **Reusable Components:** Legal layout.
- **Reusable Legal Text:** GDPR compliance text.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/gdpr` → `/company/trust/gdpr`, `/gdpr-request` → `/company/trust/gdpr`, `/legal/gdpr` → `/company/trust/gdpr`.
- **Replacement Route:** `/company/trust/gdpr`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, DUPLICATE, REDIRECT, MOVE TO SKELETON

#### 13. `/data-processing-agreement` & `/legal/dpa`
- **Source Files:** `src/app/data-processing-agreement/page.tsx`, `src/app/legal/dpa/page.tsx`
- **Page Title:** Data Processing Agreement (DPA) | Mini Post App
- **Page Purpose:** Standard Data Processing Addendum for business customers.
- **Current Status:** Active
- **Current Navigation Links:** MoreLegalDocumentsMenu
- **Metadata:** Basic metadata
- **Reusable Content:** DPA terms, data importer/exporter responsibilities, security measures annex.
- **Reusable Components:** Legal document layout.
- **Reusable Legal Text:** DPA clauses.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/data-processing-agreement` → `/company/trust/data-processing-agreement`, `/legal/dpa` → `/company/trust/data-processing-agreement`.
- **Replacement Route:** `/company/trust/data-processing-agreement`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 14. `/security`
- **Source Files:** `src/app/security/page.tsx`, `src/app/legal/security/page.tsx`
- **Page Title:** Security & Infrastructure | Mini Post App
- **Page Purpose:** Security practices, AES-256 token encryption, infrastructure overview.
- **Current Status:** Active
- **Current Navigation Links:** MoreLegalDocumentsMenu, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** Security controls overview (OAuth token security, SSL/TLS 1.3, Firebase infrastructure).
- **Reusable Components:** Legal/security layout.
- **Reusable Legal Text:** Security disclosures.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/security` → `/company/trust/security`, `/legal/security` → `/company/trust/security`.
- **Replacement Route:** `/company/trust/security`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 15. `/subprocessors`
- **Source Files:** `src/app/subprocessors/page.tsx`, `src/app/legal/subprocessors/page.tsx`
- **Page Title:** Subprocessors Directory | Mini Post App
- **Page Purpose:** List of third-party vendor subprocessors.
- **Current Status:** Active
- **Current Navigation Links:** MoreLegalDocumentsMenu, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** Real subprocessor list (Google Cloud / Firebase, Stripe, Pollinations.ai, Vercel / Hosting).
- **Reusable Components:** Subprocessor table/card list.
- **Reusable Legal Text:** Subprocessor notification terms.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/subprocessors` → `/company/trust/subprocessors`, `/legal/subprocessors` → `/company/trust/subprocessors`.
- **Replacement Route:** `/company/trust/subprocessors`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 16. `/disclaimer`
- **Source Files:** `src/app/disclaimer/page.tsx`, `src/app/legal/disclaimer/page.tsx`
- **Page Title:** Legal Disclaimer | Mini Post App
- **Page Purpose:** General legal disclaimers regarding AI generated content and third-party API availability.
- **Current Status:** Active
- **Current Navigation Links:** MoreLegalDocumentsMenu, LegalLayout nav
- **Metadata:** Basic metadata
- **Reusable Content:** AI generation disclaimers, platform availability disclaimers.
- **Reusable Components:** Legal document layout.
- **Reusable Legal Text:** Legal disclaimers.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/disclaimer` → `/company/trust/terms` (or canonical disclaimer section).
- **Replacement Route:** `/company/trust/terms`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

#### 17. `/legal`
- **Source File:** `src/app/legal/page.tsx`
- **Page Title:** Legal & Compliance Center | Mini Post App
- **Page Purpose:** Index page listing all legal policies.
- **Current Status:** Active
- **Current Navigation Links:** Footer column 4
- **Metadata:** Index page metadata
- **Reusable Content:** Legal directory links and policy descriptions.
- **Reusable Components:** Directory link grid.
- **Reusable Legal Text:** Policy summaries.
- **Reusable Assets:** Lucide icons.
- **Redirect Requirements:** Redirect `/legal` → `/company/trust/trust-safety`.
- **Replacement Route:** `/company/trust/trust-safety`
- **Skeleton Migration Status:** MOVE TO SKELETON
- **Classification:** REUSE CONTENT, REDIRECT, MOVE TO SKELETON

---

## 4. Existing Navigation & Component Audit

### Header Navigation (`src/app/AppLayoutClient.tsx`)
- Current links: `/ #ai-engine`, `/ #features`, `/subscribe`, `/trust-safety`, `/help`, `/tour`.
- Defect identified: Hardcoded section anchors and fragmented paths.
- Action: Replace with centralized text navigation pointing to the new Company Module structure (`Features`, `Pricing`, `Company`, `Resources`, `Trust`, `Contact`).

### Footer Navigation (`src/app/AppLayoutClient.tsx`)
- Current links: 4 columns (Company, Capabilities, Resources, Legal Center).
- Defect identified: Hardcoded mailto link as sole Contact route, fragmented legal dropdown, outdated paths (`/company`, `/values`, `/careers`, `/press`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/gdpr`, `/data-deletion`).
- Action: Update footer links to reference new Company Module canonical routes (`Company`, `Product`, `Resources`, `Trust`, `Media`, `Business`, `Legal`) and ensure `/data-deletion` is properly preserved.

### Legal Components (`src/components/legal/`)
- `LegalLayout.tsx`: Custom layout for legal pages.
- `MoreLegalDocumentsMenu.tsx`: Dropdown for secondary legal links.
- Audit result: Reusable layout patterns, but hardcoded routes must be updated to align with `src/modules/company/`.

---

## 5. Prebuild Audit Conclusion

All 32 existing company-related page implementations have been catalogued and classified.
No files have been modified during Phase A. We are now ready to proceed to Phase B (Module Architecture) and Phase C (Implementation).

---
*Audit completed by Antigravity Agent for Mini Post App.*
