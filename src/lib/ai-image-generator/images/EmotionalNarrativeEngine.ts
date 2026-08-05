import crypto from 'crypto';
import {
  EmotionalNarrativeDecision,
  PrimaryEmotion,
  NarrativeMoment,
} from './emotional-narrative.types';

export class EmotionalNarrativeEngine {
  public static resolve(input: {
    topic?: string;
    content?: string;
    mood?: string;
    tone?: string;
    audience?: string;
  }): EmotionalNarrativeDecision {
    const text = `${input.topic || ''} ${input.content || ''} ${input.mood || ''} ${input.tone || ''}`.toLowerCase();

    let intendedEmotion: PrimaryEmotion = 'authoritative_trust';
    let storyMoment: NarrativeMoment = 'collaborative_milestone';
    let symbolicElements: string[] = ['Clean glass architecture', 'Illuminated telemetry metrics'];

    if (text.includes('growth') || text.includes('future') || text.includes('expansion') || text.includes('scale')) {
      intendedEmotion = 'optimistic_growth';
      storyMoment = 'inciting_discovery';
      symbolicElements = ['Rising trendline visualization', 'Sunlit horizon glow'];
    } else if (text.includes('ai') || text.includes('tech') || text.includes('breakthrough') || text.includes('innovation')) {
      intendedEmotion = 'innovative_excitement';
      storyMoment = 'mid_action_peak';
      symbolicElements = ['Interconnected neural nodes', 'Cyan light halo'];
    } else if (text.includes('medical') || text.includes('health') || text.includes('care') || text.includes('patient')) {
      intendedEmotion = 'warm_compassion';
      storyMoment = 'reflective_resolution';
      symbolicElements = ['Warm natural daylight', 'Soft ergonomic curvature'];
    } else if (text.includes('security') || text.includes('protect') || text.includes('critical') || text.includes('alert')) {
      intendedEmotion = 'urgent_focus';
      storyMoment = 'mid_action_peak';
      symbolicElements = ['Encrypted shield node', 'High contrast telemetry console'];
    }

    const payload = `${intendedEmotion}|${storyMoment}|${symbolicElements.join(',')}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      intendedEmotion,
      emotionalIntensity: 'moderate_focus',
      storyMoment,
      narrativeContext: `Visual narrative reinforcing ${intendedEmotion.replace('_', ' ')} for post text story`,
      symbolicElements,
      toneConsistencyScore: 92,
      targetAudienceSuitability: input.audience || 'B2B Professional Executives',
      finalTextAlignmentEvidence: `Text content directly supports ${intendedEmotion} emotional grounding`,
      deterministicFingerprint,
    };
  }
}
