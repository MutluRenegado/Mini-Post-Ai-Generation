export interface UserImageFeedback {
  rating?: number;
  relevant?: boolean;
  styleMatch?: boolean;
  compositionMatch?: boolean;
  problemCodes?: string[];
  comment?: string;
}

export interface ImageMakerLearningRecord {
  id: string;

  ownerId: string;
  postId?: string;
  campaignId?: string;

  briefId: string;
  conceptId: string;
  compositionPlanId: string;

  promptId: string;
  promptVersion: number;

  provider: string;
  model: string;

  imageAssetId: string;
  imageVersion: number;

  qualityResultId: string;
  qualityScores: Record<string, number>;
  detectedProblemCodes: string[];

  correctionActions: string[];
  regenerationCount: number;

  selectedVersionId?: string;
  rejectedVersionIds: string[];

  userFeedback?: UserImageFeedback;

  platform: string;
  templateId?: string;
  brandProfileId?: string;

  learningContributionAllowed: boolean;

  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface OptimizationMetrics {
  totalRecords: number;
  averageQualityScore: number;
  passRatePercentage: number;
  averageRegenerationCount: number;

  mostFrequentProblemCodes: Array<{ code: string; count: number }>;
  mostEffectiveCorrections: Array<{ action: string; successRate: number }>;
  providerSuccessRates: Record<string, number>;
  platformSuccessRates: Record<string, number>;

  analyzedAt: string;
}

export interface OptimizationRecommendation {
  id: string;
  ruleArea: 'prompt_builder' | 'composition_planner' | 'provider_router' | 'quality_auditor';
  issueDescription: string;
  proposedAdjustment: string;
  confidenceScore: number;
  basedOnRecordCount: number;
  status: 'draft' | 'reviewable' | 'accepted' | 'rejected';
  createdAt: string;
}
