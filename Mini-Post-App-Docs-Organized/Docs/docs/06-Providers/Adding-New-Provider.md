# Adding a New Provider — Step-by-Step Developer Guide

Status: **Verified Operational Guide**  
Scope: Step-by-step tutorial for integrating a new stock image provider.

---

## Step-by-Step Integration Workflow

Follow this systematic 10-step guide to add a new stock photo provider (e.g. Adobe Stock, Getty Images, Freepik) to Mini Post App:

```
Step 1: Create isolated directory: src/providers/<provider-id>/
Step 2: Create custom error domain: <provider>.errors.ts
Step 3: Define native request & response interfaces: <provider>.types.ts
Step 4: Implement rate-limit tracker: <provider>.rate-limit.ts
Step 5: Implement HTTP client with timeout & key loading: <provider>.client.ts
Step 6: Implement data mapper to ExternalImageAsset: <provider>.mapper.ts
Step 7: Implement ExternalImageProvider class: <provider>.provider.ts
Step 8: Bind secret in apphosting.yaml & process.env.<PROVIDER>_API_KEY
Step 9: Write isolated integration unit tests: src/providers/<provider>/tests/
Step 10: Populate documentation package under docs/Providers/<ProviderName>/
```

### Detailed Implementation Checklist
- [ ] Module directory created under `src/providers/<provider-id>/`
- [ ] Provider implements `ExternalImageProvider` interface
- [ ] Secret variable bound in Secret Manager (`apphosting.yaml`)
- [ ] Server-only key validation enforced (no `NEXT_PUBLIC_` keys)
- [ ] 15-second timeout enforced via `AbortController`
- [ ] In-memory rate-limit header parsing implemented
- [ ] Native payload transformed to `ExternalImageAsset` without key exposure
- [ ] Photographer and source asset links preserved in attribution fields
- [ ] 7 standard unit test assertions passing with `node:test`
- [ ] Master registry updated in [Provider-Registry.md](./Provider-Registry.md)
- [ ] Documentation files populated under `docs/Providers/<ProviderName>/`
- [ ] Stop for review approval prior to initiating any UI wiring phase
