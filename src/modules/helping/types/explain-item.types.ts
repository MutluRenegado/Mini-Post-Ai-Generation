export type HelpCategory =
  | 'NAVIGATION'
  | 'BUTTON'
  | 'FORM_FIELD'
  | 'FORM_SECTION'
  | 'CARD'
  | 'TABLE'
  | 'FILTER'
  | 'WORKFLOW'
  | 'STUDIO'
  | 'ACCOUNT'
  | 'BILLING'
  | 'COMPANY'
  | 'STANDARDS'
  | 'LEGAL'
  | 'PUBLISHING'
  | 'TEMPLATE'
  | 'IMAGE'
  | 'AI_CONTENT'
  | 'SETTINGS'
  | 'OTHER';

export type HelpPlacement = 'BELOW' | 'ABOVE' | 'LEFT' | 'RIGHT' | 'AUTO';

export interface HelpItem {
  id: string;
  elementId?: string;
  title: string;
  shortDescription: string;
  purpose: string;
  instructions: string[];
  expectedResult: string;
  commonMistakes?: string[];
  limitations?: string[];
  relatedHelpIds?: string[];
  category: HelpCategory;
  route?: string;
  placement?: HelpPlacement;
  triggerLabel?: string;
  enabled?: boolean;
  version?: string;
  reviewed?: boolean;
  contentOwner?: string;
}
