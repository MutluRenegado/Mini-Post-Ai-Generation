# 56 — Transparent Multi-Component Ranking Engine — Mini Post App

**Target Path:** `docs/AI Modules/Image Creation Modules/56_transparent_ranking.md`  
**Date:** August 2, 2026  

---

## 1. Multi-Component Ranking Formula

`VisualRankingService` evaluates candidates against query parameters and returns explicit component scores:

```typescript
export interface ComponentScores {
  metadataSimilarity: number;
  industryMatch: number;
  categoryMatch: number;
  sceneMatch: number;
  subjectMatch: number;
  peopleMatch: number;
  roleMatch: number;
  objectMatch: number;
  environmentMatch: number;
  styleMatch: number;
  lightingMatch: number;
  compositionMatch: number;
  moodMatch: number;
  platformMatch: number;
  aspectRatioMatch: number;
  qualityScore: number;
  approvalScore: number;
  rejectionPenalty: number;
  diversityPenalty: number;
  usagePenalty: number;
  recencyAdjustment: number;
}
```

Every candidate result returns `candidateId`, `finalScore` (0–100), `componentScores`, `rankingVersion: '2.0.0-metadata-transparent'`, and a human-readable explanation string.

---
*Specification maintained by Antigravity Agent for Mini Post App.*
