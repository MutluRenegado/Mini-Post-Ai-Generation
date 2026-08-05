import { WorkflowDefinition, WorkflowStep } from './WorkflowDefinition';
import { WorkflowHistory } from './WorkflowHistory';

export class WorkflowRunner {
  static async run(
    workflow: WorkflowDefinition,
    stepExecutor: (step: WorkflowStep) => Promise<any>
  ): Promise<WorkflowDefinition> {
    const startTime = Date.now();
    workflow.status = 'running';
    const logs: string[] = [];

    for (const step of workflow.steps) {
      step.status = 'running';
      logs.push(`Starting step: ${step.name} (${step.agentName})`);
      try {
        step.output = await stepExecutor(step);
        step.status = 'completed';
        logs.push(`Completed step: ${step.name}`);
      } catch (err: any) {
        step.status = 'failed';
        step.error = err?.message || 'Step execution failed';
        workflow.status = 'failed';
        logs.push(`Failed step: ${step.name} - ${step.error}`);
        break;
      }
    }

    if (workflow.steps.every((s) => s.status === 'completed')) {
      workflow.status = 'completed';
    }

    workflow.updatedAt = new Date().toISOString();

    WorkflowHistory.record({
      executionId: `exec_${Date.now()}`,
      workflowId: workflow.id,
      status: workflow.status,
      startedAt: new Date(startTime).toISOString(),
      completedAt: workflow.updatedAt,
      durationMs: Date.now() - startTime,
      logs,
    });

    return workflow;
  }
}
