export class CircuitBreaker {
  private static failureCount = 0;
  private static threshold = 5;
  private static isOpen = false;
  private static resetTimeout = 30000;
  private static lastFailureTime = 0;

  static recordSuccess(): void {
    this.failureCount = 0;
    this.isOpen = false;
  }

  static recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.isOpen = true;
    }
  }

  static canExecute(): boolean {
    if (!this.isOpen) return true;
    if (Date.now() - this.lastFailureTime > this.resetTimeout) {
      this.isOpen = false;
      this.failureCount = 0;
      return true;
    }
    return false;
  }

  static getStatus(): 'CLOSED' | 'OPEN' {
    return this.canExecute() ? 'CLOSED' : 'OPEN';
  }
}
