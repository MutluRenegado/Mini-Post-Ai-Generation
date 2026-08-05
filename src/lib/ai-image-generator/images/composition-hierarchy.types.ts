export type FocalPlacement =
  | 'center_weighted'
  | 'rule_of_thirds_left'
  | 'rule_of_thirds_right'
  | 'golden_spiral_anchor'
  | 'bottom_third_anchor';

export type CompositionBalance =
  | 'symmetrical'
  | 'asymmetrical_dynamic'
  | 'radial'
  | 'diagonal_flow'
  | 'pyramid_structure';

export interface VisualHierarchyTier {
  tier: 1 | 2 | 3;
  elementName: string;
  weightPercentage: number;
  description: string;
}

export interface CompositionHierarchyDecision {
  focalPoint: string;
  focalPlacement: FocalPlacement;
  balance: CompositionBalance;
  hierarchy: VisualHierarchyTier[];
  negativeSpacePercentage: number;
  subjectPlacementRegion: string;
  visualFlowDescription: string;
  platformSafeZoneMargins: { top: number; right: number; bottom: number; left: number };
  embeddedTextCanvasAllocation?: string;
  foregroundMidgroundBackgroundStructure: {
    foreground: string;
    midground: string;
    background: string;
  };
  croppingResilience: string;
  deterministicFingerprint: string;
}
