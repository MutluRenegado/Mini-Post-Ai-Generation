# Technical Subprocessor Audit Report — Mini Post App

Status: **Verified Codebase Audit Report**  
Date: August 3, 2026  
Target Scope: Repository-wide audit of external services, environment bindings, and subprocessor classifications.

---

## 1. Environment Variables & Secret Manager Mapping Matrix

| Variable / Secret Name | Provider / Entity | Source File Location | Runtime Status | Public Directory Category | Disclosure Decision & Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PEXELS_API_KEY` | Pexels GmbH (Canva) | `src/providers/pexels/pexels.client.ts`, `apphosting.yaml` | `Implemented (Backend)` | External Media Providers | **Listed as Implemented**. Server-side stock photo search. |
| `PIXABAY_API_KEY` | Pixabay GmbH (Canva) | `docs/Providers/Pixabay/` | `Planned` | External Media Providers | **Listed as Planned**. Planned stock image search integration. |
| `UNSPLASH_ACCESS_KEY` | Unsplash Inc. (Getty Images) | `docs/Providers/Unsplash/` | `Partial / Planned` | External Media Providers | **Listed as Partial / Planned**. Planned search and download tracking. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google LLC | `src/lib/ai/providers/GeminiProvider.ts`, `apphosting.yaml` | `Active` | AI & Content Processing | **Listed as Active**. Primary AI model execution engine. |
| `GEMINI_API_KEY` | Google LLC | `src/lib/gemini.ts`, `apphosting.yaml` | `Active` | AI & Content Processing | **Listed as Active**. Direct Gemini API endpoint fallback. |
| `POST_PROXY_MEGA_API_KEY` | PostProxy LLC | `functions/src/index.ts`, `src/lib/postproxy.ts` | `Active` | Social Publishing | **Listed as Active**. Multi-platform social publishing proxy gateway. |
| `POST_PROXY_MASTER_API_KEY` | PostProxy LLC | `functions/src/services/secrets.ts` | `Active` | Social Publishing | **Listed as Active**. Master key fallback for social API routes. |
| `POST_PROXY_DEFAULT_API_KEY` | PostProxy LLC | `functions/src/services/secrets.ts` | `Active` | Social Publishing | **Listed as Active**. Default key fallback for social API routes. |
| `POSTPROXY_WEBHOOK_SECRET` | PostProxy LLC | `src/app/api/social/webhook/route.ts` | `Active` | Social Publishing | **Listed as Active**. Webhook payload signature verification. |
| `STRIPE_SECRET_KEY` | Stripe, Inc. | `src/lib/services/stripeWebhookListener.ts` | `Active` | Payments | **Listed as Active**. Stripe payment checkout and subscription webhooks. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Google LLC | `apphosting.yaml` | `Active` | Infrastructure & Hosting | **Listed as Active**. Firebase public web client initialization. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Google LLC | `apphosting.yaml` | `Active` | Infrastructure & Hosting | **Listed as Active**. Firebase project context binding (`echosofwandering`). |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Google LLC | `apphosting.yaml` | `Active` | Infrastructure & Hosting | **Listed as Active**. Realtime Database endpoint (`europe-west1`). |

---

## 2. Verified Subprocessor Classification Table

| Provider Name | Legal Operating Entity | Role / Service | Processing Region | Verification Status | Public Listing Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Cloud Platform / Firebase** | Google LLC / Google Ireland Ltd | Hosting, Database, Storage, Auth, Secrets | USA / EU (`europe-west1`) | `Verified Active` | **Active Subprocessor** (Infrastructure & Hosting) |
| **Stripe, Inc.** | Stripe, Inc. / Stripe Payments Europe | Payment Processing & Billing | USA / EU | `Verified Active` | **Payment Processor** (Payments) |
| **Google Gemini AI** | Google LLC | AI Text Generation & Adaptation | USA / Global | `Verified Active` | **Active Subprocessor** (AI & Content Processing) |
| **Pollinations.ai** | Pollinations.ai | Fallback AI Image Rendering & Text | Distributed | `Verified Active (Fallback)` | **Active Subprocessor (Fallback)** (AI & Content Processing) |
| **Post Proxy** | PostProxy LLC | Social OAuth & Publishing Gateway | USA / Global | `Verified Active` | **Active Subprocessor** (Social Publishing) |
| **Pexels** | Pexels GmbH / Canva | Stock Photo Search & Import | Global | `Implemented (Backend)` | **Content Provider** (External Media Providers - Implemented) |
| **Pixabay** | Pixabay GmbH / Canva | Stock Media & Illustration Search | Global | `Planned` | **Content Provider** (External Media Providers - Planned) |
| **Unsplash** | Unsplash Inc. / Getty Images | High-Res Photo Search & Tracking | Global | `Partial / Planned` | **Content Provider** (External Media Providers - Partial / Planned) |
| **Meta (FB, IG, Threads)** | Meta Platforms, Inc. | Social Publishing & Engagement | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **LinkedIn** | LinkedIn Corp. / Microsoft | Social Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **X (Twitter)** | X Corp. | Social Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **TikTok** | TikTok Inc. / ByteDance | Video Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **YouTube** | Google LLC / Alphabet Inc. | Video Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **Telegram** | Telegram Group Inc. | Channel Messaging | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **Bluesky** | Bluesky Social, PBC | Decentralized Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **Pinterest** | Pinterest, Inc. | Visual Board Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **Google Business Profile** | Google LLC | Business Local Publishing | Global | `Verified Active (OAuth)` | **Independent Platform** |
| **Vercel Inc.** | Vercel Inc. | Application Web Hosting | N/A | `Not Used` / `Deprecated` | **Removed from Active List** (App hosted on Firebase App Hosting) |
