export type JobStatus = 'queued' | 'running' | 'retrying' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  name: string;
  payload: any;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  error?: string;
  result?: any;
  createdAt: string;
  updatedAt: string;
}

export class JobQueue {
  private static queue: Job[] = [];

  static addJob(name: string, payload: any, maxAttempts = 3): Job {
    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      payload,
      status: 'queued',
      attempts: 0,
      maxAttempts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.queue.push(job);
    return job;
  }

  static getJob(id: string): Job | undefined {
    return this.queue.find((j) => j.id === id);
  }

  static listJobs(): Job[] {
    return [...this.queue];
  }
}
