# Pexels Secret Configuration

- Google Cloud Secret Manager Secret: `PEXELS_API_KEY`
- Environment Variable: `process.env.PEXELS_API_KEY`
- `apphosting.yaml` declaration:
  ```yaml
  - variable: PEXELS_API_KEY
    secret: PEXELS_API_KEY
    availability:
      - RUNTIME
  ```
- **Security**: The secret key is never sent to the browser, URL query parameters, or client-side bundles.
