export class RetryPolicy {
  static shouldRetry(attempts: number, maxAttempts: number): boolean {
    return attempts < maxAttempts;
  }

  static async delay(attempt: number): Promise<void> {
    const ms = Math.min(100 * Math.pow(2, attempt), 2000);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
