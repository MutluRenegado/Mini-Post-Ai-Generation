# Post Visual Brief Specification — Mini Post App

**Directory Path:** `docs/AI Modules/Image Creation Modules/05_visual_brief.md`  
**Service:** `PostVisualBriefExtractor.ts`  
**Date:** August 2, 2026  

---

## PostVisualBrief Interface

```ts
export interface PostVisualBrief {
  postId?: string;
  platform: string;
  postType: string;
  primaryTopic: string;
  centralMessage: string;
  communicationGoal: string;
  readerIntent: string;
  targetAudience: string;
  mainSubject: string;
  supportingSubjects: string[];
  environment: string;
  actionOrSituation: string;
  visualStory: string;
  emotionalTone: string;
  visualMood: string;
  visualStyle: string;
  keyObjects: string[];
  prohibitedObjects: string[];
  composition: string;
  cameraAngle: string;
  lighting: string;
  colorDirection: string;
  width: number;
  height: number;
  aspectRatio: string;
  negativeConstraints: string[];
}
```

---
*Specification maintained by Antigravity Agent.*
