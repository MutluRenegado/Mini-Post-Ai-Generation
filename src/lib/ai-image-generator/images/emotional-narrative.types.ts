export type PrimaryEmotion =
  | 'authoritative_trust'
  | 'innovative_excitement'
  | 'serene_clarity'
  | 'urgent_focus'
  | 'warm_compassion'
  | 'optimistic_growth';

export type NarrativeMoment =
  | 'inciting_discovery'
  | 'mid_action_peak'
  | 'reflective_resolution'
  | 'collaborative_milestone';

export interface EmotionalNarrativeDecision {
  intendedEmotion: PrimaryEmotion;
  emotionalIntensity: 'subtle_ambient' | 'moderate_focus' | 'dramatic_peak';
  storyMoment: NarrativeMoment;
  narrativeContext: string;
  symbolicElements: string[];
  toneConsistencyScore: number;
  targetAudienceSuitability: string;
  finalTextAlignmentEvidence: string;
  deterministicFingerprint: string;
}
