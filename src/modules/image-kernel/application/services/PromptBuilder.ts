import type { ImageScene } from '../../domain/entities/ImageScene';
import type { ImagePrompt } from '../../domain/entities/ImagePrompt';
import type { LoadedMasterImageRules } from '../ports/ImageRulesRepository';

const GLOBAL_NEGATIVES = [
  'empty office', 'empty meeting room', 'empty warehouse', 'generic corporate stock photo',
  'passive workers', 'meaningless laptop scene', 'environment dominance', 'weak focal subject',
  'floating holograms', 'humanoid robot by default', 'hooded hacker', 'generic handshake',
  'distorted hands', 'extra fingers', 'duplicated people', 'illegible text', 'watermark', 'visual clutter',
];

export class PromptBuilder {
  public build(scene: ImageScene, rules: LoadedMasterImageRules, aspectRatio = '1:1'): ImagePrompt {
    const text = [
      `[Rules Version: ${rules.version}]`,
      `[Platform: ${scene.platform} | Post Type: ${scene.postType} | Aspect Ratio: ${aspectRatio}]`,
      `[Communication Goal: ${scene.communicationGoal}]`,
      `[Reader Intent: ${scene.readerIntent}]`,
      `Exact Topic: ${scene.exactTopic}.`,
      `Primary Focal Subject: ${scene.primarySubject}.`,
      `Visible Action: ${scene.visibleAction}.`,
      `Supporting Objects: ${scene.supportingObjects.join(', ')}.`,
      `Background Context: ${scene.backgroundContext}.`,
      `Visual Story: ${scene.visualStory.who} ${scene.visualStory.action}; visible evidence: ${scene.visualStory.evidence.join(', ')}; viewer takeaway: ${scene.visualStory.viewerTakeaway}.`,
      'Composition: medium or medium-close editorial framing, clear focal hierarchy, mobile-safe crop, clean negative space, background strictly subordinate.',
      'Lighting: bright balanced daylight or professional editorial lighting, natural colors, controlled contrast.',
      'Quality: realistic, topic-accurate, modern, publication-grade, visually clear within one second.',
    ].join(' ');

    return Object.freeze({
      text,
      negativePrompt: GLOBAL_NEGATIVES.join(', '),
      rulesVersion: rules.version,
      rulesIntegrityHash: rules.integrityHash,
      platform: scene.platform,
      aspectRatio,
    });
  }
}
