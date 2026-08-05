# Provider Checklist — Mini Post App

Status: **Verified Audit Standard**  
Scope: Quality Assurance Audit Checklist for Provider Onboarding & Reviews.

---

## Practical 14-Point Quality Assurance Checklist

Every provider integration MUST pass all 14 checklist items before sign-off:

| # | Audit Area | Criteria | Status Verification Method |
| :--- | :--- | :--- | :--- |
| **1** | **Module Isolation** | Provider resides in isolated `src/providers/<provider>/` with zero imports from other providers. | Code inspection of import statements |
| **2** | **Server-Only Auth** | Key read via `process.env.<PROVIDER>_API_KEY`. No `NEXT_PUBLIC_` prefix. Zero key in client bundle. | Secret leak test & bundle scan |
| **3** | **Secret Binding** | Secret registered in Secret Manager and `apphosting.yaml`. | YAML inspection |
| **4** | **Timeout Enforcement** | HTTP requests enforce 15-second cap via `AbortController`. | Code inspection of client methods |
| **5** | **Rate Limit Tracking** | Client parses HTTP rate limit headers and tracks remaining quota in-memory. | Header unit tests |
| **6** | **Normalized Mapping** | Raw JSON correctly mapped into standard `ExternalImageAsset` fields without data loss. | Mapper unit tests |
| **7** | **Attribution Integrity** | Photographer name, profile URL, provider name, and source asset URL preserved. | Mapping assertions |
| **8** | **Legal Licensing** | Terms of service compliance verified (hotlinking restrictions, download tracking rules documented). | Compliance document review |
| **9** | **Error Sanitization** | Exceptions throw custom domain errors without leaking secrets or raw stack traces. | Error handling unit tests |
| **10** | **SSRF Prevention** | Client strictly queries whitelisted provider domain over HTTPS. | URL constructor inspection |
| **11** | **Unit Test Coverage** | Isolated unit test suite passes cleanly with 100% test pass rate. | Test runner log execution |
| **12** | **Zero Regression** | Existing system and provider test suites pass without failure. | Regression suite execution |
| **13** | **Documentation Hub** | All required documentation files in `docs/Providers/<Provider>/` fully populated. | File existence & size check |
| **14** | **UI Separation** | Provider implementation verified in isolation before UI wiring. | Scope separation audit |
