import crypto from 'crypto';
import {
  SpatialPhysicalConsistencyDecision,
  PerspectiveType,
} from './spatial-physical-consistency.types';

export class SpatialPhysicalConsistencyEngine {
  public static resolve(input: {
    primarySubject?: string;
    secondarySubjects?: string[];
    environment?: string;
    content?: string;
  }): SpatialPhysicalConsistencyDecision {
    const text = `${input.content || ''} ${input.environment || ''}`.toLowerCase();
    const primary = input.primarySubject || 'Primary Subject';

    let perspective: PerspectiveType = 'two_point_corner';
    let relativeScaleRatio = '1:1 natural anatomical scale proportion relative to architectural surroundings';
    let surfaceContactGrounding = 'Grounded directly on floor surface with realistic ambient shadow contact points';
    let gravityVector = 'Downward 9.81 m/s^2 natural gravity alignment';
    let horizonLogic = 'Horizontal eye-level horizon placed at 40% height of frame';

    if (text.includes('isometric') || text.includes('diagram') || text.includes('tech stack')) {
      perspective = 'isometric';
      horizonLogic = 'Infinite parallel 30-degree isometric grid alignment';
    } else if (text.includes('corridor') || text.includes('hallway') || text.includes('tunnel')) {
      perspective = 'one_point_linear';
      horizonLogic = 'Central vanishing point linear perspective';
    }

    const depthOrdering = [
      `Foreground (Z=0m): Desk edge / accent element`,
      `Midground (Z=1.5m): ${primary}`,
      `Background (Z=4.5m): ${input.environment || 'Architectural backdrop'}`,
    ];

    const physicalInconsistencies: string[] = [];
    if (text.includes('floating without support') && !text.includes('zero gravity space')) {
      physicalInconsistencies.push('Physical impossibility detected: Subject is floating in air without support in normal gravity environment.');
    }
    if (text.includes('giant human 50 feet tall in room')) {
      physicalInconsistencies.push('Physical scale impossibility detected: Human subject exceeds realistic room height.');
    }

    const isPhysicallyPlausible = physicalInconsistencies.length === 0;

    const payload = `${primary}|${perspective}|${isPhysicallyPlausible}|${depthOrdering.length}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      relativeScaleRatio,
      depthOrdering,
      perspective,
      surfaceContactGrounding,
      gravityVector,
      occlusionRules: `${primary} in midground correctly obscures background wall and distant objects`,
      horizonLogic,
      isPhysicallyPlausible,
      physicalInconsistencies: isPhysicallyPlausible ? undefined : physicalInconsistencies,
      deterministicFingerprint,
    };
  }
}
