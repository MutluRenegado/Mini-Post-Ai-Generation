/**
 * Mini Post App - Template Engine Standard
 * Aligned with ISO/IEC 25010 (Usability & Maintainability).
 */

export interface TemplateStandardSpec {
  allowedVariablePrefix: string;
  presetCategories: string[];
  maxCustomVariables: number;
  frameworkAlignment: {
    iso25010: {
      modularity: string;
    };
  };
}

export const TemplateStandard: TemplateStandardSpec = {
  allowedVariablePrefix: '{{',
  presetCategories: ['E-Commerce', 'SaaS & Tech', 'Renewable Energy', 'Cybersecurity', 'Executive Leadership'],
  maxCustomVariables: 20,
  frameworkAlignment: {
    iso25010: {
      modularity: 'Reusable template variable schema enabling rapid post customization across 14 studios',
    },
  },
};
