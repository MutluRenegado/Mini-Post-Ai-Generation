/**
 * FinalTextVisualSummarizer
 * Summarizes ONLY final, approved post text into a structured visual summary.
 * Uses VisualConceptResolver to guarantee abstract concept translation.
 */

import { ContentVisualSummary, isImageGenerationAllowed } from './image.types';
import { VisualConceptResolver } from './VisualConceptResolver';
import { Logger } from '../logging/Logger';

export interface FinalTextSummarizerInput {
  finalText: string;
  textStatus: string;
  title?: string;
  platform?: string;
  postType?: string;
  targetAudience?: string;
  tone?: string;
  brandContext?: string;
  campaignGoal?: string;
}

export class FinalTextVisualSummarizer {
  /**
   * Enforces the Final Text Gate before generating a visual summary.
   */
  static summarize(input: FinalTextSummarizerInput): ContentVisualSummary {
    const gate = isImageGenerationAllowed({
      textStatus: input.textStatus as any,
      finalText: input.finalText,
      approvalStatus: 'APPROVED',
    });

    if (!gate.allowed) {
      Logger.error('FinalTextVisualSummarizer', 'final_text_gate_failed', { reason: gate.reason });
      throw new Error(`IMAGE_PIPELINE_ERROR: ${gate.reason}`);
    }

    const text = input.finalText.trim();
    const resolution = VisualConceptResolver.resolveConcept(text, input.title);

    const firstSentence = text.split(/(?<=[.!?])\s+/)[0] || text.slice(0, 140);

    Logger.info('FinalTextVisualSummarizer', 'final_text_summarized', {
      centralSubject: resolution.centralSubject,
      textLength: text.length,
    });

    return {
      mainSubject: resolution.centralSubject,
      coreMessage: firstSentence,
      relevantPeople: resolution.peopleOrRoles,
      relevantObjects: resolution.keyObjects,
      environment: resolution.setting,
      location: resolution.setting,
      timeOrLighting: 'Natural bright daylight illumination',
      mood: input.tone || 'Confident, authoritative, and realistic',
      audience: input.targetAudience || 'Professional decision makers and modern creators',
      industry: input.campaignGoal || 'Business & Enterprise',
      visualPriorities: [
        'Instant visual comprehension of article core message',
        'Concrete real-world scene translation of abstract topic',
        'High-contrast professional photography aesthetic',
      ],
      prohibitedElements: [
        ...resolution.prohibitedElements,
        'readable text',
        'isolated letters',
        'gibberish typography',
        'watermark',
        'logo',
      ],
    };
  }
}
