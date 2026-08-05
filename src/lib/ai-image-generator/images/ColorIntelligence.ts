export interface PaletteDefinition {
  name: string;
  primaryAccent: string;
  secondaryAccent: string;
  backgroundTone: string;
  promptDescription: string;
}

export class ColorIntelligence {
  private static CURATED_PALETTES: PaletteDefinition[] = [
    {
      name: 'Cyan & Amber',
      primaryAccent: 'Vibrant Cyan (#08C9FF)',
      secondaryAccent: 'Warm Amber (#FFB020)',
      backgroundTone: 'Clean White & Crisp Light Grey',
      promptDescription: 'Vibrant cyan and warm amber accents against a bright modern white daylight background with high contrast',
    },
    {
      name: 'Electric Blue & Coral',
      primaryAccent: 'Electric Blue (#0052FF)',
      secondaryAccent: 'Bright Coral (#FF5630)',
      backgroundTone: 'Bright Studio Soft Grey',
      promptDescription: 'Electric blue focal accents paired with energetic coral highlights in a bright studio environment',
    },
    {
      name: 'Emerald & Gold',
      primaryAccent: 'Deep Emerald (#00A76F)',
      secondaryAccent: 'Warm Gold (#FFC107)',
      backgroundTone: 'Luminous Off-White',
      promptDescription: 'Rich emerald green and polished warm gold accents in a bright, modern architectural space',
    },
    {
      name: 'Violet & Aqua',
      primaryAccent: 'Deep Violet (#7A09FA)',
      secondaryAccent: 'Vibrant Aqua (#00E5FF)',
      backgroundTone: 'Clean Daylight White',
      promptDescription: 'Sophisticated deep violet and vivid aqua accents over a bright daylight aesthetic',
    },
    {
      name: 'Orange & Cobalt',
      primaryAccent: 'Energetic Orange (#FF5630)',
      secondaryAccent: 'Cobalt Blue (#0747A6)',
      backgroundTone: 'Crisp Architectural White',
      promptDescription: 'Energetic orange and deep cobalt blue accents in a modern, bright commercial setting',
    },
    {
      name: 'Teal & Warm Yellow',
      primaryAccent: 'Teal (#00B8D9)',
      secondaryAccent: 'Warm Sun Yellow (#FFAB00)',
      backgroundTone: 'Clean Modern Studio White',
      promptDescription: 'Cool teal and warm sunburst yellow accents creating an inviting, bright editorial palette',
    },
    {
      name: 'Magenta & Indigo',
      primaryAccent: 'Vivid Magenta (#E91E63)',
      secondaryAccent: 'Indigo Blue (#3F51B5)',
      backgroundTone: 'Clean High-Key White',
      promptDescription: 'Vivid magenta and deep indigo accents with crisp high-key lighting',
    },
  ];

  /**
   * Returns a modern high-contrast color direction string for a given topic, platform, and brand kit.
   */
  static getColorDirection(
    topic: string,
    platform: string,
    brandColors?: string[]
  ): { colorDirection: string; paletteName: string; primaryAccent: string; secondaryAccent: string } {
    const topicLower = topic.toLowerCase();
    const platformLower = platform.toLowerCase();

    // If brand kit has valid custom colors, prioritize them cleanly without allowing a dark override
    if (brandColors && brandColors.length >= 2 && brandColors[0] !== '#0F172A') {
      const primary = brandColors[0];
      const secondary = brandColors[1] || '#08C9FF';
      return {
        colorDirection: `Vibrant primary accent ${primary} paired with secondary accent ${secondary} in a bright, clean, high-contrast daylight setting with no dark muddy background`,
        paletteName: 'Brand Kit Custom',
        primaryAccent: primary,
        secondaryAccent: secondary,
      };
    }

    // Select palette based on topic/platform
    let index = 0;
    if (topicLower.includes('trade') || topicLower.includes('payment') || topicLower.includes('cfo') || topicLower.includes('finance')) {
      index = 0; // Cyan & Amber
    } else if (topicLower.includes('tech') || topicLower.includes('ai') || topicLower.includes('code') || topicLower.includes('dev')) {
      index = 3; // Violet & Aqua
    } else if (topicLower.includes('growth') || topicLower.includes('startup') || topicLower.includes('resilience')) {
      index = 1; // Electric Blue & Coral
    } else if (topicLower.includes('marketing') || topicLower.includes('content') || topicLower.includes('social')) {
      index = 4; // Orange & Cobalt
    } else if (platformLower.includes('instagram') || platformLower.includes('pinterest')) {
      index = 2; // Emerald & Gold
    } else {
      let hash = 0;
      for (let i = 0; i < topic.length; i++) {
        hash = (hash << 5) - hash + topic.charCodeAt(i);
        hash |= 0;
      }
      index = Math.abs(hash) % this.CURATED_PALETTES.length;
    }

    const palette = this.CURATED_PALETTES[index];
    return {
      colorDirection: palette.promptDescription,
      paletteName: palette.name,
      primaryAccent: palette.primaryAccent,
      secondaryAccent: palette.secondaryAccent,
    };
  }
}
