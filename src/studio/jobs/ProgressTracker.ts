export class ProgressTracker {
  private static progressMap: Map<string, number> = new Map();

  static setProgress(jobId: string, percentage: number): void {
    this.progressMap.set(jobId, Math.min(100, Math.max(0, percentage)));
  }

  static getProgress(jobId: string): number {
    return this.progressMap.get(jobId) || 0;
  }
}
