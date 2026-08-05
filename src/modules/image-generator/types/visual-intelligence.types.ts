export interface VisualIntelligenceBrief {
  id: string;
  postId?: string;
  platform: string;
  sanitizedContent: string;
  fingerprint: string;
  primarySubject: string;
  setting: string;
  actionOrState: string;
  visualMeaning: string;
  keywords: string[];
  brandPalette: string[];
  aspectRatio: string;
  safeAreas: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  createdAt: string;
}

export interface AnalyzePostParams {
  postId?: string;
  postContent: string;
  platform?: string;
  brandColors?: string[];
}
