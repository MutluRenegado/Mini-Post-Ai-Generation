import { ImageMakerLearningRecord } from '../types/image-learning.types';
import { ImageMakerLearningRecordSchema } from '../schemas/image-learning.schema';

export class ImageMakerLearningService {
  private static store: ImageMakerLearningRecord[] = [];

  public static recordSessionOutcome(record: Omit<ImageMakerLearningRecord, 'id' | 'timestamp'>): ImageMakerLearningRecord {
    const fullRecord: ImageMakerLearningRecord = {
      ...record,
      id: `lrn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };

    ImageMakerLearningRecordSchema.parse(fullRecord);
    this.store.push(fullRecord);
    return fullRecord;
  }

  public static getOwnerRecords(ownerId: string): ImageMakerLearningRecord[] {
    return this.store.filter((r) => r.ownerId === ownerId);
  }

  public static softDeleteOwnerRecords(ownerId: string): number {
    const initialLen = this.store.length;
    this.store = this.store.filter((r) => r.ownerId !== ownerId);
    return initialLen - this.store.length;
  }
}
