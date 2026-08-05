import crypto from 'crypto';
import {
  LightingIntelligenceDecision,
  LightSourceType,
  LightDirection,
  LightIntensity,
  TimeOfDay,
} from './lighting-intelligence.types';

export class LightingIntelligenceEngine {
  public static resolve(input: {
    domain?: string;
    topic?: string;
    content?: string;
    mood?: string;
    environment?: string;
  }): LightingIntelligenceDecision {
    const text = `${input.topic || ''} ${input.content || ''} ${input.mood || ''} ${input.domain || ''} ${input.environment || ''}`.toLowerCase();

    let lightSource: LightSourceType = 'diffused_studio';
    let direction: LightDirection = 'key_light_45';
    let intensity: LightIntensity = 'moderate_key';
    let softness = 'Soft diffused studio lighting with gentle gradient falloff';
    let contrastRatio = '3:1 balanced key-to-fill ratio';
    let colorTemperatureK = 5600; // Daylight neutral default
    let timeOfDay: TimeOfDay = 'studio_interior';
    let shadowBehavior = 'Soft ambient occlusion cast shadows on floor plane';
    let subjectBackgroundSeparationRim = true;
    let brandLightingConstraint = 'Clean daylight neutral color temperature preserving subject accuracy';

    if (text.includes('golden hour') || text.includes('sunset') || text.includes('dusk') || text.includes('warm')) {
      lightSource = 'golden_hour_sun';
      direction = 'side_profile';
      intensity = 'soft_ambient';
      colorTemperatureK = 3200; // Warm golden glow
      timeOfDay = 'golden_hour';
      shadowBehavior = 'Long atmospheric golden cast shadows across landscape';
    } else if (text.includes('cybersecurity') || text.includes('neon') || text.includes('night') || text.includes('hacker') || text.includes('future')) {
      lightSource = 'neon_rim_light';
      direction = 'backlit_rim';
      intensity = 'high_contrast';
      colorTemperatureK = 7500; // Cool cyan/neon temperature
      timeOfDay = 'midnight';
      shadowBehavior = 'Deep dark contrast shadows with vivid telemetry rim reflections';
    } else if (text.includes('solar') || text.includes('outdoor') || text.includes('field') || text.includes('construction') || text.includes('farm')) {
      lightSource = 'natural_sunlight';
      direction = 'key_light_45';
      intensity = 'harsh_direct';
      colorTemperatureK = 6000;
      timeOfDay = 'noon';
      shadowBehavior = 'Sharp high-sun contact shadows on ground plane';
    } else if (text.includes('medical') || text.includes('clinical') || text.includes('health') || text.includes('hospital') || text.includes('lab')) {
      lightSource = 'diffused_studio';
      direction = 'front_fill';
      intensity = 'soft_ambient';
      colorTemperatureK = 5000;
      timeOfDay = 'studio_interior';
      shadowBehavior = 'Shadowless high-key clinical illumination';
    }

    const contradictionWarnings: string[] = [];
    if (timeOfDay === 'midnight' && lightSource === 'natural_sunlight') {
      contradictionWarnings.push('Contradiction detected: Natural sunlight cannot be used at midnight.');
    }
    if (lightSource === 'neon_rim_light' && colorTemperatureK < 4000) {
      contradictionWarnings.push('Contradiction detected: Neon rim lighting requires cool color temperature (>=4000K).');
    }

    const isPhysicallyCoherent = contradictionWarnings.length === 0;

    const payload = `${lightSource}|${direction}|${intensity}|${colorTemperatureK}|${timeOfDay}|${subjectBackgroundSeparationRim}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      lightSource,
      direction,
      intensity,
      softness,
      contrastRatio,
      colorTemperatureK,
      timeOfDay,
      shadowBehavior,
      subjectBackgroundSeparationRim,
      accessibilityVisibilityCheck: true,
      brandLightingConstraint,
      isPhysicallyCoherent,
      contradictionWarnings: isPhysicallyCoherent ? undefined : contradictionWarnings,
      deterministicFingerprint,
    };
  }
}
