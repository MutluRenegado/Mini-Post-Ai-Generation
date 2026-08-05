# Pexels Provider Architecture

```
src/providers/
├── external-image-provider.interface.ts
└── pexels/
    ├── index.ts
    ├── pexels.types.ts
    ├── pexels.errors.ts
    ├── pexels.rate-limit.ts
    ├── pexels.client.ts
    ├── pexels.mapper.ts
    ├── pexels.provider.ts
    └── tests/
        └── pexels-integration.test.ts
```

The core Image Library consumes normalized `ExternalImageAsset` records returned by `PexelsProvider`.
