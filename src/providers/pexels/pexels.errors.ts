export class PexelsError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = 'PexelsError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class PexelsConfigurationError extends PexelsError {
  constructor(message: string = 'PEXELS_API_KEY is missing or invalid in server configuration.') {
    super(message, 'PEXELS_CONFIG_MISSING', 500);
    this.name = 'PexelsConfigurationError';
  }
}

export class PexelsAuthenticationError extends PexelsError {
  constructor(message: string = 'Pexels API authentication failed.') {
    super(message, 'PEXELS_AUTH_FAILED', 401);
    this.name = 'PexelsAuthenticationError';
  }
}

export class PexelsRateLimitError extends PexelsError {
  public readonly resetTimeMs?: number;

  constructor(message: string = 'Pexels API rate limit exceeded.', resetTimeMs?: number) {
    super(message, 'PEXELS_RATE_LIMIT_EXCEEDED', 429);
    this.name = 'PexelsRateLimitError';
    this.resetTimeMs = resetTimeMs;
  }
}

export class PexelsNotFoundError extends PexelsError {
  constructor(message: string = 'Requested Pexels photo or collection was not found.') {
    super(message, 'PEXELS_NOT_FOUND', 404);
    this.name = 'PexelsNotFoundError';
  }
}
