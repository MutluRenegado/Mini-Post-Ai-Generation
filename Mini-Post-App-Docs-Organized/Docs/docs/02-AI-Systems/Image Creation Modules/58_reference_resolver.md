# 58 — VisualReferenceResolver & Asset Modes — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/58_reference_resolver.md`  
**Date:** August 2, 2026  

---

## 1. Supported Asset Modes

`VisualReferenceResolver` controls visual reference retrieval under 5 explicit modes:

1. `AI_GENERATED_WITH_REFERENCE_ENRICHMENT` (Default): Approved references enrich visual briefs and prompts; existing provider generates the final image. No silent asset substitution occurs.
2. `LIBRARY_REFERENCE`: Selected existing approved library photograph becomes the actual post image.
3. `USER_SELECT`: User manually picks from ranked candidate list.
4. `AUTO_SELECT`: System selects top reference if threshold is met under explicit policy.
5. `AI_GENERATED`: Standard generation without reference enrichment.

---
*Specification maintained by Antigravity Agent for Mini Post App.*
