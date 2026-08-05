import { StudioClientService } from '@/lib/services/studioClientService';

export class HashtagEngineService {
  static async getHashtagsForTopic(topic: string) {
    const response = await StudioClientService.generate({
      action: 'generate_hashtags',
      topic,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Hashtag AI generation failed.');
    }

    const hashtags = response.data.hashtags || [];
    const third = Math.ceil(hashtags.length / 3);

    return {
      trending: hashtags.slice(0, third),
      industry: hashtags.slice(third, third * 2),
      local: hashtags.slice(third * 2, third * 2 + 2),
      longTail: hashtags.slice(third * 2 + 2),
    };
  }
}
