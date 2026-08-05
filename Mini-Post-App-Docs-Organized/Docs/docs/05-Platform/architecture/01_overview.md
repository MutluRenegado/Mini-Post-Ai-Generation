# Standalone Visual Intelligence Platform — Architecture Overview

**Document Path:** `docs/platform/architecture/01_overview.md`  
**System Status:** PHASE 2A STANDALONE PRODUCT SPECIFICATION  
**Date:** August 2, 2026  

---

## 1. Product Statement

The **Visual Intelligence Platform** is an independent, enterprise visual asset intelligence product. It serves multiple Orion products (Mini Post App, StudioOS, Video Creator) and external application consumers via REST APIs and TypeScript SDK adapters.

---

## 2. Product-Level Directory Layout

```
src/
├── library/               # Core Image Library Engine (Phase 2A)
│   ├── domain/            # VisualReference data models & Zod schemas
│   ├── repositories/      # Firestore & In-Memory repositories
│   ├── ingestion/         # Folder scanner, sync service, metadata extractor
│   ├── storage/           # Firebase Storage binary & thumbnail handlers
│   ├── review/            # Rights & review status state machine
│   └── search/            # Faceted search, pagination, batch operations
│
├── intelligence/          # Visual Intelligence Engine (Phase 2B - DEFERRED)
├── knowledge/             # Visual Knowledge Base (Phase 2D - DEFERRED)
├── learning/              # Preference Learning Engine (Phase 2C - DEFERRED)
├── api/                   # REST API Platform (Phase 2E - DEFERRED)
├── sdk/                   # TypeScript Client SDK (Phase 2E - DEFERRED)
├── admin/                 # Admin UI Components & Pages
└── tests/                 # Phase 2A Test Suite
```

---

## 3. Algorithm & Feature Classifications

- **SHA-256 Checksum**: `DETERMINISTIC_HASH`
- **dHash Perceptual Hash**: `PERCEPTUAL_HASH_HEURISTIC`
- **Technical Metadata**: `DETERMINISTIC_METADATA`
- **Manual Classification**: `MANUAL_METADATA`
- **Visual Analyzers**: `NOT_IMPLEMENTED`
- **Semantic Embeddings**: `NOT_IMPLEMENTED`

---
*Specification maintained by Antigravity Agent for Visual Intelligence Platform.*
