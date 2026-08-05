export interface DiversityOptions {
  currentCampaignId?: string;
  currentTopic?: string;
  recentlyUsedIds?: string[];
}

export interface DiversityAdjustments {
  usagePenalty: number;
  recencyAdjustment: number;
  diversityPenalty: number;
  repeatedAssetPenalty: number;
}
