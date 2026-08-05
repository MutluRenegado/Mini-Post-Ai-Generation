export type FacialExpressionType =
  | 'confident_professional_smile'
  | 'focused_concentration'
  | 'warm_approachable_look'
  | 'neutral_thoughtful_executive';

export interface IdentityContinuitySpec {
  subjectId?: string;
  ageBracket: '25-35' | '35-45' | '45-55' | '55+';
  attireStyle: string;
  ethnicityStyle: string;
  hairStyle: string;
}

export interface FacialIdentityDecision {
  expression: FacialExpressionType;
  gazeTarget: 'viewer_direct' | 'task_focused' | 'collaborator_focused';
  facialOrientationAngle: string;
  identityContinuity: IdentityContinuitySpec;
  expressionToEmotionMatchScore: number;
  multiSubjectIdentitySeparation: string;
  referenceImageConstraint?: string;
  privacyContentPolicyCheckPassed: boolean;
  limitationReason?: string;
  deterministicFingerprint: string;
}
