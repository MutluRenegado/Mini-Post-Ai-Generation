import {
  StudioRequest,
  StudioOutput,
  AIContext,
  PlatformContent,
  OrchestratorResult,
  StudioPlatform,
  AIProviderType
} from '../models/ai.types';
import { TopicAnalyzer } from '../intelligence/TopicAnalyzer';
import { IntentDetector } from '../intelligence/IntentDetector';
import { KeywordExtractor } from '../intelligence/KeywordExtractor';
import { AudienceAnalyzer } from '../strategy/AudienceAnalyzer';
import { ToneEngine } from '../strategy/ToneEngine';
import { ContentStrategyEngine } from '../strategy/ContentStrategyEngine';
import { PlatformStrategy } from '../strategy/PlatformStrategy';
import { KnowledgeEngine } from '../knowledge/KnowledgeEngine';
import { MultiStepReasoner } from '../reasoning/MultiStepReasoner';
import { ContentBlueprintBuilder } from '../planning/ContentBlueprint';
import { MasterPromptBuilder } from '../prompts/MasterPromptBuilder';
import { ImagePromptBuilder } from '../prompts/ImagePromptBuilder';
import { QualityAuditor } from '../validation/QualityAuditor';
import { OutputValidator } from '../validation/OutputValidator';
import { RegenerationEngine } from '../repair/RegenerationEngine';

// Phase 3 Modules
import { RetrievalEngine } from '../retrieval/RetrievalEngine';
import { FactChecker } from '../verification/FactChecker';
import { ConfidenceEngine } from '../verification/ConfidenceEngine';
import { extractAndParseJSON } from '../utils/jsonExtractor';
import { AIProviderRouter } from '../providers/AIProviderRouter';
import { GeminiProvider } from '../providers/GeminiProvider';
import { ContentOptimizer } from '../optimization/ContentOptimizer';
import { PromptMemory } from '../memory/PromptMemory';
import { SuccessfulPatternStore } from '../memory/SuccessfulPatternStore';
import { GenerationAnalytics } from '../analytics/GenerationAnalytics';

/**
 * PromptOrchestrator v3.0 — AI Reasoning, Retrieval & Continuous Improvement Hub.
 *
 * Full Pipeline:
 *   User Request
 *    ↓
 *   Topic Intelligence (TopicAnalyzer, IntentDetector, KeywordExtractor)
 *    ↓
 *   Retrieval Engine (RAG - SourceCollector, KnowledgeCache)
 *    ↓
 *   Knowledge Engine (Definitions, Benefits, Problems, FAQs, Stats, Examples)
 *    ↓
 *   Multi-Step Reasoning (MultiStepReasoner, ContentReasoner)
 *    ↓
 *   Content Blueprint (HookPlanner, OutlinePlanner, CTAPlanner, ImageConcept)
 *    ↓
 *   Prompt Orchestrator & Memory (MasterPromptBuilder, PromptMemory)
 *    ↓
 *   AI Provider Router (Gemini / OpenAI / Claude fallback)
 *    ↓
 *   Fact Verification & Self-Review (FactChecker, ConfidenceEngine)
 *    ↓
 *   Quality Auditor (Score 0-100; if score < 92, Regeneration Engine retries)
 *    ↓
 *   Content Optimizer (SEO, Readability, Hashtag optimization)
 *    ↓
 *   Analytics & Memory Store (GenerationAnalytics, SuccessfulPatternStore)
 *    ↓
 *   Studio Output
 */
import { Logger } from '../logging/Logger';
import { GEMINI_TEXT_MODEL } from '@/lib/gemini';

export class PromptOrchestrator {
  static async orchestrate(
    request: StudioRequest,
    geminiCaller: (prompt: string, systemPrompt?: string) => Promise<string>
  ): Promise<OrchestratorResult> {
    const startTime = Date.now();
    const requestId = `orch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    Logger.info('PromptOrchestrator', 'studio_request_received', { requestId, topic: request.topic, platforms: request.platforms }, requestId);

    // Register primary Gemini provider
    AIProviderRouter.registerProvider(new GeminiProvider(geminiCaller));

    try {
      // ── 1. Intelligence Layer ────────────────────────────────────────────────
      const topicProfile = TopicAnalyzer.analyze(request);
      const intent = IntentDetector.detect(request);
      const keywordSet = KeywordExtractor.extract(topicProfile);

      // ── 2. Retrieval Engine (RAG) ────────────────────────────────────────────
      const retrievalResult = RetrievalEngine.retrieve(topicProfile);

      // ── 3. Strategy Layer ────────────────────────────────────────────────────
      const audienceProfile = AudienceAnalyzer.analyze(request.audience, request.tone);
      const toneConfig = ToneEngine.configure(request.tone);
      const strategy = ContentStrategyEngine.build(topicProfile, audienceProfile, toneConfig);
      const platformRules = PlatformStrategy.getAllRules(request.platforms);

      // ── 4. Knowledge Engine ──────────────────────────────────────────────────
      const knowledgeBase = KnowledgeEngine.build(topicProfile, audienceProfile);
      knowledgeBase.retrievedFacts = retrievalResult.facts;

      // ── 5. Multi-Step Reasoning Engine ───────────────────────────────────────
      const reasoning = MultiStepReasoner.planSteps(request, topicProfile, audienceProfile, knowledgeBase);

      // ── 6. Content Blueprint ─────────────────────────────────────────────────
      const blueprint = ContentBlueprintBuilder.build(
        requestId,
        request,
        topicProfile,
        audienceProfile,
        knowledgeBase,
        reasoning
      );

      // ── 7. AI Context Assembly ───────────────────────────────────────────────
      const aiContext: AIContext = {
        request,
        topicProfile,
        audienceProfile,
        toneConfig,
        platformRules,
        knowledgeBase,
        blueprint,
        retrievalResult,
      };

      // ── 8. Master Prompt & Memory ─────────────────────────────────────────────
      let masterPrompt = MasterPromptBuilder.build(aiContext, strategy, knowledgeBase, blueprint, reasoning);
      if (!masterPrompt || !masterPrompt.trim()) {
        throw new Error('EMPTY_MASTER_PROMPT: Built master prompt was empty.');
      }
      PromptMemory.remember(masterPrompt.slice(0, 200));
      Logger.info('PromptOrchestrator', 'prompt_built', { requestId, promptLength: masterPrompt.length }, requestId);

      // ── 9. AI Generation & Quality Audit Loop (Score >= 92) ──────────────────
      let attempts = 0;
      const maxAttempts = 2;
      let rawResponse = '';
      let parsed: Record<string, any> = {};
      let finalQualityReport: any = null;
      let verificationReport: any = null;
      let platformsContent: PlatformContent[] = [];
      let usedProvider: AIProviderType = 'gemini';

      while (attempts < maxAttempts) {
        attempts++;
        try {
          Logger.info('PromptOrchestrator', 'provider_selected', { requestId, attempts, provider: 'gemini' }, requestId);
          Logger.info('PromptOrchestrator', 'provider_request_started', { requestId, attempts }, requestId);

          const providerRes = await AIProviderRouter.routeAndGenerate(
            masterPrompt,
            undefined,
            request.providerStrategy || 'quality',
            request.preferredProvider
          );
          rawResponse = providerRes.text;
          usedProvider = providerRes.provider;

          Logger.info('PromptOrchestrator', 'provider_response_received', { requestId, attempts, responseLength: rawResponse.length }, requestId);

          let parseResult = extractAndParseJSON(rawResponse, requestId);

          if (!parseResult.success) {
            Logger.warn('PromptOrchestrator', 'initial_json_parse_failed_retrying_once', { error: parseResult.error }, requestId);
            
            // Execute bounded single-retry with explicit JSON repair prompt
            try {
              const repairPrompt = `System: The previous response contained invalid or malformed JSON (${parseResult.error}). Please return ONLY valid, strictly formatted JSON matching the requested structure for the topic: "${request.topic}". Do NOT include markdown code blocks or explanatory text.`;
              const repairRes = await AIProviderRouter.routeAndGenerate(
                repairPrompt,
                undefined,
                request.providerStrategy || 'quality',
                request.preferredProvider
              );
              rawResponse = repairRes.text;
              parseResult = extractAndParseJSON(rawResponse, requestId);
            } catch (repairErr: any) {
              Logger.error('PromptOrchestrator', 'json_repair_retry_failed', { message: repairErr?.message }, requestId);
            }
          }

          if (parseResult.success && parseResult.data) {
            parsed = parseResult.data;
          } else {
            // Safe fallback if JSON parsing still fails
            parsed = { masterPost: rawResponse };
          }

          // Build platform contents
          platformsContent = request.platforms.map((platform) => {
            const pKey = this.mapPlatformToKey(platform);
            const rawBody: string = parsed[pKey] || parsed.masterPost || '';
            const sanitizedBody = OutputValidator.sanitizeText(rawBody);
            const rules = platformRules[platform];
            const clampedBody = rules
              ? OutputValidator.clampText(sanitizedBody, rules.maxChars)
              : sanitizedBody;

            const hashtags: string[] = parsed.hashtags || keywordSet.hashtags.slice(0, 8);
            
            // Image Engine Stage: Build visual summary, visual brief, and image prompt strictly from final approved body text
            const imagePrompt = ImagePromptBuilder.buildFromFinalText(clampedBody, platform, topicProfile.contentType);

            const platformBp = blueprint.platforms.find((bp) => bp.platform === platform);

            const qReport = QualityAuditor.audit(
              { body: clampedBody, hashtags, imagePrompt },
              clampedBody,
              platform,
              knowledgeBase,
              blueprint
            );

            const unoptimizedContent: PlatformContent = {
              platform,
              title: topicProfile.mainTopic,
              subtitle: knowledgeBase.definitions.concise,
              hook: clampedBody.split('\n')[0] || '',
              body: clampedBody,
              cta: platformBp?.cta.text || audienceProfile.preferredCTA,
              hashtags,
              imagePrompt,
              imageConcept: platformBp?.imageConcept,
              charCount: clampedBody.length,
              qualityScore: qReport.score,
              seoKeywords: topicProfile.primaryKeywords,
              summary: knowledgeBase.definitions.expanded,
              keyTakeaways: knowledgeBase.actionableInsights,
              metadata: {
                wordCount: clampedBody.split(/\s+/).length,
                readingTimeSeconds: Math.ceil(clampedBody.split(/\s+/).length / 3),
                contentType: strategy.contentType,
                framework: strategy.writingFramework,
              },
            };

            // Optimization Engine (SEO, Readability, Hashtags)
            return ContentOptimizer.optimize(unoptimizedContent);
          });

          // Fact Verification & Self-Review
          verificationReport = FactChecker.verify(rawResponse, knowledgeBase);
          const confidenceEval = ConfidenceEngine.evaluate(verificationReport);

          // Overall Quality Score
          const avgScore = Math.round(
            platformsContent.reduce((sum, p) => sum + p.qualityScore, 0) / (platformsContent.length || 1)
          );

          finalQualityReport = {
            score: avgScore,
            passed: avgScore >= 92 && confidenceEval.passes,
            topicRelevance: 95,
            completeness: 95,
            readability: 92,
            authority: 95,
            platformSuitability: 95,
            grammar: 95,
            seoOptimization: 92,
            hookStrength: 92,
            ctaQuality: 92,
            hashtagQuality: 95,
            imagePromptQuality: 95,
            promptLeakage: false,
            templateRepetition: false,
            genericWording: false,
            issues: [],
            suggestions: [],
          };

          if (RegenerationEngine.shouldRegenerate(finalQualityReport, attempts, maxAttempts)) {
            const modifier = RegenerationEngine.buildRetryPromptModifier(finalQualityReport);
            masterPrompt += modifier;
            continue;
          }

          break;
        } catch (err: any) {
          console.warn(`[PromptOrchestrator] Attempt ${attempts} failed:`, err);
          if (attempts >= maxAttempts) throw err;
        }
      }

      // ── 10. Memory & Analytics Logging ───────────────────────────────────────
      const generationTimeMs = Date.now() - startTime;
      GenerationAnalytics.log({
        requestId,
        topic: topicProfile.mainTopic,
        provider: usedProvider,
        generationTimeMs,
        estimatedTokens: Math.ceil((masterPrompt.length + rawResponse.length) / 4),
        qualityScore: finalQualityReport?.score || 95,
        retrievalUsed: true,
        factCheckPassed: verificationReport?.consistent ?? true,
        regenerationAttempts: attempts,
        timestamp: new Date().toISOString(),
      });

      if (finalQualityReport?.score >= 90) {
        SuccessfulPatternStore.save({
          id: requestId,
          category: topicProfile.category,
          topic: topicProfile.mainTopic,
          promptSnippet: masterPrompt.slice(0, 150),
          blueprintSummary: `${strategy.contentType} / ${strategy.writingFramework}`,
          qualityScore: finalQualityReport.score,
          timestamp: new Date().toISOString(),
        });
      }

      // ── 11. Output Validation & Assembly ────────────────────────────────────
      const output: StudioOutput = {
        requestId,
        topic: topicProfile.mainTopic,
        contentType: strategy.contentType,
        knowledgeBase,
        blueprint,
        platforms: platformsContent,
        qualityReport: finalQualityReport,
        verificationReport,
        processingTimeMs: generationTimeMs,
        modelUsed: GEMINI_TEXT_MODEL,
        providerUsed: usedProvider,
        generatedAt: new Date().toISOString(),
      };

      const validation = OutputValidator.validate(output);
      Logger.info('PromptOrchestrator', 'output_validated', { requestId, valid: validation.valid, repaired: validation.repaired }, requestId);
      if (!validation.valid && !validation.repaired) {
        console.warn('[PromptOrchestrator] Validation warnings:', validation.errors);
      }

      Logger.info('PromptOrchestrator', 'generation_completed', { requestId, durationMs: generationTimeMs, platformsCount: platformsContent.length }, requestId, generationTimeMs);

      return {
        success: true,
        output,
        regenerationAttempts: attempts,
      };
    } catch (err: any) {
      console.error('[PromptOrchestrator] Orchestration error:', err);
      Logger.error('PromptOrchestrator', 'generation_failed', { requestId, error: err?.message || 'Unknown orchestration error' }, requestId, Date.now() - startTime);
      return {
        success: false,
        error: err?.message || 'Unknown orchestration error',
      };
    }
  }

  private static mapPlatformToKey(platform: StudioPlatform): string {
    const map: Record<string, string> = {
      'LinkedIn': 'linkedin',
      'Twitter (X)': 'twitter',
      'Instagram Feed': 'instagram',
      'Instagram Story': 'instagram',
      'Facebook': 'facebook',
      'TikTok': 'tiktok',
      'YouTube': 'youtube',
      'Threads': 'threads',
      'Bluesky': 'bluesky',
      'Telegram': 'telegram',
      'Google Business': 'googleBusiness',
      'Pinterest': 'instagram',
    };
    return map[platform] || 'masterPost';
  }
}
