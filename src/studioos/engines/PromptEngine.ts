import { PromptOrchestrator } from '@/lib/ai-text-editor/orchestrator/PromptOrchestrator';

export class StudioPromptEngine {
  static async orchestrate(
    payload: any,
    caller?: (prompt: string, systemPrompt?: string) => Promise<string>
  ) {
    const defaultCaller = caller || (async (p: string) => JSON.stringify({ masterPost: p, status: 'generated' }));
    return await PromptOrchestrator.orchestrate(payload, defaultCaller);
  }
}



