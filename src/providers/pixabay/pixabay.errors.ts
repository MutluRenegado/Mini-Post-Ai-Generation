export class PixabayError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    // Sanitize message to strip any potential raw API keys
    const sanitizedMessage = PixabayError.sanitizeMessage(message);
    super(sanitizedMessage);
    this.name = 'PixabayError';
    this.code = code;
    this.statusCode = statusCode;
  }

  public static sanitizeMessage(msg: string): string {
    if (!msg) return '';
    return msg.replace(/key=[a-zA-Z0-9_-]+/gi, 'key=[REDACTED]');
  }
}

export class PixabayConfigurationError extends PixabayError {
  constructor(message: string = 'PIXABAY_API_KEY is missing or undefined in server configuration.') {
    super(message, 'PIXABAY_CONFIG_MISSING', 500);
    this.name = 'PixabayConfigurationError';
  }
}

export class PixabayAuthenticationError extends PixabayError {
  constructor(message: string = 'Pixabay API authentication failed or key invalid.') {
    super(message, 'PIXABAY_AUTH_FAILED', 401);
    this.name = 'PixabayAuthenticationError';
  }
}

export class PixabayValidationError extends PixabayError {
  constructor(message: string = 'Invalid search query or input parameters for Pixabay API.') {
    super(message, 'PIXABAY_VALIDATION_ERROR', 400);
    this.name = 'PixabayValidationError';
  }
}

export class PixabayRateLimitError extends PixabayError {
  public readonly resetTimeMs?: number;

  constructor(message: string = 'Pixabay API rate limit exceeded. Please try again later.', resetTimeMs?: number) {
    super(message, 'PIXABAY_RATE_LIMIT_EXCEEDED', 429);
    this.name = 'PixabayRateLimitError';
    this.resetTimeMs = resetTimeMs;
  }
}

export class PixabayNotFoundError extends PixabayError {
  constructor(message: string = 'Requested Pixabay photo asset was not found.') {
    super(message, 'PIXABAY_NOT_FOUND', 404);
    this.name = 'PixabayNotFoundError';
  }
}
