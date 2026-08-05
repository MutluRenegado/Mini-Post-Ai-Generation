import { AIContext, ImagePrompt, StudioPlatform } from '../models/ai.types';

/**
 * ImagePromptBuilder — Replaces ALL generic image prompt templates.
 *
 * Generates cinematic, Midjourney/Flux/GPT-Image-quality prompts by composing
 * structured photographic & illustrative descriptors from the AI context.
 * The result is ready to pass directly to Pollinations, Flux, or DALL-E.
 */
export class ImagePromptBuilder {
  static build(context: AIContext, platform: StudioPlatform): ImagePrompt {
    const { request, topicProfile, toneConfig } = context;
    const topic = topicProfile.mainTopic;
    const industry = topicProfile.industry;
    const tone = request.tone;

    const subject = this.buildSubject(topic, industry, topicProfile.contentType);
    const environment = this.buildEnvironment(topic, industry, platform);
    const composition = this.buildComposition(platform);
    const lighting = this.buildLighting(tone, topicProfile.contentType);
    const camera = this.buildCamera(platform, topicProfile.contentType);
    const lens = this.buildLens(platform);
    const mood = this.buildMood(tone, toneConfig.ctaStyle);
    const colorPalette = this.buildColorPalette(tone, industry);
    const style = this.buildStyle(platform, topicProfile.contentType, tone);
    const qualityTags = this.buildQualityTags(platform);
    const negativePrompt = this.buildNegativePrompt();

    const assembled = [
      subject,
      environment + '.',
      composition + '.',
      lighting + ' lighting.',
      `Shot on ${camera} with ${lens} lens.`,
      `${mood} mood.`,
      `${colorPalette} color palette.`,
      style + '.',
      qualityTags.join(', ') + '.',
      `Negative: ${negativePrompt}.`,
    ].join(' ');

    return { platform, subject, environment, composition, lighting, camera, lens, mood, colorPalette, style, qualityTags, negativePrompt, assembled };
  }

  // ── Subject ───────────────────────────────────────────────────────────────

  private static buildSubject(topic: string, industry: string, contentType: string): string {
    const subjectMap: Record<string, Record<string, string>> = {
      'Logistics': {
        default: `Photorealistic international cargo port terminal featuring a professional customs officer reviewing import documentation beside stacked shipping containers. A freight forwarder uses a digital tablet with real-time shipment tracking data visible on screen.`,
        'Educational': `Detailed illustration of a modern customs inspection process inside an international freight terminal, showing a uniformed customs officer scanning barcodes on cargo pallets while digital manifest screens display HS code classifications.`,
      },
      'Technology': {
        default: `Cinematic shot of a modern tech workspace: a software engineer reviews clean, glowing code on multiple ultra-wide monitors surrounded by subtle LED ambiance. AI visualization holographs float nearby showing neural network connections.`,
        'Educational': `Ultra-detailed isometric illustration of an enterprise AI architecture: servers, data pipelines, neural network nodes, and API connectors shown as a living digital ecosystem.`,
      },
      'Marketing': {
        default: `Professional marketing strategist in a sleek modern office reviews campaign performance dashboards showing soaring conversion graphs. Multiple screens display social media analytics and brand asset grids.`,
        'Promotional': `High-energy product launch scene: spotlight on hero product against a gradient brand-colored backdrop with confetti and social media notification icons floating around it.`,
      },
      'Finance': {
        default: `Executive financial analyst in a glass-walled boardroom reviews holographic market data charts. Stock tickers, investment portfolios, and real-time global market feeds are visible on large displays behind them.`,
      },
      'E-Commerce': {
        default: `Clean flatlay product photography: premium product centered on a neutral surface with carefully arranged lifestyle props, soft natural light, and branded packaging elements visible.`,
      },
      'Healthcare': {
        default: `Modern medical professional in a clean clinical environment reviews patient data on a tablet. Bokeh background shows state-of-the-art medical equipment in a bright, hygienic setting.`,
      },
      'Education': {
        default: `Engaged student or professional in a modern learning environment surrounded by books, a laptop showing course content, and growth charts. Warm inspiring light filters through large windows.`,
      },
      'General Business': {
        default: `Confident business professional in a premium modern office setting reviews strategic growth charts. Minimalist desk setup with a laptop, coffee, and branded materials. Corporate but human.`,
      },
    };

    const industryMap = subjectMap[industry] || subjectMap['General Business'];
    return industryMap[contentType] || industryMap['default'] || `Professional, visually striking representation of ${topic} in a realistic business environment.`;
  }

  // ── Environment ───────────────────────────────────────────────────────────

  private static buildEnvironment(topic: string, industry: string, platform: StudioPlatform): string {
    const pLower = platform.toLowerCase();
    if (pLower.includes('instagram') || pLower.includes('pinterest')) {
      return 'Beautifully styled environment with intentional depth of field, brand-consistent background, and premium lifestyle aesthetic';
    }
    if (pLower.includes('tiktok') || pLower.includes('story')) {
      return 'Vertical 9:16 composition with dynamic, eye-catching background optimized for mobile full-screen viewing';
    }
    if (pLower.includes('linkedin')) {
      return 'Professional corporate environment: glass-walled conference room, executive office, or modern open-plan workspace';
    }
    const envMap: Record<string, string> = {
      'Logistics': 'International cargo port, customs inspection hall, or logistics operations center with global freight activity',
      'Technology': 'State-of-the-art tech campus, server room with glowing rack units, or modern developer workspace',
      'Finance': 'Glass-walled financial district office or stock exchange trading floor',
      'Marketing': 'Creative agency open office with campaign boards, brand materials, and collaboration spaces',
    };
    return envMap[industry] || 'Premium professional environment with clean lines, sophisticated design, and purposeful lighting';
  }

  // ── Composition ───────────────────────────────────────────────────────────

  private static buildComposition(platform: StudioPlatform): string {
    const pLower = platform.toLowerCase();
    if (pLower.includes('story') || pLower.includes('tiktok')) return 'Vertical 9:16 aspect ratio, rule-of-thirds composition, strong foreground subject';
    if (pLower.includes('instagram feed') || pLower.includes('pinterest')) return 'Square or 4:5 portrait composition, centered hero subject, balanced negative space';
    if (pLower.includes('youtube')) return 'Widescreen 16:9 cinematic composition, broadcast-grade framing';
    return 'Horizontal 16:9 or 4:3 composition, professional editorial framing, clear visual hierarchy';
  }

  // ── Lighting ──────────────────────────────────────────────────────────────

  private static buildLighting(tone: string, contentType: string): string {
    const lightingMap: Record<string, string> = {
      'Luxury': 'Soft tungsten rim lighting with deep shadows creating dramatic chiaroscuro',
      'Corporate': 'Clean, soft-box studio lighting with even exposure and no harsh shadows',
      'Bold': 'Dramatic side-lighting with high contrast and strong shadows',
      'Inspirational': 'Golden-hour warm sunburst rays with lens flare and soft bokeh',
      'Friendly': 'Soft, warm natural daylight with gentle diffusion and inviting glow',
      'Educational': 'Neutral, bright, even ambient lighting for maximum clarity and readability',
      'Technical': 'Cool blue-white monitor glow mixed with controlled ambient LED lighting',
      'Funny': 'Bright, punchy, high-saturation studio lighting',
      'Casual': 'Natural lifestyle lighting, window light, soft shadows',
      'Professional': 'Golden-hour cinematic lighting with soft directional warmth',
      'Minimal': 'Minimalist high-key lighting: pure whites and precise shadows',
    };
    return lightingMap[tone] || 'Professional cinematic golden-hour lighting with soft directional warmth';
  }

  // ── Camera & Lens ─────────────────────────────────────────────────────────

  private static buildCamera(platform: StudioPlatform, contentType: string): string {
    const pLower = platform.toLowerCase();
    if (pLower.includes('tiktok') || pLower.includes('story')) return 'iPhone 15 Pro cinematic mode or Sony FX3 vertical';
    if (pLower.includes('linkedin') || pLower.includes('facebook')) return 'Sony A7R V or Canon EOS R5';
    if (pLower.includes('youtube')) return 'Sony FX6 or ARRI Alexa Mini';
    if (pLower.includes('instagram') || pLower.includes('pinterest')) return 'Hasselblad X2D or Fujifilm GFX 100S';
    return 'Sony A7R V with L-mount prime lens system';
  }

  private static buildLens(platform: StudioPlatform): string {
    const pLower = platform.toLowerCase();
    if (pLower.includes('portrait') || pLower.includes('instagram')) return '85mm f/1.4 portrait lens, shallow depth of field';
    if (pLower.includes('tiktok') || pLower.includes('story')) return '24mm wide-angle, full scene capture';
    if (pLower.includes('linkedin')) return '35mm f/2.0 with moderate depth of field';
    return '35mm f/1.8, shallow depth of field, subject isolation';
  }

  // ── Mood, Color & Style ───────────────────────────────────────────────────

  private static buildMood(tone: string, ctaStyle: string): string {
    const moodMap: Record<string, string> = {
      'Professional': 'Confident, authoritative, trust-inspiring',
      'Friendly': 'Warm, welcoming, optimistic',
      'Corporate': 'Serious, structured, credible',
      'Luxury': 'Exclusive, sophisticated, aspirational',
      'Casual': 'Relaxed, authentic, approachable',
      'Educational': 'Curious, informative, clarity-driven',
      'Funny': 'Playful, energetic, lighthearted',
      'Bold': 'Intense, powerful, dramatic',
      'Inspirational': 'Uplifting, hopeful, energizing',
      'Technical': 'Precise, intelligent, focused',
      'Minimal': 'Clean, contemplative, refined',
    };
    return moodMap[tone] || 'Professional and inspiring';
  }

  private static buildColorPalette(tone: string, industry: string): string {
    const paletteMap: Record<string, string> = {
      'Luxury': 'Deep navy, champagne gold, and ivory white',
      'Corporate': 'Steel blue, charcoal grey, and crisp white',
      'Bold': 'High-contrast black, electric red or electric blue accent',
      'Inspirational': 'Warm amber, sunset coral, and sky blue',
      'Friendly': 'Soft teal, warm cream, and sage green',
      'Technical': 'Dark mode purple-black with electric cyan accents',
      'Minimal': 'Monochromatic white-grey scale with one strategic accent color',
      'Casual': 'Warm earth tones with vibrant accent pops',
    };
    const industryPalette: Record<string, string> = {
      'Logistics': 'Industrial blue, orange safety accent, and silver metallic',
      'Finance': 'Deep green, gold, and charcoal',
      'Healthcare': 'Clinical white, healing teal, and trust blue',
      'Technology': 'Deep space black, electric blue, and neon cyan',
    };
    return industryPalette[industry] || paletteMap[tone] || 'Professional blue, crisp white, and strategic accent color';
  }

  private static buildStyle(platform: StudioPlatform, contentType: string, tone: string): string {
    const pLower = platform.toLowerCase();
    if (pLower.includes('instagram') || pLower.includes('pinterest')) return 'Commercial editorial photography, fashion-magazine quality, premium lifestyle aesthetic';
    if (pLower.includes('tiktok') || pLower.includes('story')) return 'Vertical social media native format, Gen-Z aesthetic, dynamic and bold';
    if (pLower.includes('linkedin')) return 'Professional editorial photography, business publication quality, Forbes or HBR visual standard';
    if (tone === 'Luxury') return 'Ultra-luxury advertising campaign photography, Vogue or Architectural Digest visual quality';
    if (contentType === 'Educational') return 'Clean editorial infographic style, Bloomberg or Economist visual quality';
    return 'Ultra-realistic commercial photography, editorial quality, advertising campaign standard';
  }

  // ── Quality & Negative ────────────────────────────────────────────────────

  private static buildQualityTags(platform: StudioPlatform): string[] {
    return ['ultra-detailed', '8K resolution', 'photorealistic', 'sharp focus', 'high dynamic range', 'professional color grading', 'award-winning photography'];
  }

  private static buildNegativePrompt(): string {
    return 'watermark, text overlay, logo, low resolution, blurry, pixelated, oversaturated, cartoon, clip art, stock photo clichés, generic office photo, people looking at camera awkwardly, fake smiles, distorted anatomy, extra limbs, low quality, amateur photography';
  }
}
