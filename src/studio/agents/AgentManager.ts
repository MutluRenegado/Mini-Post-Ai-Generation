import { BaseAgent } from './BaseAgent';
import { TopicAgent } from './TopicAgent';
import { ResearchAgent } from './ResearchAgent';
import { KnowledgeAgent } from './KnowledgeAgent';
import { WriterAgent } from './WriterAgent';
import { ImageAgent } from './ImageAgent';
import { SEOAgent } from './SEOAgent';
import { QualityAgent } from './QualityAgent';
import { BrandAgent } from './BrandAgent';
import { ExportAgent } from './ExportAgent';

export class AgentManager {
  private static agents: Map<string, BaseAgent> = new Map();

  static initializeDefaults(): void {
    const defaultAgents: BaseAgent[] = [
      new TopicAgent(),
      new ResearchAgent(),
      new KnowledgeAgent(),
      new WriterAgent(),
      new ImageAgent(),
      new SEOAgent(),
      new QualityAgent(),
      new BrandAgent(),
      new ExportAgent(),
    ];
    for (const a of defaultAgents) {
      this.agents.set(a.name, a);
    }
  }

  static getAgent(name: string): BaseAgent | undefined {
    if (this.agents.size === 0) this.initializeDefaults();
    return this.agents.get(name);
  }

  static registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.name, agent);
  }

  static listAgents(): string[] {
    if (this.agents.size === 0) this.initializeDefaults();
    return Array.from(this.agents.keys());
  }
}
