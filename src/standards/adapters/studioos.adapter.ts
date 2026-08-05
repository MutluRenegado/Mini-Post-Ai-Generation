import { standardsRegistry } from '../core/standard-registry';
import { StandardDefinition } from '../core/standard-definition';

export interface StudioOSStandardsResolution {
  workflow: string;
  applicableStandards: StandardDefinition[];
  requiredQualityGates: string[];
  maxRetryCount: number;
  humanApprovalRequired: boolean;
}

export function resolveStudioOSStandards(
  workflow: string,
  mediaType?: 'text' | 'image' | 'video' | 'audio' | 'multimodal'
): StudioOSStandardsResolution {
  const allStds = standardsRegistry.getAll();
  const filtered = allStds.filter((std) => {
    if (mediaType && std.mediaType && std.mediaType !== mediaType) return false;
    return std.status === 'ACTIVE';
  });

  return {
    workflow,
    applicableStandards: filtered,
    requiredQualityGates: ['intent-preservation', 'platform-fit', 'factuality', 'safety'],
    maxRetryCount: 3,
    humanApprovalRequired: true,
  };
}
