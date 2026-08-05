# 61 — Phase 2A & 2B Manual Review Guide — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/61_phase2_manual_review.md`  
**Date:** August 2, 2026  

---

## 1. Manual Verification Instructions

### Step 1: Test Local Folder Scan CLI Command
Run:
```bash
npm run image-library:scan
```
Verify that the CLI scans `D:\Library\Images Library` and reports the file count without mutating disk files.

### Step 2: Test Metadata Retrieval & Component Ranking
In the application runtime or node REPL:
```typescript
import { VisualReferenceResolver } from '@/modules/image-library';

const resolver = new VisualReferenceResolver();
const result = await resolver.resolveVisualReference({
  topic: 'Finance',
  industry: 'Banking',
});

console.log(result.explanation);
```
Verify that `result.explanation` prints explicit component scores and human-readable explanation.

---
*Specification maintained by Antigravity Agent for Mini Post App.*
