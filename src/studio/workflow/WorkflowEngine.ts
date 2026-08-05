import { WorkflowDefinition, WorkflowStep } from './WorkflowDefinition';
import { WorkflowRunner } from './WorkflowRunner';

export class WorkflowEngine {
  private static workflows: Map<string, WorkflowDefinition> = new Map();

  static createDefaultPostWorkflow(topic: string): WorkflowDefinition {
    const id = `wf_${Date.now()}`;
    return {
      id,
      name: `Post Generation: ${topic.slice(0, 30)}`,
      description: 'Full StudioOS post generation workflow',
      status: 'draft',
      steps: [
        { id: '1', name: 'Topic Analysis', agentName: 'TopicAgent', status: 'pending' },
        { id: '2', name: 'Knowledge Retrieval', agentName: 'ResearchAgent', dependsOn: ['1'], status: 'pending' },
        { id: '3', name: 'Domain Knowledge Build', agentName: 'KnowledgeAgent', dependsOn: ['2'], status: 'pending' },
        { id: '4', name: 'Content Writing', agentName: 'WriterAgent', dependsOn: ['3'], status: 'pending' },
        { id: '5', name: 'Visual Concept', agentName: 'ImageAgent', dependsOn: ['4'], status: 'pending' },
        { id: '6', name: 'SEO Optimization', agentName: 'SEOAgent', dependsOn: ['4'], status: 'pending' },
        { id: '7', name: 'Quality Assurance', agentName: 'QualityAgent', dependsOn: ['5', '6'], status: 'pending' },
        { id: '8', name: 'Brand Compliance', agentName: 'BrandAgent', dependsOn: ['7'], status: 'pending' },
        { id: '9', name: 'Export & Package', agentName: 'ExportAgent', dependsOn: ['8'], status: 'pending' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async executeWorkflow(
    workflow: WorkflowDefinition,
    stepExecutor: (step: WorkflowStep) => Promise<any>
  ): Promise<WorkflowDefinition> {
    this.workflows.set(workflow.id, workflow);
    return await WorkflowRunner.run(workflow, stepExecutor);
  }

  static getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }
}
