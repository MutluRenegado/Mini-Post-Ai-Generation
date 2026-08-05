export interface TextGenerationRequest {
  topic: string;
  platform?: string;
  postType?: string;
  tone?: string;
  targetAudience?: string;
  language?: string;
  hashtagsCount?: number;
  includeSeo?: boolean;
}

export interface PlatformTextOutput {
  platform: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
}

export interface TextGenerationResponse {
  masterPost: string;
  platformOutputs: PlatformTextOutput[];
  seoTitle?: string;
  seoMetaDescription?: string;
  generatedAt: string;
}
