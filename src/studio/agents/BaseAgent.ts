export interface AgentContext {
  topic: string;
  goal: string;
  audience: string;
  tone: string;
  platforms: string[];
  payload?: any;
}

export abstract class BaseAgent {
  abstract name: string;
  abstract description: string;

  async initialize(): Promise<void> {}
  abstract execute(context: AgentContext): Promise<any>;
  async validate(output: any): Promise<boolean> {
    return output !== null && output !== undefined;
  }
  async cleanup(): Promise<void> {}
}
