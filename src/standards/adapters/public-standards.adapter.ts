import { standardsRegistry } from '../core/standard-registry';
import { StandardDefinition } from '../core/standard-definition';

export interface PublicStandardSummary {
  id: string;
  order: number;
  name: string;
  reference: string;
  implementation: string;
  publishedBy: string;
  category: string;
  sourceType: string;
  version: string;
  lastReviewedDate: string;
}

export function getPublicEngineeringStandards(): PublicStandardSummary[] {
  const allStds = standardsRegistry.getPublic();

  // Return formatted array ordered cleanly for public UI display
  return allStds.map((std: StandardDefinition, index: number) => ({
    id: std.id,
    order: index + 1,
    name: std.title || std.name,
    reference: getPublicReferenceLabel(std),
    implementation: std.publicSummary || std.description,
    publishedBy: getPublicPublisher(std),
    category: mapPublicCategory(std.category),
    sourceType: std.sourceType,
    version: std.version,
    lastReviewedDate: std.reviewedDate,
  }));
}

function getPublicReferenceLabel(std: StandardDefinition): string {
  if (std.alignmentRecords && std.alignmentRecords.length > 0) {
    const primary = std.alignmentRecords[0];
    return `Informed by ${primary.frameworkName} (${primary.frameworkEdition}) & ${std.name} ${std.version}`;
  }
  return `Mini Post App Internal Standard ${std.version}`;
}

function getPublicPublisher(std: StandardDefinition): string {
  if (std.sourceType === 'PLATFORM_REFERENCE') {
    return 'Platform Guidelines / Mini Post App';
  }
  if (std.sourceType === 'INTERNATIONAL_REFERENCE') {
    return 'ISO/W3C / Mini Post App';
  }
  return 'Mini Post App';
}

function mapPublicCategory(cat: string): string {
  if (cat.includes('AI') || cat.includes('Generation')) return 'AI and Content';
  if (cat.includes('Design') || cat.includes('Typography') || cat.includes('Color')) return 'Design System';
  if (cat.includes('Platform') || cat.includes('Social')) return 'Social Platform';
  if (cat.includes('Video')) return 'Video';
  if (cat.includes('Publishing') || cat.includes('SEO')) return 'Publishing';
  if (cat.includes('Accessibility')) return 'Accessibility';
  if (cat.includes('Compliance')) return 'Compliance';
  return 'Internal Engineering';
}
