# Known Architectural Risks — Mini Post App

**Directory Path:** `docs/AI Modules/Image Creation Modules/18_known_issues.md`  
**Date:** August 2, 2026  

---

## Identified Risks & Recommendations

1. **Distributed Location**: Services currently reside across `src/lib/ai/images/` and `src/modules/image-kernel/`. Consolidation into `src/modules/image-intelligence/` is recommended for future refactoring.
2. **Vector Search Integration**: Vector embeddings search for reference images will enhance quality matching for specialized domain concepts.

---
*Risk report maintained by Antigravity Agent.*
