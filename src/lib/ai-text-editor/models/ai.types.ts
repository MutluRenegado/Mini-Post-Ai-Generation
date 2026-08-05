// ─────────────────────────────────────────────────────────────────────────────
// MiniPostStudio v3.0 — AI Orchestration Pipeline Type Definitions
// Phase 3: AI Reasoning, Retrieval & Continuous Improvement
// ─────────────────────────────────────────────────────────────────────────────

// ── Request ───────────────────────────────────────────────────────────────────

export interface StudioRequest {
  /** The raw user input — topic, idea, article title, question */
  topic: string;
  /** Goal selected by user */
  goal: StudioGoal;
  /** Target audience description */
  audience: string;
  /** Preferred writing tone */
  tone: StudioTone;
  /** Platforms to generate content for */
  platforms: StudioPlatform[];
  /** Call-to-action user wants to promote */
  cta?: string;
  /** Brand name for personalisation */
  brandName?: string;
  /** Industry vertical */
  industry?: string;
  /** Content language */
  language?: string;
  /** Additional keywords provided by user */
  keywords?: string[];
  /** Image style preference */
  imageStyle?: string;
  /** Preferred AI provider routing strategy (Phase 3) */
  preferredProvider?: AIProviderType;
  providerStrategy?: ProviderRoutingStrategy;
}

// ── Enums / Union Types ───────────────────────────────────────────────────────

export type StudioGoal =
  | 'Brand Awareness'
  | 'Promote Product'
  | 'Promote Service'
  | 'Blog Article'
  | 'Educational'
  | 'Event'
  | 'Announcement'
  | 'Discount'
  | 'Testimonial'
  | 'Quote'
  | 'Thought Leadership'
  | 'Custom';

export type StudioTone =
  | 'Professional'
  | 'Friendly'
  | 'Corporate'
  | 'Luxury'
  | 'Casual'
  | 'Educational'
  | 'Funny'
  | 'Bold'
  | 'Inspirational'
  | 'Technical'
  | 'Minimal';

export type StudioPlatform =
  | 'LinkedIn'
  | 'Twitter (X)'
  | 'Instagram Feed'
  | 'Instagram Story'
  | 'Facebook'
  | 'TikTok'
  | 'YouTube'
  | 'Threads'
  | 'Bluesky'
  | 'Telegram'
  | 'Google Business'
  | 'Pinterest';

export type ContentType =
  | 'Educational'
  | 'Promotional'
  | 'Thought Leadership'
  | 'Story'
  | 'News'
  | 'Tips'
  | 'Tutorial'
  | 'Comparison'
  | 'Case Study'
  | 'Opinion'
  | 'Checklist'
  | 'Guide'
  | 'Quote'
  | 'Announcement';

// ── Phase 3: Provider Abstraction Types ───────────────────────────────────────

export type AIProviderType = 'gemini' | 'openai' | 'claude';
export type ProviderRoutingStrategy = 'quality' | 'speed' | 'cost' | 'availability';

export interface AIProviderResponse {
  text: string;
  provider: AIProviderType;
  model: string;
  latencyMs: number;
  estimatedTokens: number;
}

export interface AIProvider {
  name: AIProviderType;
  generate(prompt: string, systemPrompt?: string, options?: { temperature?: number }): Promise<AIProviderResponse>;
  isHealthy(): Promise<boolean>;
}

// ── Intelligence Layer ────────────────────────────────────────────────────────

export interface TopicProfile {
  mainTopic: string;
  industry: string;
  category: string;
  searchIntent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relatedConcepts: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  lsiKeywords: string[];
  entities: string[];
  faqs: string[];
  contentType: ContentType;
}

export interface AudienceProfile {
  segment: string;
  vocabularyLevel: 'simple' | 'intermediate' | 'professional' | 'executive' | 'technical';
  formality: 'casual' | 'semi-formal' | 'formal' | 'executive';
  painPoints: string[];
  motivations: string[];
  preferredCTA: string;
  emojiUsage: 'none' | 'minimal' | 'moderate' | 'heavy';
  sentenceLength: 'short' | 'medium' | 'long' | 'mixed';
}

export interface ToneConfig {
  tone: StudioTone;
  vocabularyStyle: string;
  sentenceStructure: 'concise' | 'flowing' | 'punchy' | 'authoritative';
  emojiPolicy: 'none' | 'minimal' | 'moderate' | 'heavy';
  ctaStyle: string;
  forbiddenWords: string[];
  powerWords: string[];
  hookStyle: string;
}

export interface PlatformRules {
  platform: StudioPlatform;
  maxChars: number;
  hookRequired: boolean;
  hashtagMin: number;
  hashtagMax: number;
  hashtagPosition: 'inline' | 'end' | 'comment';
  emojiAllowed: boolean;
  preferredLength: 'micro' | 'short' | 'medium' | 'long';
  contentPersonality: string;
  ctaStyle: string;
  postStructure: string[];
  writingStyle: string;
  uniqueFeatures: string[];
}

// ── Knowledge Layer ──────────────────────────────────────────────────────────

export interface TopicDefinition {
  concise: string;
  expanded: string;
  professional: string;
  layperson: string;
  etymology?: string;
}

export interface TopicBenefit {
  headline: string;
  description: string;
  audience: string;
  measurable?: string;
}

export interface TopicProblem {
  problem: string;
  consequence: string;
  solution: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface TopicFAQ {
  question: string;
  answer: string;
  searchVolume: 'low' | 'medium' | 'high';
}

export interface TopicStatistic {
  claim: string;
  context: string;
  source: string;
  type: 'market_size' | 'growth_rate' | 'adoption' | 'cost_saving' | 'risk' | 'efficiency';
}

export interface TopicExample {
  scenario: string;
  application: string;
  outcome: string;
  industry: string;
}

export interface KnowledgeBase {
  topic: string;
  definitions: TopicDefinition;
  benefits: TopicBenefit[];
  problems: TopicProblem[];
  faqs: TopicFAQ[];
  statistics: TopicStatistic[];
  examples: TopicExample[];
  terminology: Record<string, string>;
  misconceptions: string[];
  bestPractices: string[];
  commonMistakes: string[];
  relatedTopics: string[];
  expertPerspectives: string[];
  actionableInsights: string[];
  retrievedFacts?: RetrievedFact[]; // Phase 3 RAG integration
}

// ── Phase 3: Retrieval & Verification Types ───────────────────────────────────

export interface RetrievedFact {
  fact: string;
  source: string;
  relevanceScore: number;
  verifiable: boolean;
}

export interface RetrievalResult {
  topic: string;
  facts: RetrievedFact[];
  sources: string[];
  cached: boolean;
  retrievedAt: string;
}

export interface FactVerificationReport {
  consistent: boolean;
  confidenceScore: number; // 0-100
  unsupportedClaims: string[];
  contradictions: string[];
  missingContext: string[];
  revisedContent?: string;
}

// ── Planning & Reasoning Layer ────────────────────────────────────────────────

export interface ContentSection {
  type: 'hook' | 'context' | 'value' | 'proof' | 'cta' | 'close' | 'subheading' | 'list' | 'quote' | 'stat';
  heading?: string;
  instruction: string;
  keyPoints?: string[];
  wordTarget?: number;
}

export interface HookVariant {
  style: 'question' | 'statistic' | 'bold_statement' | 'story' | 'contradiction' | 'how_to' | 'secret';
  text: string;
  platform: StudioPlatform | 'universal';
}

export interface CTAVariant {
  platform: StudioPlatform;
  text: string;
  type: 'comment' | 'share' | 'follow' | 'save' | 'link' | 'poll' | 'tag' | 'subscribe';
  urgency: 'none' | 'soft' | 'strong';
}

export interface ImageConcept {
  platform: StudioPlatform;
  primarySubject: string;
  secondaryObjects: string[];
  environment: string;
  lighting: string;
  composition: string;
  camera: string;
  lens: string;
  style: string;
  mood: string;
  palette: string;
  negativePrompts: string[];
  alternativeConcept: string;
}

export interface PlatformBlueprint {
  platform: StudioPlatform;
  contentType: ContentType;
  sections: ContentSection[];
  hookVariants: HookVariant[];
  cta: CTAVariant;
  imageConcept: ImageConcept;
  targetWordCount: number;
  uniqueAngle: string;
  forbidden: string[];
  required: string[];
}

export interface ContentBlueprint {
  requestId: string;
  topic: string;
  globalHooks: HookVariant[];
  platforms: PlatformBlueprint[];
  seoKeywords: string[];
  hashtagThemes: string[];
  reasoning: ContentReasoning;
}

export interface ContentReasoning {
  userIntent: string;
  contentValue: string;
  questionsAnswered: string[];
  missingInformation: string[];
  neverInclude: string[];
  expertPerspective: string;
  differentiator: string;
  multiStepPlan?: string[]; // Phase 3 Multi-step reasoning
}

// ── Phase 3: Analytics & Memory Types ─────────────────────────────────────────

export interface AnalyticsRecord {
  requestId: string;
  topic: string;
  provider: AIProviderType;
  generationTimeMs: number;
  estimatedTokens: number;
  qualityScore: number;
  retrievalUsed: boolean;
  factCheckPassed: boolean;
  regenerationAttempts: number;
  timestamp: string;
}

export interface SuccessfulPattern {
  id: string;
  category: string;
  topic: string;
  promptSnippet: string;
  blueprintSummary: string;
  qualityScore: number;
  timestamp: string;
}

// ── Prompt & Output Layer ─────────────────────────────────────────────────────

export interface AIContext {
  request: StudioRequest;
  topicProfile: TopicProfile;
  audienceProfile: AudienceProfile;
  toneConfig: ToneConfig;
  platformRules: Record<string, PlatformRules>;
  knowledgeBase?: KnowledgeBase;
  blueprint?: ContentBlueprint;
  retrievalResult?: RetrievalResult; // Phase 3
  verificationReport?: FactVerificationReport; // Phase 3
}

export interface PlatformPrompt {
  platform: StudioPlatform;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface ImagePrompt {
  platform: StudioPlatform;
  subject: string;
  environment: string;
  composition: string;
  lighting: string;
  camera: string;
  lens: string;
  mood: string;
  colorPalette: string;
  style: string;
  qualityTags: string[];
  negativePrompt: string;
  assembled: string;
}

export interface PlatformContent {
  platform: StudioPlatform;
  title: string;
  subtitle: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  imagePrompt: ImagePrompt;
  imageConcept?: ImageConcept;
  charCount: number;
  qualityScore: number;
  seoKeywords: string[];
  summary: string;
  keyTakeaways: string[];
  metadata: {
    wordCount: number;
    readingTimeSeconds: number;
    contentType: ContentType;
    framework: string;
  };
}

export interface QualityReport {
  score: number;
  passed: boolean;
  topicRelevance: number;
  completeness: number;
  readability: number;
  authority: number;
  platformSuitability: number;
  grammar: number;
  seoOptimization: number;
  hookStrength: number;
  ctaQuality: number;
  hashtagQuality: number;
  imagePromptQuality: number;
  promptLeakage: boolean;
  templateRepetition: boolean;
  genericWording: boolean;
  issues: string[];
  suggestions: string[];
}

export interface StudioOutput {
  requestId: string;
  topic: string;
  contentType: ContentType;
  knowledgeBase?: KnowledgeBase;
  blueprint?: ContentBlueprint;
  platforms: PlatformContent[];
  qualityReport: QualityReport;
  verificationReport?: FactVerificationReport; // Phase 3
  processingTimeMs: number;
  modelUsed: string;
  providerUsed: AIProviderType; // Phase 3
  generatedAt: string;
}

export interface OrchestratorResult {
  success: boolean;
  output?: StudioOutput;
  error?: string;
  fallbackUsed?: boolean;
  regenerationAttempts?: number;
}
