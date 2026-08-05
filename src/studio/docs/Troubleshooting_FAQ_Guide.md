# StudioOS Version 5.1 — Operations Troubleshooting & FAQ Guide

## Frequently Asked Questions (FAQ)

### Q1: How does StudioOS handle provider outages?
**Answer**: StudioOS incorporates `AIProviderRouter` and `CircuitBreaker`. If Gemini returns a 503 or times out, the orchestrator automatically attempts a secondary caller or fails over to standby providers without crashing the user's workflow.

### Q2: What happens if a post scores below 92 on the Quality Audit?
**Answer**: The `RegenerationEngine` catches any audit failure and automatically appends prompt advisory modifiers for a second generation attempt before returning the final content.

### Q3: How do I check the system health status in production?
**Answer**: Send a `GET` request to `/api/health`. An operational status returns `200 OK` with metrics for provider health, circuit breaker state, and average generation latencies.
