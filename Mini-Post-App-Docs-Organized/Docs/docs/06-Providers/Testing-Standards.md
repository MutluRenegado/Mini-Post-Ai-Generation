# Testing Standards — Mini Post App

Status: **Verified Quality Assurance Standard**  
Test Suite Reference: [src/providers/pexels/tests/pexels-integration.test.ts](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/providers/pexels/tests/pexels-integration.test.ts)

---

## 1. Unit Testing Mandates

All stock photo provider modules MUST include an isolated unit test suite under `src/providers/<provider>/tests/`. Test suites run using Node's native test runner (`node:test`) and assertion library (`node:assert`).

---

## 2. Mandatory Test Cases

Every provider test suite MUST implement the following 7 standard test assertions:

1. **Configuration Error Assertion**: Verify that invoking provider methods when the secret key environment variable is undefined throws a configuration error (e.g. `PexelsConfigurationError`).
2. **Server-Side Secret Isolation Assertion**: Verify that `NEXT_PUBLIC_<PROVIDER>_API_KEY` is `undefined`.
3. **Data Normalization Assertion**: Verify that raw native JSON responses correctly map into `ExternalImageAsset` attributes (ID, provider ID, dimensions, photographer name, attribution string).
4. **Rate Limit Parsing Assertion**: Verify that HTTP rate limit headers (e.g. `X-Ratelimit-Limit`, `X-Ratelimit-Remaining`) update the in-memory rate limit tracker correctly.
5. **Rate Limit Exhaustion Assertion**: Verify that when `remaining <= 0` and reset time is in the future, the provider immediately halts outbound requests and throws a rate limit error.
6. **Provider Identification Assertion**: Verify that `provider.providerId` matches the expected uppercase provider code (e.g. `'PEXELS'`, `'PIXABAY'`, `'UNSPLASH'`).
7. **Secret Key Redaction Assertion**: Verify that serializing normalized `ExternalImageAsset` objects into JSON strings DOES NOT contain the raw secret key string.

---

## 3. Mocking & Zero External Network Policy

Unit test suites MUST NOT execute real live HTTP calls to external provider APIs in standard automated CI environments. HTTP responses MUST be mocked or stubbed using native request mocks to guarantee deterministic, fast test execution.
