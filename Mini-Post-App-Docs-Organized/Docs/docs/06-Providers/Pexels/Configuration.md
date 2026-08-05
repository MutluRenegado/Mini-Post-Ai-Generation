# Pexels Configuration — Mini Post App

Status: **Verified Configuration**  
File Reference: [apphosting.yaml](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/apphosting.yaml)

---

## 1. Environment Variable Specification

- **Variable Name**: `PEXELS_API_KEY`
- **Scope**: Server-Side Runtime Only
- **Secret Binding**: Bound in `apphosting.yaml`:
  ```yaml
  env:
    - variable: PEXELS_API_KEY
      secret: PEXELS_API_KEY
  ```

---

## 2. Local Environment Setup

In local development, set the key in `.env.local`:
```bash
PEXELS_API_KEY=your_pexels_api_key_here
```
Note: Do not commit `.env.local` to source control.
