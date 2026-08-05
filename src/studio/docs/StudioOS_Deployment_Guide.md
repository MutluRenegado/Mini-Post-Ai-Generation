# StudioOS Version 4.0 — Production Deployment Guide

## 1. Containerized Docker Deployment

### Building the Docker Image
```bash
docker build -t studio-os:4.0-rc1 .
```

### Running with Docker Compose
```bash
docker-compose up -d
```

---

## 2. Health & Readiness Probes

- **Liveness Probe**: `GET http://localhost:3000/api/health`
- **Readiness Probe**: `GET http://localhost:3000/api/health`

### Health Response Schema (200 OK)
```json
{
  "status": "OPERATIONAL",
  "version": "4.0.0-RC1",
  "environment": "production",
  "circuitBreaker": "CLOSED",
  "providers": {
    "gemini": "HEALTHY",
    "openai": "STANDBY",
    "claude": "STANDBY"
  },
  "analytics": {
    "totalGenerations": 1248,
    "avgScore": 96,
    "avgLatencyMs": 1240
  },
  "timestamp": "2026-07-31T14:26:00Z"
}
```

---

## 3. Environment Variables Configuration

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Port to bind application |
| `MAX_RETRIES` | `2` | Max automatic retry attempts |
| `QUALITY_THRESHOLD` | `92` | Min quality score required |
