/**
 * Mini Post App - Branding Color Palette Standard
 * Aligned with WCAG 2.2 AA (Contrast Minimum: 4.5:1 text, 3:1 non-text UI components).
 */

export interface ColorStandardSpec {
  backgroundDark: string;
  panelBackground: string;
  borderColor: string;
  primaryCyan: string;
  primaryIndigo: string;
  accentPurple: string;
  accentPink: string;
  neonGreen: string;
  frameworkAlignment: {
    wcag22: {
      contrastMinimum: string;
      nonTextContrast: string;
      useOfColor: string;
    };
  };
}

export const ColorStandard: ColorStandardSpec = {
  backgroundDark: '#05070c',
  panelBackground: '#0d1220',
  borderColor: '#1f2b45',
  primaryCyan: '#08c9ff',
  primaryIndigo: '#657bff',
  accentPurple: '#7e4cff',
  accentPink: '#ef0d79',
  neonGreen: '#00ff66',
  frameworkAlignment: {
    wcag22: {
      contrastMinimum: 'Text elements maintain contrast ratio >= 4.5:1 against dark panel backgrounds (SC 1.4.3)',
      nonTextContrast: 'UI boundaries, badges, and focus rings maintain >= 3:1 contrast ratio (SC 1.4.11)',
      useOfColor: 'Color is never used as the sole visual means of conveying information (SC 1.4.1)',
    },
  },
};
