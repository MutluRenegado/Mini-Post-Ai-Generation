import { z } from 'zod';

export const HandPlacementConstraintSchema = z.object({
  leftHand: z.string(),
  rightHand: z.string(),
  explicitFiveFingersRequired: z.boolean(),
});

export const HumanAnatomyPoseDecisionSchema = z.object({
  poseIntent: z.string(),
  bodyOrientation: z.enum(['front_facing_34', 'profile_side', 'seated_ergonomic', 'standing_presenting']),
  limbVisibility: z.string(),
  handPlacement: HandPlacementConstraintSchema,
  anatomicalConstraints: z.array(z.string()),
  interactionPosture: z.string(),
  motionPlausibility: z.string(),
  occlusionAwareAnatomyRules: z.string(),
  prohibitedMalformedBodyNegativePrompts: z.array(z.string()),
  isAnatomicallySound: z.boolean(),
  anatomyRiskWarnings: z.array(z.string()).optional(),
  deterministicFingerprint: z.string(),
});
