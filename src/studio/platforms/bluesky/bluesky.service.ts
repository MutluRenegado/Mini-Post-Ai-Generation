'use client';

export class BlueskyPlatformService {
  static getMetrics() {
    return {
      followers: '8,450',
      reposts: '1,240',
      likes: '6,800',
      engagementRate: '9.2%',
    };
  }

  static generateSkeet(topic: string) {
    return {
      text: `🚀 Quick thought on ${topic}: Decentralized protocols and open standards are shaping the future of digital content. What are your thoughts? #ATProtocol`,
      charCount: 154,
    };
  }
}
