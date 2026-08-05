# Mini Post App Standards System

The **Mini Post App Standards System** provides a unified, production-ready specification for AI generation, platform posting, video production, templates, branding, publishing, and compliance across all 14 studios.

---

## Directory Architecture

```text
src/standards/
├── README.md
├── index.ts
│
├── ai/
│   ├── ai-writing.standard.ts
│   ├── prompt.standard.ts
│   ├── image.standard.ts
│   └── quality.standard.ts
│
├── posts/
│   ├── facebook.standard.ts
│   ├── instagram.standard.ts
│   ├── linkedin.standard.ts
│   ├── x.standard.ts
│   ├── threads.standard.ts
│   ├── pinterest.standard.ts
│   ├── youtube.standard.ts
│   ├── tiktok.standard.ts
│   └── google-business.standard.ts
│
├── video/
│   ├── shorts.standard.ts
│   ├── reels.standard.ts
│   ├── youtube.standard.ts
│   └── video-production.standard.ts
│
├── templates/
│   ├── template.standard.ts
│   ├── sizing.standard.ts
│   └── layout.standard.ts
│
├── branding/
│   ├── typography.standard.ts
│   ├── color.standard.ts
│   ├── hierarchy.standard.ts
│   ├── spacing.standard.ts
│   └── ui.standard.ts
│
├── publishing/
│   ├── seo.standard.ts
│   ├── hashtag.standard.ts
│   ├── scheduling.standard.ts
│   └── publishing.standard.ts
│
└── compliance/
    ├── accessibility.standard.ts
    ├── content-policy.standard.ts
    └── platform-rules.standard.ts
```

---

## Usage

Import standards directly anywhere in the project:

```ts
import { 
  AIWritingStandard, 
  FacebookPostStandard, 
  SizingStandard,
  AccessibilityStandard 
} from '@/standards';
```
