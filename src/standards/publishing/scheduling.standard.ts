/**
 * Mini Post App - Publishing Scheduling Standard
 * Informed by Google Cloud Well-Architected Framework (Reliability & Queueing Patterns).
 */

export interface SchedulingStandardSpec {
  maxAdvanceScheduleDays: number;
  minAdvanceScheduleMinutes: number;
  retryAttempts: number;
  backoffFactor: number;
  frameworkAlignment: {
    googleCloudWellArchitected: {
      resiliencyPattern: string;
    };
  };
}

export const SchedulingStandard: SchedulingStandardSpec = {
  maxAdvanceScheduleDays: 365,
  minAdvanceScheduleMinutes: 10,
  retryAttempts: 3,
  backoffFactor: 2,
  frameworkAlignment: {
    googleCloudWellArchitected: {
      resiliencyPattern: 'Exponential backoff with jitter for transient API failure retries',
    },
  },
};
