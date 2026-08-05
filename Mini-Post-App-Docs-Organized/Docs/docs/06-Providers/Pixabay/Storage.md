# Pixabay Storage — Mini Post App

Status: **Mandatory Planned Requirement**

---

## Anti-Hotlinking & Storage Download Rules

> [!WARNING]
> **Permanent Hotlinking Forbidden**
> Direct hotlinking of Pixabay webformat or large image URLs in published posts is prohibited by Pixabay platform terms.

### Mandatory Workflow
1. Pixabay image URLs (`previewURL`, `webformatURL`) may be displayed temporarily during search and preview inside the Image Creator UI.
2. Once a user selects a Pixabay asset for inclusion in a post, the server MUST execute a download of the full-resolution asset to approved local/Firebase storage.
3. Published posts MUST serve the asset exclusively from Mini Post App storage endpoints.
