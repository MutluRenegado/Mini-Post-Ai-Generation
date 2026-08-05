# Final Text Gate Specification — Mini Post App

**Directory Path:** `docs/Image Pipeline Repair/final_text_gate.md`  
**Date:** August 2, 2026  

---

## Final Text Gate Implementation

```ts
export type TextStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'EDITING'
  | 'VALIDATING'
  | 'READY_FOR_APPROVAL'
  | 'FINAL'
  | 'REJECTED';

export function isImageGenerationAllowed(state?: Partial<FinalTextState>): { allowed: boolean; reason?: string } {
  if (!state) {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_TEXT_NOT_FINAL' };
  }
  const status = (state.textStatus || '').toUpperCase();
  if (status !== 'FINAL' && status !== 'APPROVED') {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_TEXT_NOT_FINAL' };
  }
  if (!state.finalText || state.finalText.trim().length === 0) {
    return { allowed: false, reason: 'IMAGE_GENERATION_BLOCKED_FINAL_TEXT_EMPTY' };
  }
  return { allowed: true };
}
```

---
*Specification maintained by Antigravity Agent.*
