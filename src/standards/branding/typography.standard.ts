/**
 * Mini Post App - Branding Typography Standard
 * Aligned with WCAG 2.2 AA (Legibility & Scalability) and ISO/IEC 25010 (Usability).
 */

export interface TypographyStandardSpec {
  fontFamilySans: string;
  fontFamilyMono: string;
  fontScale: Record<string, string>;
  frameworkAlignment: {
    wcag22: {
      textResize: string;
      visualPresentation: string;
    };
  };
}

export const TypographyStandard: TypographyStandardSpec = {
  fontFamilySans: 'Inter, system-ui, -apple-system, sans-serif',
  fontFamilyMono: 'JetBrains Mono, Fira Code, monospace',
  fontScale: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  frameworkAlignment: {
    wcag22: {
      textResize: 'Text can be resized up to 200% without loss of content or functionality (SC 1.4.4)',
      visualPresentation: 'Line height set to 1.5x font size with paragraph spacing >= 2x font size (SC 1.4.12)',
    },
  },
};
