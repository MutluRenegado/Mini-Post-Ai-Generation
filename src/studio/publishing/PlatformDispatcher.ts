export interface DispatchResult {
  platform: string;
  success: boolean;
  publishedUrl?: string;
  error?: string;
}

export class PlatformDispatcher {
  static async dispatch(platform: string, content: string): Promise<DispatchResult> {
    return {
      platform,
      success: true,
      publishedUrl: `https://${platform.toLowerCase().replace(/[^a-z]/g, '')}.com/post/${Date.now()}`,
    };
  }
}
