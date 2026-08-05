import crypto from 'crypto';
import { MaterialTextureDecision, SurfaceSpec, MaterialCategory } from './material-texture.types';

export class MaterialTextureEngine {
  public static resolve(input: {
    domain?: string;
    topic?: string;
    content?: string;
    environment?: string;
  }): MaterialTextureDecision {
    const text = `${input.domain || ''} ${input.topic || ''} ${input.content || ''} ${input.environment || ''}`.toLowerCase();

    let primaryMaterial: MaterialCategory = 'smooth_composite';
    let textureDesc = 'Smooth matte satin finish composite laminate';
    let reflectivity = 15;
    let roughness = 0.2;
    let translucency = 'Opaque solid surface with anti-reflective coating';
    let wearState: 'pristine_factory' | 'subtle_patina' | 'industrial_weathered' = 'pristine_factory';
    let envResponse = 'Clean dry indoor ambient reflection';

    if (text.includes('solar') || text.includes('photovoltaic') || text.includes('renewable')) {
      primaryMaterial = 'photovoltaic_silicon';
      textureDesc = 'Dark anti-reflective photovoltaic silicon glass grid texture';
      reflectivity = 65;
      roughness = 0.05;
      translucency = 'Semi-translucent tempered glass over dark monocrystalline silicon';
      envResponse = 'Direct sunlight glint and sky ambient reflection';
    } else if (text.includes('cybersecurity') || text.includes('glass') || text.includes('hud') || text.includes('screen')) {
      primaryMaterial = 'polished_glass';
      textureDesc = 'Illuminated anti-reflective smart glass console interface';
      reflectivity = 75;
      roughness = 0.02;
      translucency = 'Frosted semi-transparent display partition';
      envResponse = 'Edge-lit LED telemetry glow diffusion';
    } else if (text.includes('factory') || text.includes('machinery') || text.includes('metal') || text.includes('steel')) {
      primaryMaterial = 'brushed_metal';
      textureDesc = 'Anodized brushed aluminum and structural stainless steel';
      reflectivity = 40;
      roughness = 0.35;
      wearState = 'subtle_patina';
      envResponse = 'High-bay overhead light specular highlights';
    } else if (text.includes('executive') || text.includes('wood') || text.includes('office')) {
      primaryMaterial = 'natural_wood';
      textureDesc = 'Rich natural walnut grain with satin lacquer finish';
      reflectivity = 25;
      roughness = 0.25;
      envResponse = 'Warm ambient interior window light reflection';
    }

    const primarySurface: SurfaceSpec = {
      material: primaryMaterial,
      textureDescription: textureDesc,
      reflectivityPercentage: reflectivity,
      roughnessIndex: roughness,
      translucency,
      surfaceWearState: wearState,
      environmentalResponse: envResponse,
    };

    const secondarySurfaces: SurfaceSpec[] = [
      {
        material: 'polished_glass',
        textureDescription: 'Clear double-glazed interior architectural glass partition',
        reflectivityPercentage: 50,
        roughnessIndex: 0.05,
        translucency: 'High optical transparency',
        surfaceWearState: 'pristine_factory',
        environmentalResponse: 'Subtle environmental reflection of distant workspace lights',
      },
    ];

    const contradictionWarnings: string[] = [];
    if (primaryMaterial === 'photovoltaic_silicon' && text.includes('liquid metal fluid flowing')) {
      contradictionWarnings.push('Contradictory material instruction: Solid silicon solar panel cannot behave as liquid metal unless surreal is specified.');
    }

    const isPhysicallyCoherent = contradictionWarnings.length === 0;

    const payload = `${primaryMaterial}|${reflectivity}|${roughness}|${wearState}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      primarySurface,
      secondarySurfaces,
      brandProductMaterialConsistency: 'High-fidelity material representation matching physical domain standards',
      isPhysicallyCoherent,
      contradictionWarnings: isPhysicallyCoherent ? undefined : contradictionWarnings,
      deterministicFingerprint,
    };
  }
}
