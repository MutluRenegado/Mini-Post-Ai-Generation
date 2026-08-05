/**
 * Mini Post App - Accessibility Standard (WCAG 2.2 AA)
 * Full specification covering Contrast, Focus Appearance, Target Size, and Screen Reader semantics.
 */

export interface AccessibilityStandardSpec {
  wcagLevel: '2.2 AA';
  minContrastRatioText: number;
  minContrastRatioLargeText: number;
  minContrastRatioNonTextUI: number;
  minTargetSizePx: number;
  altTextRequiredForImages: boolean;
  focusVisibleRequired: boolean;
  frameworkAlignment: {
    wcag22: {
      contrastMinimum: string;
      focusAppearance: string;
      targetSizeMinimum: string;
      infoAndRelationships: string;
    };
  };
}

export const AccessibilityStandard: AccessibilityStandardSpec = {
  wcagLevel: '2.2 AA',
  minContrastRatioText: 4.5,
  minContrastRatioLargeText: 3.0,
  minContrastRatioNonTextUI: 3.0,
  minTargetSizePx: 24,
  altTextRequiredForImages: true,
  focusVisibleRequired: true,
  frameworkAlignment: {
    wcag22: {
      contrastMinimum: 'Enforces 4.5:1 text contrast ratio and 3:1 non-text UI component contrast (SC 1.4.3 & SC 1.4.11)',
      focusAppearance: 'Requires visible 2px focus ring with >= 3:1 contrast against dark background (SC 2.4.13)',
      targetSizeMinimum: 'Interactive buttons & touch targets have minimum 24x24px dimensions (SC 2.5.8)',
      infoAndRelationships: 'Semantic HTML5 structure for accessibility screen readers (SC 1.3.1)',
    },
  },
};
