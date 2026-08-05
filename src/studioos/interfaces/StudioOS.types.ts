export type StudioCategory =
  | 'creator'
  | 'fast_creator'
  | 'publishing'
  | 'workflow'
  | 'brand'
  | 'analytics'
  | 'billing'
  | 'platform';

export interface StudioMetadata {
  id: string;
  name: string;
  description: string;
  category: StudioCategory;
  version: string;
  icon?: string;
  platformId?: string;
}

export interface StudioContext {
  userId?: string;
  workspaceId?: string;
  activeBrandId?: string;
  activePlatform?: string;
}

export interface IStudio {
  metadata: StudioMetadata;
  initialize(context?: StudioContext): Promise<void>;
  render(): React.ReactNode;
}

export interface IStudioEngine {
  id: string;
  name: string;
  version: string;
}
