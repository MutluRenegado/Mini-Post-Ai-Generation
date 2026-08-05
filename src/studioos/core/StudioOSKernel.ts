import { StudioRegistry } from '../registry/StudioRegistry';
import { IStudio, StudioContext } from '../interfaces/StudioOS.types';
import { StudioLogger } from '../utils/StudioLogger';

export class StudioOSKernel {
  private static isInitialized = false;

  static async initialize(context?: StudioContext): Promise<void> {
    if (this.isInitialized) return;
    StudioLogger.info('StudioOSKernel', 'Initializing StudioOS Kernel...');
    this.isInitialized = true;
  }

  static getStudio(id: string): IStudio | undefined {
    return StudioRegistry.get(id);
  }

  static getRegisteredStudios(): IStudio[] {
    return StudioRegistry.listAll();
  }
}
