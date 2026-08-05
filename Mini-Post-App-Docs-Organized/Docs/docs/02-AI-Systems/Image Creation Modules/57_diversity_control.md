# 57 — Diversity Control & Overuse Penalties — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/57_diversity_control.md`  
**Date:** August 2, 2026  

---

## 1. Overview

`DiversityController` prevents popular images from repeatedly dominating search selection.

### Implemented Adjustments:
1. **Usage Penalty**: Deducts 5 points per past usage up to -30 points (`usageCount * 5`).
2. **Recency Penalty**: Deducts -25 points if used today, -15 if used within 3 days, -5 if used within 7 days.
3. **Repeated Scene / Topic Penalty**: Deducts -10 points if the image's scene/topic has already been selected multiple times recently.

---
*Specification maintained by Antigravity Agent for Mini Post App.*
