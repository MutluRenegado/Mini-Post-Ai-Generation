# Provider Registry — Mini Post App

Status: **Verified Master Inventory**  
Scope: Master Registry of External Stock Image Providers.

---

## Registered Provider Matrix

| Provider ID | Provider Name | Runtime Directory | Secret Variable Name | Secret Manager Name | Module Status | UI Connection Status | Documentation Path |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PEXELS` | Pexels Stock Photos | `src/providers/pexels/` | `PEXELS_API_KEY` | `PEXELS_API_KEY` | `Implemented` | `Partial` / `Orphaned` | [Pexels Documentation](./Pexels/README.md) |
| `PIXABAY` | Pixabay Community Media | `src/providers/pixabay/` | `PIXABAY_API_KEY` | `PIXABAY_API_KEY` | `Planned` | `Planned` | [Pixabay Documentation](./Pixabay/README.md) |
| `UNSPLASH` | Unsplash High-Res Photos | `src/providers/unsplash/` | `UNSPLASH_ACCESS_KEY` | `UNSPLASH_ACCESS_KEY` | `Partial` / `Planned` | `Planned` | [Unsplash Documentation](./Unsplash/README.md) |

---

## Implementation Details & Notes

### 1. Pexels (`PEXELS`)
- **Runtime Path**: [src/providers/pexels/](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/)
- **Binding**: Registered in `apphosting.yaml`. Loaded via `process.env.PEXELS_API_KEY`.
- **Status**: Backend module is fully implemented with unit tests (`src/providers/pexels/tests/pexels-integration.test.ts`). API routes exist under `/api/admin/pexels/*`. UI wiring into the main Image Creator flow is `Partial` / `Orphaned`.

### 2. Pixabay (`PIXABAY`)
- **Runtime Path**: `src/providers/pixabay/` (Planned)
- **Binding**: Planned secret `PIXABAY_API_KEY`.
- **Status**: `Planned`. No runtime code exists in `src/providers/pixabay/`. API requirements (query limit: 100 chars, 24h cache rule, storage requirements) fully documented.

### 3. Unsplash (`UNSPLASH`)
- **Runtime Path**: `src/providers/unsplash/` (Planned)
- **Binding**: Planned secret `UNSPLASH_ACCESS_KEY`.
- **Status**: `Partial` / `Planned`. `LiveImageProviderAdapter` has partial fallback concepts, but dedicated isolated provider module is planned. Mandatory download tracking requirement documented in [Download-Tracking.md](./Unsplash/Download-Tracking.md).
