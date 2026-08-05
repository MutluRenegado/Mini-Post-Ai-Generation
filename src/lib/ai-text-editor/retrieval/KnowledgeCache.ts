import { RetrievalResult } from '../models/ai.types';

export class KnowledgeCache {
  private static cache: Map<string, RetrievalResult> = new Map();

  static get(topic: string): RetrievalResult | undefined {
    const key = topic.toLowerCase().trim();
    return this.cache.get(key);
  }

  static set(topic: string, result: RetrievalResult): void {
    const key = topic.toLowerCase().trim();
    this.cache.set(key, result);
  }

  static clear(): void {
    this.cache.clear();
  }
}
