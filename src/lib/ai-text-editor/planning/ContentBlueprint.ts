import {
  StudioRequest,
  TopicProfile,
  AudienceProfile,
  KnowledgeBase,
  ContentReasoning,
  ContentBlueprint,
  PlatformBlueprint,
  StudioPlatform
} from '../models/ai.types';
import { HookPlanner } from './HookPlanner';
import { CTAPlanner } from './CTAPlanner';
import { OutlinePlanner } from './OutlinePlanner';
import { ImagePromptBuilder } from '../prompts/ImagePromptBuilder';

export class ContentBlueprintBuilder {
  static build(
    requestId: string,
    request: StudioRequest,
    topic: TopicProfile,
    audience: AudienceProfile,
    kb: KnowledgeBase,
    reasoning: ContentReasoning
  ): ContentBlueprint {
    const globalHooks = HookPlanner.plan(topic, audience, kb);

    const platformBlueprints: PlatformBlueprint[] = request.platforms.map((platform) => {
      const cta = CTAPlanner.planForPlatform(platform, audience, request.goal, request.cta);
      const sections = OutlinePlanner.buildSections(platform, topic.contentType, kb, audience);
      
      // Build Image Concept
      const imagePromptObj = ImagePromptBuilder.build({ request, topicProfile: topic, audienceProfile: audience, toneConfig: {} as any, platformRules: {} as any }, platform);

      return {
        platform,
        contentType: topic.contentType,
        sections,
        hookVariants: globalHooks.filter((h) => h.platform === 'universal' || h.platform === platform),
        cta,
        imageConcept: {
          platform,
          primarySubject: imagePromptObj.subject,
          secondaryObjects: topic.entities,
          environment: imagePromptObj.environment,
          lighting: imagePromptObj.lighting,
          composition: imagePromptObj.composition,
          camera: imagePromptObj.camera,
          lens: imagePromptObj.lens,
          style: imagePromptObj.style,
          mood: imagePromptObj.mood,
          palette: imagePromptObj.colorPalette,
          negativePrompts: [imagePromptObj.negativePrompt],
          alternativeConcept: `Conceptual minimalist representation of ${topic.mainTopic}`
        },
        targetWordCount: platform === 'LinkedIn' ? 350 : platform === 'Twitter (X)' ? 40 : 150,
        uniqueAngle: reasoning.differentiator,
        forbidden: reasoning.neverInclude,
        required: [topic.primaryKeywords[0] || topic.mainTopic]
      };
    });

    return {
      requestId,
      topic: topic.mainTopic,
      globalHooks,
      platforms: platformBlueprints,
      seoKeywords: topic.primaryKeywords,
      hashtagThemes: topic.secondaryKeywords,
      reasoning
    };
  }
}
