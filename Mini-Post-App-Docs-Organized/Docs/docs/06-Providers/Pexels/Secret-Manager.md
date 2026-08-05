# Pexels Secret Manager — Mini Post App

Status: **Verified Secret Manager Integration**

---

## 1. Secret Manager Binding Details

- **Secret Manager Secret Name**: `PEXELS_API_KEY`
- **Environment Mapping**: `PEXELS_API_KEY`
- **Access Level**: Server-side container runtime only.
- **Rotation Procedure**: Add new secret version in Google Cloud Secret Manager -> re-trigger Firebase App Hosting build -> verify status via `/api/admin/pexels/status`.
