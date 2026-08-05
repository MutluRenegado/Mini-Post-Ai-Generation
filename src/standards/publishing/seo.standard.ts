/**
 * Mini Post App - Publishing SEO Standard
 * Informed by Google Search Essentials (Technical SEO, E-E-A-T, and Structured Data).
 */

export interface SEOStandardSpec {
  maxTitleLength: number;
  maxMetaDescriptionLength: number;
  ogTypeDefault: string;
  frameworkAlignment: {
    googleSearchEssentials: {
      technicalCrawlability: string;
      helpfulContent: string;
    };
  };
}

export const SEOStandard: SEOStandardSpec = {
  maxTitleLength: 60,
  maxMetaDescriptionLength: 160,
  ogTypeDefault: 'website',
  frameworkAlignment: {
    googleSearchEssentials: {
      technicalCrawlability: 'Enforces clean semantic HTML5 header tags, canonical links, and valid web manifests',
      helpfulContent: 'Ensures generated content provides original, non-duplicative, people-first value',
    },
  },
};
