/**
 * Mini Post App - Branding Hierarchy Standard
 * Aligned with WCAG 2.2 AA (Info and Relationships SC 1.3.1).
 */

export interface HierarchyStandardSpec {
  headingWeight: string;
  bodyWeight: string;
  badgeWeight: string;
  frameworkAlignment: {
    wcag22: {
      infoAndRelationships: string;
    };
  };
}

export const HierarchyStandard: HierarchyStandardSpec = {
  headingWeight: 'font-black (900)',
  bodyWeight: 'font-normal (400)',
  badgeWeight: 'font-bold (700)',
  frameworkAlignment: {
    wcag22: {
      infoAndRelationships: 'Heading structure follows strict H1-H6 hierarchy for screen reader navigation (SC 1.3.1)',
    },
  },
};
