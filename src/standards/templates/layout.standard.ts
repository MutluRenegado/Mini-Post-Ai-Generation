/**
 * Mini Post App - Layout Standard
 * Aligned with WCAG 2.2 AA Responsive Layout & ISO/IEC 25010 Usability.
 */

export interface LayoutStandardSpec {
  gridColumns: number;
  containerMaxWidthPx: number;
  safeMarginPx: number;
  frameworkAlignment: {
    wcag22: {
      reflow: string;
    };
  };
}

export const LayoutStandard: LayoutStandardSpec = {
  gridColumns: 12,
  containerMaxWidthPx: 1280,
  safeMarginPx: 24,
  frameworkAlignment: {
    wcag22: {
      reflow: 'Content reflows without loss of information or horizontal scrolling down to 320px width (SC 1.4.10)',
    },
  },
};
