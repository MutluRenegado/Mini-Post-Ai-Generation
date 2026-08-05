export class UnsplashError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    const sanitizedMessage = UnsplashError.sanitizeMessage(message);
    super(sanitizedMessage);
    this.name = 'UnsplashError';
    this.code = code;
    this.statusCode = statusCode;
  }

  public static sanitizeMessage(msg: string): string {
    if (!msg) return '';
    return msg
      .replace(/Client-ID\s+[a-zA-Z0-9_-]+/gi, 'Client-ID [REDACTED]')
      .replace(/client_id=[a-zA-Z0-9_-]+/gi, 'client_id=[REDACTED]');
  }
}

export class UnsplashConfigurationError extends UnsplashError {
  constructor(message: string = 'UNSPLASH_ACCESS_KEY is missing or undefined in server configuration.') {
    super(message, 'UNSPLASH_CONFIG_MISSING', 500);
    this.name = 'UnsplashConfigurationError';
  }
}

export class UnsplashAuthenticationError extends UnsplashError {
  constructor(message: string = 'Unsplash API authentication failed or Client-ID invalid.') {
    super(message, 'UNSPLASH_AUTH_FAILED', 401);
    this.name = 'UnsplashAuthenticationError';
  }
}

export class UnsplashValidationError extends UnsplashError {
  constructor(message: string = 'Invalid search query or input parameters for Unsplash API.') {
    super(message, 'UNSPLASH_VALIDATION_ERROR', 400);
    this.name = 'UnsplashValidationError';
  }
}

export class UnsplashRateLimitError extends UnsplashError {
  constructor(message: string = 'Unsplash API rate limit exceeded. Please try again later.') {
    super(message, 'UNSPLASH_RATE_LIMIT_EXCEEDED', 429);
    this.name = 'UnsplashRateLimitError';
  }
}

export class UnsplashNotFoundError extends UnsplashError {
  constructor(message: string = 'Requested Unsplash photo asset was not found.') {
    super(message, 'UNSPLASH_NOT_FOUND', 404);
    this.name = 'UnsplashNotFoundError';
  }
}
