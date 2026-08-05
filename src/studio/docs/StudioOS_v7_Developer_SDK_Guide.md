# StudioOS Version 7.0 — Developer SDK & Public API Guide

## Quick Start

### Installation
```bash
npm install @studio-os/sdk
```

### TypeScript SDK Usage Example
```typescript
import { StudioOSDeveloperSDK } from '@studio-os/sdk';

const studio = new StudioOSDeveloperSDK({ apiKey: 'sk_live_...' });

async function main() {
  const result = await studio.generatePost('Customs Clearance Best Practices', ['LinkedIn', 'Twitter']);
  console.log('Quality Score:', result.qualityScore);
  console.log('Generated Output:', result.output);
}

main();
```

### Public API Endpoint
`POST https://api.studio-os.io/v7/posts/generate`
