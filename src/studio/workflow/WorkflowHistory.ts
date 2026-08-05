import { WorkflowDefinition } from './WorkflowDefinition';

export interface WorkflowExecutionRecord {
  executionId: string;
  workflowId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  logs: string[];
}

export class WorkflowHistory {
  private static history: WorkflowExecutionRecord[] = [];

  static record(execution: WorkflowExecutionRecord): void {
    this.history.push(execution);
  }

  static getHistory(): WorkflowExecutionRecord[] {
    return [...this.history];
  }
}
