export interface HandPlacementConstraint {
  leftHand: string;
  rightHand: string;
  explicitFiveFingersRequired: boolean;
}

export interface HumanAnatomyPoseDecision {
  poseIntent: string;
  bodyOrientation: 'front_facing_34' | 'profile_side' | 'seated_ergonomic' | 'standing_presenting';
  limbVisibility: string;
  handPlacement: HandPlacementConstraint;
  anatomicalConstraints: string[];
  interactionPosture: string;
  motionPlausibility: string;
  occlusionAwareAnatomyRules: string;
  prohibitedMalformedBodyNegativePrompts: string[];
  isAnatomicallySound: boolean;
  anatomyRiskWarnings?: string[];
  deterministicFingerprint: string;
}
