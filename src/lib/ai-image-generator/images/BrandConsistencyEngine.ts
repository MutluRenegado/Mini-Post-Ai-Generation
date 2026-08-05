import crypto from 'crypto';
import { BrandConsistencyDecision, UserBrandKit } from './brand-consistency.types';

export class BrandConsistencyEngine {
  public static resolve(input: {
    userBrandKit?: UserBrandKit;
    domain?: string;
  }): BrandConsistencyDecision {
    let brandKitActive = false;
    let fallbackUsed = true;
    let miniPostAppBrandingInjected = false;

    let primary = '#0F172A'; // Neutral slate
    let secondary = '#0284C7'; // Neutral sky blue
    let accent = '#38BDF8'; // Neutral accent cyan
    let typographyStyle = 'Neutral sans-serif corporate typeface';
    let toneAlignment = 'Neutral professional editorial aesthetic';
    let prohibitedTreatmentsFiltered: string[] = ['generic stock look', 'distorted text'];

    if (input.userBrandKit && input.userBrandKit.primaryColorHex) {
      brandKitActive = true;
      fallbackUsed = false;
      primary = input.userBrandKit.primaryColorHex;
      secondary = input.userBrandKit.secondaryColorHex || '#0284C7';
      accent = input.userBrandKit.accentColorHex || '#38BDF8';
      typographyStyle = input.userBrandKit.fontFamily || 'Brand identity font';
      toneAlignment = input.userBrandKit.toneVoice || 'Brand specific voice alignment';

      if (input.userBrandKit.prohibitedTreatments) {
        prohibitedTreatmentsFiltered.push(...input.userBrandKit.prohibitedTreatments);
      }
    }

    const payload = `${brandKitActive}|${primary}|${secondary}|${accent}|${miniPostAppBrandingInjected}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      brandKitActive,
      resolvedColors: {
        primary,
        secondary,
        accent,
      },
      typographyStyle,
      toneAlignment,
      prohibitedTreatmentsFiltered,
      fallbackUsed,
      miniPostAppBrandingInjected, // Strict safeguard: false unless user kit explicitly specifies it
      deterministicFingerprint,
    };
  }
}
