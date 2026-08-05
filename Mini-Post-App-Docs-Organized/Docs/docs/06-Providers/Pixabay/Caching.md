# Pixabay Caching Specification — Mini Post App

Status: **Mandatory Planned Requirement**

---

## 24-Hour Cache Governance Rule

> [!IMPORTANT]
> **Mandatory API Terms Compliance**
> Per Pixabay API Terms of Service, search API responses and image metadata MUST be cached locally/in-memory for at least **24 hours**.

- **Cache TTL**: Minimum 86,400 seconds (24 hours).
- **Cache Strategy**: Store search query hashes and JSON payloads in server cache or Redis store to prevent redundant upstream requests.
