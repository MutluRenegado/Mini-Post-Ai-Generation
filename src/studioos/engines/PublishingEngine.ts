import { Publisher } from '@/studio/publishing/Publisher';
import { PublishingDispatchService } from '@/lib/services/publishingDispatchService';

export class StudioPublishingEngine {
  static async dispatchMultiPlatform(platforms: string[], contentMap: Record<string, string>) {
    return await Publisher.publishMultiPlatform(platforms, contentMap);
  }

  static async dispatchSinglePost(payload: any) {
    return await PublishingDispatchService.dispatchPost(payload);
  }
}
