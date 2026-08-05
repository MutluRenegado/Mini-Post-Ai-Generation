import { IStudio, StudioCategory } from '../interfaces/StudioOS.types';
import { StudioLogger } from '../utils/StudioLogger';

export class StudioRegistry {
  private static studios: Map<string, IStudio> = new Map();

  static register(studio: IStudio): void {
    if (this.studios.has(studio.metadata.id)) {
      StudioLogger.warn('StudioRegistry', `Overwriting studio registration for ID: ${studio.metadata.id}`);
    }
    this.studios.set(studio.metadata.id, studio);
    StudioLogger.info('StudioRegistry', `Registered studio: ${studio.metadata.name} (${studio.metadata.id})`);
  }

  static get(id: string): IStudio | undefined {
    return this.studios.get(id);
  }

  static listAll(): IStudio[] {
    return Array.from(this.studios.values());
  }

  static listByCategory(category: StudioCategory): IStudio[] {
    return this.listAll().filter((s) => s.metadata.category === category);
  }

  static clear(): void {
    this.studios.clear();
  }
}
