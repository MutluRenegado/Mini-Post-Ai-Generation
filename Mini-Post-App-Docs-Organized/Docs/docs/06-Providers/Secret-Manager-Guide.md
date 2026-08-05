# Secret Manager Guide — Mini Post App

Status: **Verified Security Policy**  
Configuration Reference: [apphosting.yaml](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/apphosting.yaml)

---

## 1. Secret Governance Mandates

1. **Server-Side Access Only**: API secrets MUST be read via `process.env.<PROVIDER>_API_KEY` inside Next.js API routes, Server Actions, or server modules.
2. **Prohibition of Client Secrets**: Provider secrets MUST NEVER be prefixed with `NEXT_PUBLIC_`.
3. **No Hardcoded Credentials**: Source code repositories MUST contain ZERO plain-text API keys, bearer tokens, or access credentials.
4. **Redaction in Logs & Exceptions**: Error logs, stack traces, and API responses returned to the browser MUST sanitize and redact API credentials.

---

## 2. Firebase App Hosting Secret Binding Pattern

In production deployments, secrets are stored in Google Cloud Secret Manager and bound into environment variables via `apphosting.yaml`:

```yaml
# apphosting.yaml
env:
  - variable: PEXELS_API_KEY
    secret: PEXELS_API_KEY
  # Planned secret bindings:
  # - variable: PIXABAY_API_KEY
  #   secret: PIXABAY_API_KEY
  # - variable: UNSPLASH_ACCESS_KEY
  #   secret: UNSPLASH_ACCESS_KEY
```

---

## 3. Local Development Configuration

For local testing, secrets are stored in `.env.local` (which is excluded from Git tracking via `.gitignore`):

```bash
# .env.local (Server-only)
PEXELS_API_KEY=your_pexels_secret_key_here
# PIXABAY_API_KEY=your_pixabay_secret_key_here
# UNSPLASH_ACCESS_KEY=your_unsplash_secret_key_here
```

---

## 4. Secret Rotation Procedure

1. Generate a new API key in the provider developer console.
2. Add a new version of the secret in Google Cloud Secret Manager.
3. Update `.env.local` for local development environments.
4. Deploy the updated build to trigger App Hosting key re-binding.
5. Disable/Revoke the old API key in the provider console once zero traffic uses the previous key version.
