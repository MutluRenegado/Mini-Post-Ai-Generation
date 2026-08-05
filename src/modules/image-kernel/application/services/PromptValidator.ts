import type { ImagePrompt } from '../../domain/entities/ImagePrompt';
import type { ImageScene } from '../../domain/entities/ImageScene';
import type { ImageRejectionCode, ImageValidationFailure, ImageValidationResult, ImageValidationScores } from '../../domain/entities/ImageValidationResult';

const EMPTY_ENVIRONMENTS = [
  'empty office',
  'empty executive office',
  'empty meeting room',
  'empty boardroom',
  'empty conference room',
  'empty warehouse',
  'empty server room',
  'empty data center',
  'empty laboratory',
  'empty classroom',
  'empty space',
  'empty desk',
];

const CLICHES = [
  'floating hologram',
  'neon brain',
  'matrix code',
  'currency rain',
  'light bulb',
  'rocket launch',
  'chess pieces',
  'hooded hacker',
  'humanoid robot',
];

export class PromptValidator {
  public validate(prompt: ImagePrompt, scene: ImageScene): ImageValidationResult {
    const normalized = `${prompt.text} ${prompt.negativePrompt}`.toLowerCase();
    const positive = prompt.text.toLowerCase();
    const failures: ImageValidationFailure[] = [];
    const environmentTopic = scene.domain === 'environment-design';

    // 1 & 2. Empty office & environment checks
    if (!environmentTopic && EMPTY_ENVIRONMENTS.some((item) => positive.includes(item))) {
      const offending = EMPTY_ENVIRONMENTS.filter((item) => positive.includes(item));
      failures.push({
        code: 'EMPTY_OFFICE_SCENE_FORBIDDEN',
        reason: 'An empty professional environment is proposed as the scene.',
        offendingElements: offending,
        requiredCorrection: 'Introduce a relevant human primary subject performing a topic-specific action.',
      });
      failures.push({
        code: 'EMPTY_ENVIRONMENT_DETECTED',
        reason: 'An empty environment was detected.',
        offendingElements: offending,
        requiredCorrection: 'Add a human primary subject.',
      });
    }

    // 3. Environment dominance check
    if (!environmentTopic && (positive.includes('warehouse corridor') || positive.includes('empty logistics hall') || positive.includes('empty server room'))) {
      failures.push({
        code: 'ENVIRONMENT_DOMINANCE_DETECTED',
        reason: 'Environment is dominating the scene instead of human primary subject.',
        offendingElements: ['environment dominance'],
        requiredCorrection: 'Subordinate the background environment and focus on the human primary subject.',
      });
    }

    // 4 & 5. Human subject required & primary subject strength
    if (!environmentTopic && !/(executive|analyst|engineer|teacher|learner|clinician|professional|leader|director|specialist|cfo|architect|founder)/.test(positive)) {
      failures.push({
        code: 'HUMAN_SUBJECT_REQUIRED',
        reason: 'A meaningful human primary subject is required for this domain.',
        offendingElements: [],
        requiredCorrection: 'Add relevant experts actively performing the central action.',
      });
      failures.push({
        code: 'PRIMARY_SUBJECT_TOO_WEAK',
        reason: 'Primary subject is too weak or missing.',
        offendingElements: [],
        requiredCorrection: 'Focus closely on the primary human subject.',
      });
    }

    // 6. Visible action missing
    if (!/(analyzing|comparing|reviewing|discussing|teaching|inspecting|evaluating|showing|collaborating|planning)/.test(positive)) {
      failures.push({
        code: 'VISIBLE_ACTION_MISSING',
        reason: 'No clear topic-specific action was found.',
        offendingElements: [],
        requiredCorrection: 'Describe a concrete visible action.',
      });
    }

    // 7. Generic corporate scene
    if (positive.includes('generic corporate stock photo') || positive.includes('generic business photo') || positive.includes('stock photo')) {
      failures.push({
        code: 'GENERIC_CORPORATE_SCENE',
        reason: 'A generic corporate stock phrase was detected.',
        offendingElements: ['generic corporate'],
        requiredCorrection: 'Describe specific, realistic professionals and domain evidence.',
      });
    }

    // 8. Passive human subject
    if (positive.includes('smiling at camera') || positive.includes('posing passively')) {
      failures.push({
        code: 'PASSIVE_HUMAN_SUBJECT',
        reason: 'Human subject is posing passively instead of working.',
        offendingElements: ['passive pose'],
        requiredCorrection: 'Show the subject actively engaging with topic evidence.',
      });
    }

    // 9. Unrelated object association
    if (!environmentTopic && (positive.includes('random warehouse') || positive.includes('random laptop on desk'))) {
      failures.push({
        code: 'UNRELATED_OBJECT_ASSOCIATION',
        reason: 'Unrelated object association detected.',
        offendingElements: ['unrelated object'],
        requiredCorrection: 'Use domain-specific supporting evidence objects only.',
      });
    }

    // 10. Visual clichés
    if (CLICHES.some((item) => positive.includes(item))) {
      failures.push({
        code: 'VISUAL_CLICHE_DETECTED',
        reason: 'A prohibited visual cliché was detected.',
        offendingElements: CLICHES.filter((item) => positive.includes(item)),
        requiredCorrection: 'Replace the cliché with concrete subject-matter evidence.',
      });
    }

    // 11. Image rule override attempt
    if (/ignore .*rule|skip validation|override forbidden|send directly to provider/.test(normalized)) {
      failures.push({
        code: 'IMAGE_RULE_OVERRIDE_ATTEMPT',
        reason: 'An attempt to override master image rules was detected.',
        offendingElements: [],
        requiredCorrection: 'Remove the override instruction and retain master-rule priority.',
      });
    }

    const scores: ImageValidationScores = {
      topicAccuracyScore: scene.exactTopic.length > 5 ? 95 : 70,
      communicationClarityScore: scene.communicationGoal.length > 20 ? 95 : 70,
      primarySubjectProminenceScore: failures.some((f) => f.code === 'HUMAN_SUBJECT_REQUIRED' || f.code === 'PRIMARY_SUBJECT_TOO_WEAK') ? 60 : 90,
      visibleActionScore: failures.some((f) => f.code === 'VISIBLE_ACTION_MISSING') ? 60 : 90,
      supportingObjectRelevanceScore: scene.supportingObjects.length > 0 ? 90 : 60,
      backgroundSubordinationScore: (environmentTopic || /subordinate/.test(positive)) ? 90 : 75,
      compositionQualityScore: (positive.includes('medium') || positive.includes('composition') || positive.includes('architectural')) ? 90 : 75,
      platformCompatibilityScore: prompt.platform ? 90 : 75,
    };

    const scoreCodeMap: Record<string, ImageRejectionCode> = {
      topicAccuracyScore: 'TOPIC_ACCURACY_TOO_LOW',
      communicationClarityScore: 'COMMUNICATION_CLARITY_TOO_LOW',
      primarySubjectProminenceScore: 'PRIMARY_SUBJECT_TOO_WEAK',
      visibleActionScore: 'VISIBLE_ACTION_MISSING',
      supportingObjectRelevanceScore: 'TOPIC_ACCURACY_TOO_LOW',
      backgroundSubordinationScore: 'ENVIRONMENT_DOMINANCE_DETECTED',
      compositionQualityScore: 'PLATFORM_COMPOSITION_INVALID',
      platformCompatibilityScore: 'PLATFORM_COMPOSITION_INVALID',
    };

    for (const [key, value] of Object.entries(scores)) {
      const code = scoreCodeMap[key] || 'TOPIC_ACCURACY_TOO_LOW';
      if (value < 80 && !failures.some((f) => f.code === code)) {
        failures.push({
          code,
          reason: `${key} (${value}) is below the required 80 threshold.`,
          offendingElements: [String(value)],
          requiredCorrection: 'Rebuild the scene and prompt so every critical score is at least 80.',
        });
      }
    }

    return Object.freeze({
      valid: failures.length === 0,
      scores: Object.freeze(scores),
      failures: Object.freeze(failures),
    });
  }
}
