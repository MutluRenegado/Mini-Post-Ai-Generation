export interface ImageMakerLearningRecord {
  id: string;
  ownerId: string;
  postId?: string;
  promptFingerprint: string;
  conceptCategory?: string;
  compositionStyle?: string;
  qualityScore: number;
  attemptsCount: number;
  userAccepted: boolean;
  userRating?: number;
  userFeedbackText?: string;
  timestamp: string;
}

export interface OptimizationMetrics {
  totalSessions: number;
  averageScore: number;
  acceptanceRate: number;
  regenerationRate: number;
  topConceptCategories: Array<{ category: string; count: number; successRate: number }>;
  commonDefectCodes: Array<{ code: string; count: number }>;
}

export interface OptimizationRecommendation {
  id: string;
  category: 'prompt' | 'concept' | 'composition' | 'provider';
  title: string;
  description: string;
  confidenceScore: number;
  sampleSize: number;
  requiresReview: true;
}
