# Mini Post App — Stock Image Provider Documentation System

Welcome to the centralized documentation hub for external stock image provider integrations in **Mini Post App**.

> [!IMPORTANT]
> **Documentation Governance Policy**
> - **Writable Boundary**: `docs/Providers/` is the sole authorized writable directory for provider documentation.
> - **Protected Directories**: `src/`, `apphosting.yaml`, package manifests, API routes, provider tests, and all documentation outside `docs/Providers/` are strictly read-only during documentation consolidation tasks.
> - **No Runtime Modifications**: This documentation system describes current system behavior and planned standards. It contains zero runtime execution code.

---

## 1. Overview & Architecture Purpose

Mini Post App integrates with external stock photo platforms to empower users with high-quality imagery during post creation and media library management. To maintain architectural purity, system reliability, and legal compliance, all provider integrations follow strict modular isolation standards defined under [Provider-Architecture-Standard.md](./Provider-Architecture-Standard.md).

Each provider implementation is decoupled from the core application logic via the provider-neutral `ExternalImageProvider` interface (`src/providers/external-image-provider.interface.ts`).

---

## 2. Provider Ecosystem Status Matrix

| Provider | Implementation Status | Secret Binding | UI Integration Status | Key Documentation |
| :--- | :--- | :--- | :--- | :--- |
| **Pexels** | `Implemented` | `PEXELS_API_KEY` (Bound) | `Partial` / `Orphaned` | [Pexels Documentation](./Pexels/README.md) |
| **Pixabay** | `Planned` | `PIXABAY_API_KEY` (Planned) | `Planned` | [Pixabay Documentation](./Pixabay/README.md) |
| **Unsplash** | `Partial` / `Planned` | `UNSPLASH_ACCESS_KEY` (Planned) | `Planned` | [Unsplash Documentation](./Unsplash/README.md) |

### Status Legend
- **Verified**: Confirmed complete and active by empirical runtime tests and code inspection.
- **Implemented**: Source code module exists under `src/providers/` and passes isolated unit tests.
- **Connected**: Fully wired into production UI components and end-to-end API workflows.
- **Partial**: Component or service exists but has incomplete features or limited integration.
- **Orphaned**: Module is fully implemented and tested in backend code but disconnected from user UI flow.
- **Planned**: Target integration designed and documented as a standard, but runtime code is not yet written.
- **Blocked**: Integration delayed due to external API limitations, licensing conflicts, or missing secrets.
- **Pending Verification**: Code exists but requires runtime test validation before confirmation.

---

## 3. Shared Provider Standards

The root of `docs/Providers/` contains shared, provider-neutral architecture specifications:

- [Provider-Architecture-Standard.md](./Provider-Architecture-Standard.md) — Modular isolation, single-responsibility, and zero cross-provider imports.
- [Provider-Development-Guide.md](./Provider-Development-Guide.md) — Step-by-step 14-phase lifecycle for onboarding image providers.
- [Provider-Checklist.md](./Provider-Checklist.md) — Mandatory 14-point audit checklist for provider integration reviews.
- [Provider-Registry.md](./Provider-Registry.md) — Master inventory of registered providers, secret names, and runtime paths.
- [Provider-Router.md](./Provider-Router.md) — Server-side provider selection, failover routing, and error normalization.
- [Canonical-Image-Model.md](./Canonical-Image-Model.md) — The standard normalized `ExternalImageAsset` data model.
- [Secret-Manager-Guide.md](./Secret-Manager-Guide.md) — Server-only secret access, App Hosting binding, and security redaction.
- [Security-Requirements.md](./Security-Requirements.md) — SSRF prevention, input validation, rate limits, and key leak protection.
- [Licensing-Compliance.md](./Licensing-Compliance.md) — Stock photo legal compliance, hotlinking rules, and storage policies.
- [Attribution-Rules.md](./Attribution-Rules.md) — Photographer credit, source URL, and metadata retention standards.
- [Testing-Standards.md](./Testing-Standards.md) — Unit testing, mock expectations, and zero network dependency standards.
- [Adding-New-Provider.md](./Adding-New-Provider.md) — Complete tutorial for introducing new stock image providers.

---

## 4. Provider-Specific Documentation Folders

Each provider maintains an isolated documentation directory containing 21 to 22 standardized specifications:

- [Pexels Provider Specifications](./Pexels/README.md) — Full documentation of the active Pexels provider module (`src/providers/pexels/`).
- [Pixabay Provider Specifications](./Pixabay/README.md) — Architecture and API requirements for the planned Pixabay integration.
- [Unsplash Provider Specifications](./Unsplash/README.md) — Specifications for Unsplash integration, including mandatory [Download Tracking](./Unsplash/Download-Tracking.md).

---

## 5. Security & Secret Protection Guarantee

No API keys, secret credentials, or access tokens are stored in documentation files. All provider keys are retrieved at runtime server-side via environment variables configured through Secret Manager and Firebase App Hosting (`apphosting.yaml`).
