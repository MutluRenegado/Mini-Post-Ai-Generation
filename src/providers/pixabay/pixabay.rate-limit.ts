import type { PixabayRateLimitInfo } from './pixabay.types';

export class PixabayRateLimitTracker {
  private static currentInfo: PixabayRateLimitInfo = {
    limit: 5000,
    remaining: 5000,
    reset: 0,
  };

  static updateFromHeaders(headers: Headers): void {
    const limitHeader = headers.get('X-RateLimit-Limit') || headers.get('X-Ratelimit-Limit');
    const remainingHeader = headers.get('X-RateLimit-Remaining') || headers.get('X-Ratelimit-Remaining');
    const resetHeader = headers.get('X-RateLimit-Reset') || headers.get('X-Ratelimit-Reset');

    if (limitHeader) this.currentInfo.limit = parseInt(limitHeader, 10);
    if (remainingHeader) this.currentInfo.remaining = parseInt(remainingHeader, 10);
    if (resetHeader) this.currentInfo.reset = parseInt(resetHeader, 10);
  }

  static getStatus(): PixabayRateLimitInfo {
    return { ...this.currentInfo };
  }

  static isExhausted(): boolean {
    return this.currentInfo.remaining <= 0 && Date.now() < this.currentInfo.reset * 1000;
  }

  static resetMockStatus(): void {
    this.currentInfo = { limit: 5000, remaining: 5000, reset: 0 };
  }
}
