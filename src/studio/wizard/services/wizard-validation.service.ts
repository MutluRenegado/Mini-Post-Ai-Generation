import { WizardFormData, StepValidationResult } from '../types/wizard.types';

export class WizardValidationService {
  static validateStep(step: number, data: WizardFormData): StepValidationResult {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.postGoal) {
          errors.postGoal = 'Please select a post goal.';
        }
        if (data.postGoal === 'Custom' && (!data.customGoal || !data.customGoal.trim())) {
          errors.customGoal = 'Please specify your custom goal.';
        }
        break;

      case 2:
        if (!data.topic || !data.topic.trim()) {
          errors.topic = 'Topic is required.';
        }
        if (!data.description || !data.description.trim()) {
          errors.description = 'Post description is required.';
        }
        if (!data.callToAction || !data.callToAction.trim()) {
          errors.callToAction = 'Call to Action is required.';
        }
        break;

      case 3:
        if (!data.targetAudience || !data.targetAudience.trim()) {
          errors.targetAudience = 'Target audience is required.';
        }
        if (!data.industry || !data.industry.trim()) {
          errors.industry = 'Industry is required.';
        }
        if (!data.tone) {
          errors.tone = 'Tone is required.';
        }
        break;

      case 4:
        if (!data.platforms || data.platforms.length === 0) {
          errors.platforms = 'Select at least one publishing platform.';
        }
        break;

      case 5:
        if (!data.templateId) {
          errors.templateId = 'Please select a visual layout template.';
        }
        break;

      case 6:
        if (!data.brandId) {
          errors.brandId = 'Please select a brand kit profile.';
        }
        break;

      case 7:
        if (data.imageSource === 'ai_generated' && (!data.imagePrompt || !data.imagePrompt.trim())) {
          errors.imagePrompt = 'Image prompt is required for AI generation.';
        }
        break;

      case 8:
        if (data.publishMode === 'scheduled') {
          if (!data.scheduledDate) errors.scheduledDate = 'Schedule date is required.';
          if (!data.scheduledTime) errors.scheduledTime = 'Schedule time is required.';
        }
        break;

      default:
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
