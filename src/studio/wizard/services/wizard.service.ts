import { WizardFormData, CreatePostRequest } from '../types/wizard.types';
import { StudioOrchestratorService } from '../../orchestrator/orchestrator.service';

export class CreatorWizardMainService {
  static buildCreatePostRequest(data: WizardFormData): CreatePostRequest {
    const timestamp = new Date().toISOString();
    return {
      workflowId: `wf_${Date.now()}`,
      topic: data.topic,
      title: data.title || data.topic,
      description: data.description,
      callToAction: data.callToAction,
      platforms: data.platforms,
      templateId: data.templateId,
      brandId: data.brandId,
      audience: {
        targetAudience: data.targetAudience,
        industry: data.industry,
        language: data.language,
        tone: data.tone,
      },
      imageSettings: {
        source: data.imageSource,
        prompt: data.imagePrompt,
        style: data.imageStyle,
        aspectRatio: data.imageAspectRatio,
        imageUrl: data.imageUrl,
      },
      schedule: {
        publishMode: data.publishMode,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        timezone: data.timezone || 'UTC',
      },
      metadata: {
        goal: data.postGoal === 'Custom' ? data.customGoal || 'Custom' : data.postGoal,
        createdAt: timestamp,
        clientVersion: '2.0.0',
      },
    };
  }

  static async submitWizardRequest(data: WizardFormData): Promise<{ success: boolean; requestId: string; message: string }> {
    const requestPayload = this.buildCreatePostRequest(data);
    return StudioOrchestratorService.submitPostRequest(requestPayload);
  }
}
