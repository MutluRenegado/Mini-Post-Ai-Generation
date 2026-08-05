# Pixabay Configuration — Mini Post App

Status: **Planned Configuration**

---

## Environment Variable Setup

- **Variable Name**: `PIXABAY_API_KEY`
- **Scope**: Server-Side Runtime Only
- **Planned App Hosting Binding**:
  ```yaml
  env:
    - variable: PIXABAY_API_KEY
      secret: PIXABAY_API_KEY
  ```
- **Local Dev Setup**: Set `PIXABAY_API_KEY=your_key_here` in `.env.local`.
