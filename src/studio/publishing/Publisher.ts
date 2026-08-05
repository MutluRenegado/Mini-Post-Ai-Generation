import { PlatformDispatcher, DispatchResult } from './PlatformDispatcher';

export class Publisher {
  static async publishMultiPlatform(
    platforms: string[],
    contentMap: Record<string, string>
  ): Promise<DispatchResult[]> {
    const results: DispatchResult[] = [];
    for (const p of platforms) {
      const text = contentMap[p] || contentMap.default || 'Published from StudioOS';
      const res = await PlatformDispatcher.dispatch(p, text);
      results.push(res);
    }
    return results;
  }
}
