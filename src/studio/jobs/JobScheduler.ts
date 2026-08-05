import { JobQueue, Job } from './JobQueue';
import { RetryPolicy } from './RetryPolicy';

export class JobScheduler {
  static async processJob(job: Job, handler: (payload: any) => Promise<any>): Promise<Job> {
    job.status = 'running';
    job.attempts++;
    job.updatedAt = new Date().toISOString();

    try {
      job.result = await handler(job.payload);
      job.status = 'completed';
    } catch (err: any) {
      job.error = err?.message || 'Execution error';
      if (RetryPolicy.shouldRetry(job.attempts, job.maxAttempts)) {
        job.status = 'retrying';
        // Exponential backoff retry
        await RetryPolicy.delay(job.attempts);
        return this.processJob(job, handler);
      } else {
        job.status = 'failed';
      }
    }

    job.updatedAt = new Date().toISOString();
    return job;
  }
}
