import type { VisualStory } from './VisualStory';

export interface ImageScene {
  readonly exactTopic: string;
  readonly communicationGoal: string;
  readonly readerIntent: string;
  readonly domain: string;
  readonly primarySubject: string;
  readonly visibleAction: string;
  readonly supportingObjects: readonly string[];
  readonly backgroundContext: string;
  readonly emotionalTone: string;
  readonly platform: string;
  readonly postType: string;
  readonly visualStory: VisualStory;
}
