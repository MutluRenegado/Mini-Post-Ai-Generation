# 🚀 Firebase Deployment Architecture & Protocol

This document defines the architecture and deployment protocol for **Firebase Hosting**, **Firebase Cloud Functions (v2)**, and **Firebase Secret Manager**.

---

## 🏛️ 1. Architecture Boundaries & Responsibilities

| Responsibility Area | 🐙 GitHub (Source Control & CI/CD) | 🔥 Firebase (Hosting & Cloud Functions) |
| :--- | :--- | :--- |
| **Primary Role** | Single Source of Truth for Source Code, Branching & Versioning | Production Hosting, Cloud Functions (v2), Firestore & Secret Manager |
| **Included / Allowed** | • Source Code (`/src`, pages, components, styling)<br>• Firebase Functions (`/functions/src`) <br>• Config (`firebase.json`, `.firebaserc`, `apphosting.yaml`) | • Global CDN Hosting<br>• Cloud Functions v2 Runtimes<br>• Realtime Database & Firestore Security Rules |
| **Strictly Excluded** | 🛑 Environment secrets (`.env`, `.env.local`)<br>🛑 API Keys / Service Account Credentials<br>🛑 Dependency directories (`node_modules`) | 🛑 Unversioned custom code modified outside Git workflows |

---

## 🔒 2. Secrets & Environment Variable Policy

- **Local Development:** Managed via `.env.local` (MUST be listed in `.gitignore`). Never commit `.env*` containing actual secrets.
- **Production Runtimes (Firebase Cloud Functions v2):** Configured via **Firebase Secret Manager**:
  ```bash
  firebase functions:secrets:set GEMINI_API_KEY
  firebase functions:secrets:set POST_PROXY_MEGA_API_KEY
  ```

---

## ✅ 3. Pre-Flight Deployment Checklist

### Pre-Commit Checks
- [ ] **No Secrets Exposed:** Ensure `.env.local` or sensitive keys are NOT staged (`git status`).
- [ ] **Clean Build Test:** Local build passes without error (`npm run build` and `cd functions && npm run build`).

### Pre-Deploy Checks (Firebase Boundary)
- [ ] **Target Selection:** Project target set via `firebase use minipostapp`.
- [ ] **Deploy Commands:**
  - Full Deploy: `npm run deploy` (`firebase deploy`)
  - Hosting Only: `npm run deploy:hosting`
  - Functions Only: `npm run deploy:functions`

