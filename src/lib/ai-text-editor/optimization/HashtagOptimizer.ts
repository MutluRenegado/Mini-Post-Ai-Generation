export class HashtagOptimizer {
  static optimize(hashtags: string[], platform: string): string[] {
    const pLower = platform.toLowerCase();
    if (pLower.includes('google')) return []; // No hashtags on Google Business
    if (pLower.includes('twitter') || pLower.includes('x')) return hashtags.slice(0, 2);
    if (pLower.includes('linkedin')) return hashtags.slice(0, 5);
    if (pLower.includes('instagram')) return hashtags.slice(0, 10);
    return hashtags.slice(0, 5);
  }
}
