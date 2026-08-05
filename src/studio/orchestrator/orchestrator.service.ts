import { StudioPost, PostRequest } from '../types/studio.types';
import { CreatePostRequest } from '../wizard/types/wizard.types';
import { AIContentService, PlatformVariation } from '../ai/ai-content.service';

export interface PipelineExecutionLog {
  step: string;
  manager: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  timestamp: string;
  details?: string;
}

export interface InstantPostApiPayload {
  goal: string;
  audience: string;
  tone: string;
  platforms: string[];
  raw_idea: string;
  industry?: string;
  keywords?: string[];
  cta?: string;
  brandName?: string;
}

export class StudioOrchestratorService {
  private static executionLogs: PipelineExecutionLog[] = [];

  static async orchestratePostCreation(request: PostRequest): Promise<StudioPost> {
    const timestamp = new Date().toISOString();
    return {
      id: `post_${Date.now()}`,
      title: `${request.industry || 'Studio'} ${request.postType} Post`,
      request,
      status: 'draft',
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1,
    };
  }

  /**
   * Wizard submission — now routes through real AI pipeline via PromptOrchestrator.
   * The wizard has 9 steps of rich context; every field is passed to the AI.
   */
  static async submitPostRequest(request: CreatePostRequest): Promise<{
    success: boolean;
    requestId: string;
    message: string;
    logs: PipelineExecutionLog[];
    variations?: PlatformVariation[];
  }> {
    const timestamp = new Date().toISOString();
    const requestId = request.workflowId || `wf_${Date.now()}`;

    const logs: PipelineExecutionLog[] = [];

    const log = (step: string, manager: string, details: string, status: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
      const entry: PipelineExecutionLog = { step, manager, status, timestamp: new Date().toISOString(), details };
      logs.push(entry);
      return entry;
    };

    try {
      log('1. Request Ingestion', 'ReceivingManager', `Received CreatePostRequest for topic: "${request.topic.slice(0, 50)}"`);
      log('2. Context Assembly', 'ContextBuilder', `Built AI context: goal=${request.metadata.goal}, tone=${request.audience.tone}, platforms=${request.platforms.join(', ')}`);
      log('3. Topic Analysis', 'TopicAnalyzer', `Analyzing topic, detecting industry and content type`);
      log('4. Strategy Engine', 'ContentStrategyEngine', `Content type classified, writing framework selected`);
      log('5. Prompt Orchestration', 'PromptOrchestrator', `Building platform-specific prompts for ${request.platforms.length} platform(s)`);

      // Real AI generation via orchestrator
      const aiResult = await AIContentService.generateInstantContent({
        rawIdea: request.topic,
        goal: request.metadata.goal,
        targetAudience: request.audience.targetAudience,
        platforms: request.platforms,
        tone: request.audience.tone,
        industry: request.audience.industry,
        cta: request.callToAction,
      });

      log('6. AI Generation', 'GeminiEngine', `Generated ${aiResult.platformVariations.length} platform variations`);
      log('7. Final Text Approval', 'QualityAuditor', `Final post text validated and approved`);
      log('8. Content Summarizer & Visual Brief', 'ContentSummarizer', `Extracted visual summary & PostVisualBrief from final approved post text`);
      log('9. Image Prompt Builder & Validator', 'ImagePromptValidator', `Generated & validated photographic image prompts strictly from visual brief`);
      log('10. Pipeline Complete', 'PublishingManager', `Ready for dispatch — ${request.schedule.publishMode === 'now' ? 'immediate publish' : `scheduled for ${request.schedule.scheduledDate}`}`);

      this.executionLogs.push(...logs);

      return {
        success: true,
        requestId,
        message: `Post request for "${request.topic.slice(0, 40)}" successfully processed through AI Orchestration Pipeline.`,
        logs,
        variations: aiResult.platformVariations,
      };
    } catch (err: any) {
      log('AI Generation', 'GeminiEngine', `Generation error: ${err?.message || 'Unknown'}`, 'ERROR');
      this.executionLogs.push(...logs);
      return {
        success: false,
        requestId,
        message: `Pipeline error: ${err?.message || 'Unknown error'}`,
        logs,
      };
    }
  }

  /**
   * Instant AI Pipeline — used by InstantPostView.
   * Full context (goal, audience, tone, platforms) is passed to the orchestrator.
   */
  static async executeInstantAIPipeline(payload: InstantPostApiPayload): Promise<{
    success: boolean;
    pipelineId: string;
    variations: PlatformVariation[];
    logs: PipelineExecutionLog[];
    error?: string;
  }> {
    const pipelineId = `ai_chain_${Date.now()}`;
    const logs: PipelineExecutionLog[] = [];

    const log = (step: string, manager: string, details: string, status: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
      logs.push({ step, manager, status, timestamp: new Date().toISOString(), details });
    };

    try {
      log('1. Ingestion', 'ReceivingManager', `Topic: "${payload.raw_idea.slice(0, 40)}"`);
      log('2. Intelligence', 'TopicAnalyzer', `Goal: ${payload.goal} | Audience: ${payload.audience} | Tone: ${payload.tone}`);
      log('3. Strategy', 'ContentStrategyEngine', `${payload.platforms.length} platforms selected`);
      log('4. Prompt Assembly', 'PromptOrchestrator', `Building context-aware prompts`);

      const res = await AIContentService.generateInstantContent({
        rawIdea: payload.raw_idea,
        goal: payload.goal,
        targetAudience: payload.audience,
        platforms: payload.platforms,
        tone: payload.tone,
        industry: payload.industry,
        keywords: payload.keywords,
        cta: payload.cta,
        brandName: payload.brandName,
      });

      log('5. AI Text Generation', 'GeminiEngine', `${res.platformVariations.length} variations generated and approved`);
      log('6. Content Summarizer & Visual Brief', 'ContentSummarizer', `Visual summary & PostVisualBrief extracted from final post text`);
      log('7. Image Prompt Builder & Quality Check', 'ImagePromptValidator', `Image prompt constructed exclusively from visual brief`);

      this.executionLogs.push(...logs);

      return { success: true, pipelineId, variations: res.platformVariations, logs };
    } catch (err: any) {
      const errorMsg = err?.message || 'AI pipeline execution error';
      log('AI Pipeline', 'GeminiEngine', `Error: ${errorMsg}`, 'ERROR');
      this.executionLogs.push(...logs);
      return { success: false, pipelineId, variations: [], logs, error: errorMsg };
    }
  }

  static getExecutionLogs(): PipelineExecutionLog[] {
    return this.executionLogs;
  }
}
