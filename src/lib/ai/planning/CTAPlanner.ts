import { AudienceProfile, StudioPlatform, CTAVariant, StudioGoal } from '../models/ai.types';

export class CTAPlanner {
  static planForPlatform(platform: StudioPlatform, audience: AudienceProfile, goal: StudioGoal, customCTA?: string): CTAVariant {
    if (customCTA) {
      return {
        platform,
        text: customCTA,
        type: 'link',
        urgency: 'soft'
      };
    }

    const map: Record<string, CTAVariant> = {
      'LinkedIn': {
        platform: 'LinkedIn',
        text: 'What has been your experience with this? Let\'s discuss in the comments.',
        type: 'comment',
        urgency: 'soft'
      },
      'Twitter (X)': {
        platform: 'Twitter (X)',
        text: 'Found this helpful? Repost to share with your network.',
        type: 'share',
        urgency: 'soft'
      },
      'Instagram Feed': {
        platform: 'Instagram Feed',
        text: 'Save this post for later and tap follow for daily strategy tips!',
        type: 'save',
        urgency: 'soft'
      },
      'TikTok': {
        platform: 'TikTok',
        text: 'Comment your thoughts below and hit follow for more!',
        type: 'comment',
        urgency: 'strong'
      },
      'YouTube': {
        platform: 'YouTube',
        text: 'Subscribe to the channel for in-depth guides every week.',
        type: 'subscribe',
        urgency: 'strong'
      }
    };

    return map[platform] || {
      platform,
      text: audience.preferredCTA || 'Share your thoughts below!',
      type: 'comment',
      urgency: 'soft'
    };
  }
}
