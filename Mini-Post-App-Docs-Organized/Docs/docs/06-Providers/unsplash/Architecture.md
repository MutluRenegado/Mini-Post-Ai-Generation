# Unsplash Architecture Specification — Mini Post App

Status: **Planned Architecture**  
Target Directory: `src/providers/unsplash/` (Planned)

---

## Planned Directory Structure

```
src/providers/unsplash/
├── index.ts                 # Module barrel export
├── unsplash.types.ts        # Interfaces for Unsplash raw JSON
├── unsplash.errors.ts       # Unsplash error domain classes
├── unsplash.rate-limit.ts   # Rate limit header tracker
├── unsplash.client.ts       # Static HTTP client with 15s timeout
├── unsplash.mapper.ts       # Raw JSON to ExternalImageAsset mapper
├── unsplash.provider.ts     # ExternalImageProvider implementation
└── tests/
    └── unsplash-integration.test.ts # Unit test suite
```
