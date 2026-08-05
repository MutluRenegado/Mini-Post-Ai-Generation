import type { UnsplashRateLimitInfo } from './unsplash.types';

export class UnsplashRateLimitTracker {
  private static currentInfo: UnsplashRateLimitInfo = {
    limit: 50,
    remaining: 50,
    reset: 0,
  };

  static updateFromHeaders(headers: Headers): void {
    const limitHeader = headers.get('X-Ratelimit-Limit') || headers.get('X-RateLimit-Limit');
    const remainingHeader = headers.get('X-Ratelimit-Remaining') || headers.get('X-RateLimit-Remaining');

    if (limitHeader) this.currentInfo.limit = parseInt(limitHeader, 10);
    if (remainingHeader) this.currentInfo.remaining = parseInt(remainingHeader, 10);
  }

  static getStatus(): UnsplashRateLimitInfo {
    return { ...this.currentInfo };
  }

  static isExhausted(): boolean {
    return this.currentInfo.remaining <= 0;
  }

  static resetMockStatus(): void {
    this.currentInfo = { limit: 50, remaining: 50, reset: 0 };
  }
}
