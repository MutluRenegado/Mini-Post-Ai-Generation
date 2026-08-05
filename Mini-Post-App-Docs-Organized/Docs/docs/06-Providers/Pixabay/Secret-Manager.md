# Pixabay Secret Manager — Mini Post App

Status: **Planned Secret Binding**

---

## Secret Binding Specifications

- **Secret Manager Name**: `PIXABAY_API_KEY`
- **Environment Variable**: `PIXABAY_API_KEY`
- **Access Level**: Server-side container runtime only.
- **Rotation Requirements**: Update Secret Manager version -> re-deploy App Hosting container -> verify zero key exposure.
