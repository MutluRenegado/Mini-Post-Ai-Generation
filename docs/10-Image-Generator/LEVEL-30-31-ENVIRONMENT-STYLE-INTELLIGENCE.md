# Level 30 & 31: Environment, Context, Visual Style, and Color Intelligence Specification

## 1. Executive Overview

This specification documents the implementation and architectural boundaries of **Phase 1** of the Autonomous Image Generator:
- **Level 30 — Environment and Context Authenticity Intelligence**: Solves spatial, architectural, infrastructure, weather, season, and multi-space environmental reasoning.
- **Level 31 — Visual Style and Color Intelligence**: Solves editorial genre selection, rendering medium selection, color psychology, 5-role palette generation, brand alignment, and WCAG 2.1 AAA contrast verification.

---

## 2. Pipeline Integration Position

Phase 1 engines execute sequentially within `FinalPostAnalyzer`:

```
Finalized Article
 └── FinalPostAnalyzer
      ├── SemanticSubjectIntelligence (Level 25)
      ├── VisualStoryEngine (Level 26)
      ├── SceneGraphEngine (Level 27)
      ├── SpatialReasoningEngine (Level 28)
      ├── OccupationInteractionEngine (Level 29)
      ├── EnvironmentAuthenticityEngine (Level 30)
      ├── VisualStyleColorEngine (Level 31)
      └── VisualConceptGenerator (Level 15)
```

---

## 3. Level 30 — Environment & Context Authenticity Intelligence

### 3.1 8-Layer Environment Hierarchy
Level 30 structures environment knowledge using a strict 8-layer hierarchy:

$$\text{World} \longrightarrow \text{Region} \longrightarrow \text{Setting} \longrightarrow \text{Environment} \longrightarrow \text{Zone} \longrightarrow \text{Infrastructure} \longrightarrow \text{Workspace} \longrightarrow \text{Context Objects}$$

### 3.2 Environment Transition Graph Edges
Multi-space connected environments (e.g. Clinical Radiology Suite $\longleftrightarrow$ Medical Security Operations Hub) are represented as typed `EnvironmentTransitionEdge` records:
- `sourceEnvironmentId`: Primary domain environment identifier
- `destinationEnvironmentId`: Secondary domain environment identifier
- `relationshipType`: E.g., `connected_control_hub`, `adjoining_facility`
- `accessibility`: `glass_partition`, `secured_doorway`, `open_floor_plan`

### 3.3 10-Domain Component Confidence Map
Tracks independent confidence ($0.0 - 1.0$) across 10 environmental domains:
- `environmentConfidence`
- `locationConfidence`
- `architectureConfidence`
- `infrastructureConfidence`
- `workspaceConfidence`
- `weatherConfidence`
- `seasonConfidence`
- `timePeriodConfidence`
- `regionalConfidence`
- `contextualObjectsConfidence`

---

## 4. Level 31 — Visual Style & Color Intelligence

### 4.1 Editorial Style Genres & Rendering Mediums
Maps post topics to curated editorial genres:
- `editorial_photo`: Authentic clinical, journalistic, or executive photojournalism.
- `documentary_corporate`: Clean professional corporate documentary photography.
- `high_tech_modern`: Sleek modern tech hub with illuminated glass and anodized aluminum.
- `minimalist_professional`: Clean minimalist studio or office aesthetic.
- `industrial_documentary`: High-bay manufacturing or solar farm field photography.
- `academic_scholarly`: Sunlit modern university research lab or lecture setting.

Rendering Medium defaults to `real_world_photography` for 100% photographic authenticity.

### 4.2 5-Role Color Palette & WCAG 2.1 AAA Contrast
Generates a complete hex color palette across 5 mandatory roles:
- `primary`: Dominant background/structural tone (e.g. `#0F172A`)
- `secondary`: Supporting architectural/furniture tone (e.g. `#0284C7`)
- `accent`: Highlighting telemetry/ui accent tone (e.g. `#38BDF8`)
- `neutral`: Text and acoustic partition tone (e.g. `#64748B`)
- `background`: Overall ambient environment background (e.g. `#F8FAFC`)

Verifies WCAG 2.1 AAA contrast compliance ($\ge 4.5:1$ text-vs-background contrast ratio).

---

## 5. Provenance & Deterministic Fingerprinting

### 5.1 Evidence Provenance Contract
Every resolved attribute retains full evidence provenance:
```typescript
export interface StyleEvidence {
  sourceLayer: 'finalized_article' | 'brand_direction' | 'semantic_subject' | 'environment_plan';
  sourceId: string;
  evidenceExcerpt: string;
  derivation: 'direct' | 'inferred' | 'brand_guided';
  confidence: number;
  isRequired: boolean;
}
```

### 5.2 Deterministic Fingerprint
Both engines generate a deterministic SHA-256 fingerprint (64 hex characters) computed over canonical plan attributes:
- Same article input $\longrightarrow$ 100% identical fingerprint.
- Zero randomness or floating-point variance.

---

## 6. Verification & Test Commands

Run the full verification suite synchronously:

```bash
# 1. Level 30 Unit Tests (28 Assertions)
npx tsx --test src/tests/level-30-environment-authenticity-intelligence.test.ts

# 2. Level 31 Unit Tests (25 Assertions)
npx tsx --test src/tests/level-31-visual-style-color-intelligence.test.ts

# 3. Phase 1 Combined Tests (53 Assertions)
npx tsx --test src/tests/level-30-environment-authenticity-intelligence.test.ts src/tests/level-31-visual-style-color-intelligence.test.ts

# 4. Levels 25–31 Intelligence Suite (189 Assertions)
npx tsx --test src/tests/level-25-*.test.ts src/tests/level-26-*.test.ts src/tests/level-27-*.test.ts src/tests/level-28-*.test.ts src/tests/level-29-*.test.ts src/tests/level-30-*.test.ts src/tests/level-31-*.test.ts

# 5. Full Level Regression Suite (657 Assertions)
npx tsx --test src/tests/level-*.test.ts

# 6. Eight-Domain Runtime Audit
npx tsx scripts/test-level31-runtime-audit.ts

# 7. TypeScript Check
npx tsc --noEmit

# 8. Next.js Production Build
npm run build
```

---

## 7. Status & Certification

**Phase 1 (Levels 30 & 31)**: **CERTIFIED (PASS)**
- Zero TypeScript errors (`tsc --noEmit`).
- 657/657 level tests passing.
- Next.js Turbopack build succeeded with 99 static pages.
