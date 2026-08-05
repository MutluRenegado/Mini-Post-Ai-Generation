# Company Module Architecture — Mini Post App

**Project:** `D:\Library\workspace\KKK\MINIPOSTAPP\mini-post-app-master`  
**Date:** August 2, 2026  
**Status:** PHASE B — ARCHITECTURE SPECIFICATION

---

## 1. Executive Architecture Summary

The Company Module for Mini Post App centralizes all company, product, resource, trust, media, and business pages into a modular, maintainable, and highly structured architecture located at `src/modules/company/`.

### Core Goals
1. **Single Source of Truth**: Consolidate company facts, entity details, support routes, navigation groups, and metadata into centralized configuration objects.
2. **Canonical Route Standardization**: Establish 34 canonical routes under `/company/...` plus 1 preserved route at `/data-deletion`.
3. **Compatibility Layer**: Ensure zero broken bookmarks or legal links via `next.config.ts` redirects.
4. **Data Deletion Protection**: Keep `/data-deletion` fully functional with live authentication and form handlers.
5. **No Unsupported Claims**: Strictly prevent generic placeholders, fake testimonials, fake team bios, fake certifications, or unverified job vacancies.

---

## 2. Directory Structure

```
src/modules/company/
├── components/
│   ├── CompanyJsonLd.tsx
│   ├── CompanyNav.tsx
│   ├── CompanyPageShell.tsx
│   ├── ContactForm.tsx
│   ├── EmptyStateCard.tsx
│   └── RelatedPages.tsx
├── config/
│   ├── companyFacts.ts
│   └── navigationConfig.ts
├── content/
│   ├── businessContent.ts
│   ├── companyContent.ts
│   ├── mediaContent.ts
│   ├── productContent.ts
│   ├── resourcesContent.ts
│   └── trustContent.ts
├── metadata/
│   └── metadataHelpers.ts
└── types/
    └── company.ts
```

---

## 3. Module Responsibilities & Design System

### A. Centralized Facts (`config/companyFacts.ts`)
Stores all verified corporate identity attributes:
- `productName`: "Mini Post App"
- `domain`: "minipostapp.space"
- `baseUrl`: "https://minipostapp.space"
- `operatingEntity`: "Yoga Products Top Limited"
- `supportEmail`: "support@minipostapp.space"
- `deletionEmail`: "deletion@minipostapp.space"
- `workflow`: "Create → Optimise → Publish → Analyse"
- `supportedPlatforms`: ["Facebook", "Instagram", "LinkedIn", "X (Twitter)", "TikTok", "YouTube"]
- `aiEngine`: "Google Gemini AI Flash Architecture"

### B. Navigation & Taxonomy (`config/navigationConfig.ts`)
Defines the 6 official navigation pillars:
1. **Company**: About, Our Story, Mission, Vision, Values, Careers, Contact
2. **Product**: Features, Capabilities, AI Engine, Templates, Pricing, Enterprise
3. **Resources**: Help Center, Documentation, FAQ, Tutorials, Blog, Changelog, Roadmap
4. **Trust**: Trust & Safety, Security, Privacy, Terms, Cookies, GDPR, Data Processing Agreement, Data Deletion, Subprocessors, Status
5. **Media**: Press, Brand Kit, Logos, Screenshots, Media Kit
6. **Business**: Partners, Affiliate, Case Studies, Customer Stories

### C. Shared Page Shell (`components/CompanyPageShell.tsx`)
Provides category-aware layout wrapper with:
- Category badge & group indicator
- Structured breadcrumbs (`BreadcrumbList` schema)
- Page title & introduction hero
- Category sub-navigation bar (`CompanyNav`)
- Main content body container with high-contrast typography
- Contextual call-to-action (CTA)
- Related pages recommendation grid (`RelatedPages`)
- Automatic `Organization` and `BreadcrumbList` JSON-LD structured data injection (`CompanyJsonLd`)

### D. Centralized Metadata (`metadata/metadataHelpers.ts`)
Generates standardized Next.js `Metadata` objects including title templates, descriptions, canonical URLs, Open Graph tags, Twitter card specifications, and robots directives.

---

## 4. Architectural Safety Rules

- **No Fact Fabrication**: Unsupported claims (office addresses, phone numbers, founder names, funding amounts, revenue, certifications) are strictly omitted.
- **No Orphaned Pages**: Every canonical page is linked within `navigationConfig.ts` and rendered in Category Sub-Nav or Footer.
- **No Dead CTAs**: All CTAs direct users to valid internal routes or verified mailto handlers (`support@minipostapp.space`).
- **OrionHQ Residue Removal**: All legacy references to OrionHQ or prior test branding are completely eliminated from company pages.

---
*Architectural specification authored by Antigravity Agent.*
