import { z } from 'zod';

export const EmotionalNarrativeDecisionSchema = z.object({
  intendedEmotion: z.enum([
    'authoritative_trust',
    'innovative_excitement',
    'serene_clarity',
    'urgent_focus',
    'warm_compassion',
    'optimistic_growth',
  ]),
  emotionalIntensity: z.enum(['subtle_ambient', 'moderate_focus', 'dramatic_peak']),
  storyMoment: z.enum([
    'inciting_discovery',
    'mid_action_peak',
    'reflective_resolution',
    'collaborative_milestone',
  ]),
  narrativeContext: z.string(),
  symbolicElements: z.array(z.string()),
  toneConsistencyScore: z.number(),
  targetAudienceSuitability: z.string(),
  finalTextAlignmentEvidence: z.string(),
  deterministicFingerprint: z.string(),
});
