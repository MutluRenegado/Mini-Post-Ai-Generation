export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'skipped';

export interface WorkflowStep {
  id: string;
  name: string;
  agentName: string;
  dependsOn?: string[];
  status: WorkflowStepStatus;
  output?: any;
  error?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'draft' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
