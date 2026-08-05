import { PlatformId } from '../types/studio.types';

export class PreviewStudioService {
  static getSupportedPlatforms(): { id: PlatformId; name: string; iconName: string }[] {
    return [
      { id: 'instagram', name: 'Instagram', iconName: 'Instagram' },
      { id: 'facebook', name: 'Facebook', iconName: 'Facebook' },
      { id: 'linkedin', name: 'LinkedIn', iconName: 'Linkedin' },
      { id: 'twitter', name: 'X / Twitter', iconName: 'Twitter' },
      { id: 'threads', name: 'Threads', iconName: 'AtSign' },
      { id: 'pinterest', name: 'Pinterest', iconName: 'Pin' },
      { id: 'tiktok', name: 'TikTok', iconName: 'Video' },
      { id: 'google_business', name: 'Google Business', iconName: 'Store' },
    ];
  }
}
