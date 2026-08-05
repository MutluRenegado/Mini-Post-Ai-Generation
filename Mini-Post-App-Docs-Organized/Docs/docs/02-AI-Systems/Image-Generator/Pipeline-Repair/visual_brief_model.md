# Visual Brief Model Specification — Mini Post App

**Directory Path:** `docs/Image Pipeline Repair/visual_brief_model.md`  
**Interface:** `PostVisualBrief` (`image.types.ts`)  
**Date:** August 2, 2026  

---

## PostVisualBrief Model

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
