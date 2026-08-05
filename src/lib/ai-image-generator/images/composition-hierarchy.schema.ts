import { z } from 'zod';

export const VisualHierarchyTierSchema = z.object({
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  elementName: z.string(),
  weightPercentage: z.number(),
  description: z.string(),
});

export const CompositionHierarchyDecisionSchema = z.object({
  focalPoint: z.string(),
  focalPlacement: z.enum([
    'center_weighted',
    'rule_of_thirds_left',
    'rule_of_thirds_right',
    'golden_spiral_anchor',
    'bottom_third_anchor',
  ]),
  balance: z.enum([
    'symmetrical',
    'asymmetrical_dynamic',
    'radial',
    'diagonal_flow',
    'pyramid_structure',
  ]),
  hierarchy: z.array(VisualHierarchyTierSchema),
  negativeSpacePercentage: z.number(),
  subjectPlacementRegion: z.string(),
  visualFlowDescription: z.string(),
  platformSafeZoneMargins: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
  }),
  embeddedTextCanvasAllocation: z.string().optional(),
  foregroundMidgroundBackgroundStructure: z.object({
    foreground: z.string(),
    midground: z.string(),
    background: z.string(),
  }),
  croppingResilience: z.string(),
  deterministicFingerprint: z.string(),
});
