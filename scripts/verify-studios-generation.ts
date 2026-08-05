import { PromptOrchestrator } from '../src/lib/ai-text-editor/orchestrator/PromptOrchestrator';
import { TextEngineService } from '../src/modules/ai/services/text-engine.service';
import { HashtagEngineService } from '../src/modules/ai/services/hashtag-engine.service';
import { AIContentService } from '../src/studio/ai/ai-content.service';
import { FacebookPlatformService } from '../src/studio/platforms/facebook/facebook.service';
import { InstagramStudioService } from '../src/studio/platforms/instagram/instagram.service';
import { LinkedInPlatformService } from '../src/studio/platforms/linkedin/linkedin.service';
import { TwitterStudioService } from '../src/studio/platforms/twitter/twitter.service';
import { TikTokStudioService } from '../src/studio/platforms/tiktok/tiktok.service';
import { PinterestPlatformService } from '../src/studio/platforms/pinterest/pinterest.service';
import { YouTubeClassicService } from '../src/studio/platforms/youtube/youtube-classic.service';
import { YouTubeShortsService } from '../src/studio/platforms/youtube/youtube-shorts.service';
import { ThreadsStudioService } from '../src/studio/platforms/threads/threads.service';
import { GoogleBusinessService } from '../src/studio/platforms/googlebusiness/googlebusiness.service';
import { TemplateManagerService } from '../src/studio/templates/templates.service';
import { SEOEngineService } from '../src/studio/seo/seo.service';

async function runStudioGenerationAudit() {
  console.log('====================================================');
  console.log('   STARTING STUDIO GENERATION PIPELINE INTEGRITY AUDIT');
  console.log('====================================================');

  const studiosToVerify = [
    { name: 'PromptOrchestrator Empty Prompt Check', fn: async () => {
      const res = await PromptOrchestrator.orchestrate(
        { topic: '', goal: 'Brand Awareness', audience: 'All', tone: 'Professional', platforms: ['LinkedIn'] },
        async () => ''
      );
      if (res.success) throw new Error('Expected PromptOrchestrator to fail on empty topic');
      return res.error;
    }},
    { name: 'TextEngineService Invalid Output Check', fn: async () => {
      const res = await TextEngineService.process({ topic: '   ', action: 'full_article' });
      if (res.success) throw new Error('Expected TextEngineService to fail on whitespace topic');
      return res.error;
    }},
    { name: 'HashtagEngineService Empty Topic Check', fn: async () => {
      const res = await HashtagEngineService.process({ topic: '' });
      if (res.success) throw new Error('Expected HashtagEngineService to fail on empty topic');
      return res.error;
    }},
  ];

  let passedCount = 0;
  let failedCount = 0;

  for (const studio of studiosToVerify) {
    try {
      console.log(`[TESTING] ${studio.name}...`);
      const details = await studio.fn();
      console.log(`  └─ PASSED: Correctly handled failure state -> "${details}"`);
      passedCount++;
    } catch (err: any) {
      console.error(`  └─ FAILED: ${err?.message || err}`);
      failedCount++;
    }
  }

  console.log('====================================================');
  console.log(`AUDIT RESULTS: ${passedCount} PASSED, ${failedCount} FAILED out of ${studiosToVerify.length} tests.`);
  console.log('====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runStudioGenerationAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
