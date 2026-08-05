import type { PexelsRateLimitInfo } from './pexels.types';

export class PexelsRateLimitTracker {
  private static currentInfo: PexelsRateLimitInfo = {
    limit: 200,
    remaining: 200,
    reset: 0,
  };

  static updateFromHeaders(headers: Headers): void {
    const limitHeader = headers.get('X-Ratelimit-Limit');
    const remainingHeader = headers.get('X-Ratelimit-Remaining');
    const resetHeader = headers.get('X-Ratelimit-Reset');

    if (limitHeader) this.currentInfo.limit = parseInt(limitHeader, 10);
    if (remainingHeader) this.currentInfo.remaining = parseInt(remainingHeader, 10);
    if (resetHeader) this.currentInfo.reset = parseInt(resetHeader, 10);
  }

  static getStatus(): PexelsRateLimitInfo {
    return { ...this.currentInfo };
  }

  static isExhausted(): boolean {
    return this.currentInfo.remaining <= 0 && Date.now() < this.currentInfo.reset * 1000;
  }
}
