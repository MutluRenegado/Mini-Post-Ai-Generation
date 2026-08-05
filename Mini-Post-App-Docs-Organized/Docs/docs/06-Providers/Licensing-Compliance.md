# Licensing Compliance — Mini Post App

Status: **Verified Governance Policy**  
Scope: Intellectual Property & Stock Photo Terms Compliance.

---

## 1. Provider License Overview

Mini Post App integrates with stock photo platforms operating under distinct license terms. Developers and operators MUST respect provider-specific legal terms and MUST NOT assume uniform licensing rules across providers.

| Provider | Applicable License Terms | Commercial Use Allowed | Attribution Requirements | Hotlinking Restrictions | Permanent Asset Storage Policy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pexels** | Pexels License | Yes (Free for commercial use) | Recommended / Mandatory in app UI | Direct CDN URLs permitted for display | Selective import into local/Firebase storage |
| **Pixabay** | Pixabay Content License | Yes (Free for commercial use) | Source & contributor credit required | Permanent hotlinking **forbidden** | Mandatory download to approved storage prior to permanent post publishing |
| **Unsplash** | Unsplash License | Yes (Free for commercial use) | Photographer credit & Unsplash link mandatory | Direct hotlinking allowed with download tracking trigger | Download tracking trigger required upon selection |

---

## 2. Universal Governance Principles

1. **No Ownership Claims**: Mini Post App DOES NOT claim ownership or copyright over images fetched from Pexels, Pixabay, or Unsplash.
2. **No Raw Asset Reselling**: Stock photo assets obtained via APIs MUST NOT be exported, resold, or redistributed as standalone stock imagery packages.
3. **Mandatory Unreviewed Rights State**: Imported stock images default to an unreviewed state (`rightsConfirmed: false`, `commercialUseReviewStatus: 'PENDING'`) until reviewed.
4. **Attribution Retention**: Metadata containing creator credits, profile URLs, provider names, and source asset links MUST remain attached to asset records in the Asset Library.
