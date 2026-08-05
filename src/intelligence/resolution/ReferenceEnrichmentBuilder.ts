import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { ReferenceEnrichmentData } from './resolution.types';

export class ReferenceEnrichmentBuilder {
  /**
   * Builds safe metadata enrichment payload from top-ranked approved references.
   * Does NOT copy captions blindly, expose private rights data, or describe metadata retrieval as visual analysis.
   */
  static buildEnrichment(references: VisualReference[]): ReferenceEnrichmentData {
    if (!references || references.length === 0) {
      return {
        referenceIdsUsed: [],
        confidenceStatus: 'LOW_CONFIDENCE',
      };
    }

    const topRef = references[0];

    const mustInclude = new Set<string>();
    const mustAvoid = new Set<string>();

    for (const ref of references) {
      if (ref.mustInclude) ref.mustInclude.forEach((item) => mustInclude.add(item));
      if (ref.mustAvoid) ref.mustAvoid.forEach((item) => mustAvoid.add(item));
    }

    return {
      suggestedScene: topRef.scene || topRef.category,
      suggestedRoles: topRef.professionalRoles,
      suggestedObjects: topRef.objects,
      suggestedEnvironment: topRef.environment,
      suggestedLighting: topRef.lighting,
      suggestedComposition: topRef.composition,
      suggestedCameraAngle: topRef.cameraAngle,
      suggestedMood: topRef.mood,
      suggestedVisualStyle: topRef.photographyStyle,
      suggestedColors: topRef.colorPalette,
      mustInclude: Array.from(mustInclude),
      mustAvoid: Array.from(mustAvoid),
      referenceIdsUsed: references.map((r) => r.id),
      confidenceStatus: references.length >= 2 ? 'HIGH_CONFIDENCE' : 'MEDIUM_CONFIDENCE',
    };
  }
}
