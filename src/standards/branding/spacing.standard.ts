/**
 * Mini Post App - Branding Spacing Standard
 * Aligned with WCAG 2.2 AA Target Size (Minimum SC 2.5.8) and 4px/8px Grid Systems.
 */

export interface SpacingStandardSpec {
  baseUnitPx: number;
  scale: Record<string, string>;
  minTouchTargetPx: number;
  frameworkAlignment: {
    wcag22: {
      targetSizeMinimum: string;
    };
  };
}

export const SpacingStandard: SpacingStandardSpec = {
  baseUnitPx: 4,
  scale: {
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    6: '1.5rem',  // 24px
    8: '2rem',    // 32px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
  },
  minTouchTargetPx: 24,
  frameworkAlignment: {
    wcag22: {
      targetSizeMinimum: 'All interactive targets meet minimum 24x24px dimensions or adequate spacing (SC 2.5.8)',
    },
  },
};
