import { HelpItem } from './explain-item.types';

export interface HelpingState {
  activeHelpId: string | null;
  activeItem: HelpItem | null;
  isHelpModeActive: boolean;
}

export interface HelpingContextValue {
  activeHelpId: string | null;
  activeItem: HelpItem | null;
  isHelpModeActive: boolean;
  openHelp: (helpId: string) => void;
  closeHelp: () => void;
  toggleHelpMode: () => void;
}
