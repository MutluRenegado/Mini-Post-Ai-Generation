import crypto from 'crypto';
import {
  CompositionHierarchyDecision,
  FocalPlacement,
  CompositionBalance,
  VisualHierarchyTier,
} from './composition-hierarchy.types';

export class CompositionHierarchyEngine {
  public static resolve(input: {
    primarySubject?: string;
    secondarySubjects?: string[];
    environment?: string;
    platform?: string;
    textOverlayRequested?: boolean;
  }): CompositionHierarchyDecision {
    const primary = input.primarySubject || 'Central Executive Subject';
    const secondary = input.secondarySubjects && input.secondarySubjects.length > 0 ? input.secondarySubjects[0] : 'Workspace Environment';
    const env = input.environment || 'Modern Office Workspace';
    const platform = (input.platform || 'linkedin').toLowerCase();

    let focalPlacement: FocalPlacement = 'rule_of_thirds_left';
    let balance: CompositionBalance = 'asymmetrical_dynamic';
    let negativeSpacePercentage = 35; // Default breathing room
    let subjectPlacementRegion = 'Left 60% grid area';
    let visualFlowDescription = 'Eye enters at primary left subject, flows diagonally along desk edge to background architecture';

    if (input.textOverlayRequested) {
      focalPlacement = 'rule_of_thirds_left';
      negativeSpacePercentage = 45; // Increased negative space for text
      subjectPlacementRegion = 'Left 50% grid area';
      visualFlowDescription = 'Primary subject anchored on left; right 40% clean low-texture zone reserved for text contrast canvas';
    } else if (platform.includes('instagram') || platform.includes('square')) {
      focalPlacement = 'center_weighted';
      balance = 'symmetrical';
      negativeSpacePercentage = 30;
      subjectPlacementRegion = 'Central square region';
      visualFlowDescription = 'Centered subject focal point with radial balance extending to frame boundaries';
    }

    const hierarchy: VisualHierarchyTier[] = [
      { tier: 1, elementName: primary, weightPercentage: 55, description: 'Dominant primary focal anchor' },
      { tier: 2, elementName: secondary, weightPercentage: 30, description: 'Secondary contextual interaction element' },
      { tier: 3, elementName: env, weightPercentage: 15, description: 'Background environmental texture and depth' },
    ];

    let platformSafeZoneMargins = { top: 20, right: 20, bottom: 20, left: 20 };
    if (platform.includes('story') || platform.includes('reel') || platform.includes('tiktok')) {
      platformSafeZoneMargins = { top: 80, right: 20, bottom: 120, left: 20 };
    } else if (platform.includes('x') || platform.includes('twitter')) {
      platformSafeZoneMargins = { top: 20, right: 40, bottom: 20, left: 40 };
    }

    const foregroundMidgroundBackgroundStructure = {
      foreground: `Subtle out-of-focus edge accent or desk surface foreground depth`,
      midground: `Primary anchor (${primary}) and interaction area (${secondary})`,
      background: `Architectural background (${env}) with controlled soft lighting blur`,
    };

    const croppingResilience = 'Subject contained strictly within 80% inner central area to guarantee complete cross-platform crop safety';

    const payload = `${primary}|${focalPlacement}|${balance}|${negativeSpacePercentage}|${platform}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      focalPoint: primary,
      focalPlacement,
      balance,
      hierarchy,
      negativeSpacePercentage,
      subjectPlacementRegion,
      visualFlowDescription,
      platformSafeZoneMargins,
      embeddedTextCanvasAllocation: input.textOverlayRequested ? 'Right upper quadrant 40% area with uniform low-contrast background' : undefined,
      foregroundMidgroundBackgroundStructure,
      croppingResilience,
      deterministicFingerprint,
    };
  }
}
