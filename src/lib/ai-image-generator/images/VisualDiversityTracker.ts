export interface VisualHistoryEntry {
  topic: string;
  platform: string;
  environment: string;
  cameraAngle: string;
  composition: string;
  paletteName: string;
  timestamp: number;
}

export class VisualDiversityTracker {
  private static history: VisualHistoryEntry[] = [];
  private static MAX_HISTORY = 30;

  static recordGeneration(entry: Omit<VisualHistoryEntry, 'timestamp'>): void {
    this.history.unshift({
      ...entry,
      timestamp: Date.now(),
    });
    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop();
    }
  }

  static getRecentEntries(): VisualHistoryEntry[] {
    return [...this.history];
  }

  static isRecentDuplicate(
    topic: string,
    environment: string,
    cameraAngle: string,
    composition: string
  ): boolean {
    const recent = this.history.slice(0, 5);
    return recent.some(
      (h) =>
        h.topic.toLowerCase() === topic.toLowerCase() &&
        (h.environment === environment || h.cameraAngle === cameraAngle || h.composition === composition)
    );
  }

  /**
   * Applies subtle variations to framing, camera angle, and background elements
   * if a similar generation was recently performed for the same topic.
   */
  static diversifyFraming(
    platform: string,
    aspectRatio: string,
    topic: string
  ): { composition: string; cameraAngle: string; framing: string; lighting: string } {
    const p = platform.toLowerCase();
    const count = this.history.filter((h) => h.platform.toLowerCase() === p).length;

    // Platform-specific primary vs alternative variations
    if (aspectRatio === '9:16' || p.includes('story') || p.includes('tiktok') || p.includes('reel')) {
      if (count % 2 === 1) {
        return {
          composition: '9:16 vertical story framing, dynamic off-center hero subject with clear top/bottom safe zones',
          cameraAngle: 'Slightly high-angle vertical perspective',
          framing: 'Vertical 9:16 framing, focal subject positioned in central-upper grid',
          lighting: 'Vibrant soft studio lighting with colorful edge rim light',
        };
      }
      return {
        composition: 'Vertical 9:16 portrait ratio, centered hero subject with top and bottom safe zones',
        cameraAngle: 'Eye-level portrait angle',
        framing: 'Vertical framing, subject occupying central 60% of frame',
        lighting: 'Clean directional daylight key light with subtle ambient fill',
      };
    }

    if (aspectRatio === '16:9' || p.includes('youtube') || p.includes('twitter') || p.includes('x')) {
      if (count % 2 === 1) {
        return {
          composition: '16:9 widescreen editorial layout, asymmetrical golden ratio focal placement',
          cameraAngle: 'Eye-level architectural perspective',
          framing: 'Wide environmental portrait with shallow depth of field',
          lighting: 'Bright natural morning daylight filtering through floor-to-ceiling glass',
        };
      }
      return {
        composition: 'Widescreen 16:9 modern editorial landscape ratio, rule-of-thirds focal placement',
        cameraAngle: 'Slight low-angle hero framing for strong executive presence',
        framing: 'Medium wide shot with sharp subject focus and soft background detail',
        lighting: 'Bright balanced daylight studio lighting',
      };
    }

    if (aspectRatio === '4:5' || p.includes('instagram')) {
      if (count % 2 === 1) {
        return {
          composition: '4:5 vertical feed ratio, rule-of-thirds subject placement with elegant negative space',
          cameraAngle: 'Slightly elevated 45-degree angle looking into the scene',
          framing: 'Medium close-up portrait framing with crisp focal detail',
          lighting: 'Diffused bright window daylight with warm soft shadows',
        };
      }
      return {
        composition: '4:5 vertical feed ratio, balanced subject isolation with clean margins',
        cameraAngle: 'Direct eye-level perspective',
        framing: 'Medium portrait framing',
        lighting: 'Soft diffused natural daylight',
      };
    }

    // Default 1:1 Square
    if (count % 2 === 1) {
      return {
        composition: '1:1 square ratio, diagonal dynamic composition with clean background margins',
        cameraAngle: 'Direct eye-level professional studio perspective',
        framing: 'Medium close-up shot with layered foreground detail',
        lighting: 'High-key studio lighting with vibrant fill',
      };
    }

    return {
      composition: '1:1 square ratio, symmetrical centered composition with clean framing',
      cameraAngle: 'Eye-level professional studio perspective',
      framing: 'Medium close-up shot',
      lighting: 'Clean studio soft-box lighting',
    };
  }
}
