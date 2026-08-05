/**
 * Mini Post App - Branding UI Component Standard
 * Aligned with WCAG 2.2 AA (Focus Appearance SC 2.4.13 & Target Size SC 2.5.8).
 */

export interface UIStandardSpec {
  borderRadius: Record<string, string>;
  glassmorphismBackdrop: string;
  focusRingClass: string;
  frameworkAlignment: {
    wcag22: {
      focusAppearance: string;
      focusNotObscured: string;
    };
  };
}

export const UIStandard: UIStandardSpec = {
  borderRadius: {
    badge: '9999px',
    card: '1.5rem',
    button: '9999px',
    panel: '1rem',
  },
  glassmorphismBackdrop: 'backdrop-blur-xl bg-[#05070c]/85',
  focusRingClass: 'focus-visible:outline-2 focus-visible:outline-cyan-400 focus-visible:outline-offset-2',
  frameworkAlignment: {
    wcag22: {
      focusAppearance: 'Focus indicator has minimum 2px width and >= 3:1 contrast ratio against background (SC 2.4.13)',
      focusNotObscured: 'Focus indicators remain fully visible and unobscured by sticky headers or popups (SC 2.4.11)',
    },
  },
};
