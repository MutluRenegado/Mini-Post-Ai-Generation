import crypto from 'crypto';
import { CameraViewpointDecision, ShotType, CameraDistance, ViewpointType, LensCharacteristic, FocalEmphasis } from './camera-viewpoint.types';

export class CameraViewpointEngine {
  public static resolve(input: {
    domain?: string;
    topic?: string;
    content?: string;
    platform?: string;
    primarySubject?: string;
    environment?: string;
  }): CameraViewpointDecision {
    const text = `${input.topic || ''} ${input.content || ''} ${input.primarySubject || ''} ${input.domain || ''}`.toLowerCase();
    const platform = (input.platform || 'linkedin').toLowerCase();

    let shotType: ShotType = 'medium_shot';
    let cameraDistance: CameraDistance = 'medium';
    let viewpoint: ViewpointType = 'eye_level';
    let lensCharacteristic: LensCharacteristic = 'standard_prime_35mm';
    let cameraHeight = 'Eye level (1.6m)';
    let cameraAngle = 'Level horizontal 0 degrees';
    let focalEmphasis: FocalEmphasis = 'shallow_depth_of_field';
    let depthOfFieldIntent = 'f/2.8 soft background blur focusing on subject';
    let rationale = 'Default professional eye-level medium shot for engagement.';

    if (text.includes('macro') || text.includes('detail') || text.includes('close-up') || text.includes('microchip') || text.includes('texture')) {
      shotType = 'macro';
      cameraDistance = 'macro';
      viewpoint = 'eye_level';
      lensCharacteristic = 'macro_100mm';
      cameraHeight = 'Subject level (0.5m)';
      focalEmphasis = 'sharp_subject_only';
      depthOfFieldIntent = 'f/4.0 razor thin depth of field on micro details';
      rationale = 'Macro detail perspective selected for intricate subject focus.';
    } else if (text.includes('architecture') || text.includes('landscape') || text.includes('facility') || text.includes('factory') || text.includes('solar farm') || text.includes('skyline')) {
      shotType = 'wide_shot';
      cameraDistance = 'long_shot';
      viewpoint = 'high_angle';
      lensCharacteristic = 'wide_angle_24mm';
      cameraHeight = 'Elevated vantage (3m)';
      focalEmphasis = 'deep_focus';
      depthOfFieldIntent = 'f/8.0 deep focus showing environmental scale';
      rationale = 'Wide elevated perspective selected to capture spatial architecture.';
    } else if (text.includes('drone') || text.includes('aerial') || text.includes('over-head') || text.includes('bird')) {
      shotType = 'aerial_drone';
      cameraDistance = 'extreme_long_shot';
      viewpoint = 'birds_eye';
      lensCharacteristic = 'wide_angle_24mm';
      cameraHeight = 'High aerial drone (30m)';
      focalEmphasis = 'deep_focus';
      depthOfFieldIntent = 'f/5.6 sharp aerial panorama focus';
      rationale = 'Aerial bird-eye drone perspective selected for macro scale view.';
    } else if (text.includes('executive') || text.includes('portrait') || text.includes('doctor') || text.includes('engineer') || text.includes('person')) {
      shotType = 'medium_close_up';
      cameraDistance = 'close_up';
      viewpoint = 'eye_level';
      lensCharacteristic = 'portrait_85mm';
      cameraHeight = 'Eye level (1.65m)';
      focalEmphasis = 'shallow_depth_of_field';
      depthOfFieldIntent = 'f/1.8 creamy bokeh background separation for human subject';
      rationale = '85mm portrait camera setup selected for human subject focus.';
    }

    let platformFraming = '1:1 Square safe zone with center subject framing';
    if (platform.includes('story') || platform.includes('reel') || platform.includes('tiktok')) {
      platformFraming = '9:16 Vertical frame with top/bottom overlay clearance zones';
    } else if (platform.includes('linkedin') || platform.includes('facebook')) {
      platformFraming = '1.91:1 Horizontal ratio with protected central square crop area';
    } else if (platform.includes('x') || platform.includes('twitter')) {
      platformFraming = '16:9 Wide ratio with 15% edge margin safe zone';
    }

    const contradictionWarnings: string[] = [];
    if (shotType === 'macro' && (cameraDistance === 'extreme_long_shot' || cameraDistance === 'long_shot')) {
      contradictionWarnings.push('Contradictory camera instruction: Macro lens cannot be combined with extreme long shot.');
    }
    if (viewpoint === 'birds_eye' && (shotType as string) === 'close_up') {
      contradictionWarnings.push('Contradictory camera instruction: Direct top-down bird-eye view conflicts with eye-level close-up.');
    }

    const isPhysicallyCoherent = contradictionWarnings.length === 0;

    const payload = `${shotType}|${cameraDistance}|${viewpoint}|${lensCharacteristic}|${cameraHeight}|${focalEmphasis}|${platformFraming}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      shotType,
      cameraDistance,
      viewpoint,
      lensCharacteristic,
      cameraHeight,
      cameraAngle,
      focalEmphasis,
      depthOfFieldIntent,
      platformFraming,
      rationale,
      isPhysicallyCoherent,
      contradictionWarnings: isPhysicallyCoherent ? undefined : contradictionWarnings,
      deterministicFingerprint,
    };
  }
}
