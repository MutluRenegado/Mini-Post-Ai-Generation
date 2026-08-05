import { IStudio, StudioMetadata, StudioContext } from '../interfaces/StudioOS.types';

export abstract class StudioBase implements IStudio {
  abstract metadata: StudioMetadata;

  async initialize(context?: StudioContext): Promise<void> {
    // Default initialization lifecycle hook
  }

  abstract render(): React.ReactNode;
}
