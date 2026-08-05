import crypto from 'crypto';
import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { SemanticSubjectExtraction } from './semantic-subject.types';
import { SemanticSubjectIntelligence } from './semanticSubjectIntelligence';
import {
  VisualStoryNarrative,
  VisualStoryResult,
  VisualCharacter,
  StoryAction,
  VisualNarrativeTree,
  StoryPriority,
} from './visual-story.types';
import { VisualStoryResultSchema } from './visual-story.schema';

export interface ScoreDeduction {
  criterion: string;
  pointsDeducted: number;
  reason: string;
  isCriticalFailure?: boolean;
}

export interface StoryValidationReport {
  isValid: boolean;
  validationScore: number;
  deductions: ScoreDeduction[];
  findings: string[];
  passedCriteria: string[];
}

export class StoryBuilder {
  /**
   * Constructs hero, supporting, and secondary narratives while preserving multi-domain evidence.
   */
  public static buildStoryContent(
    brief: VisualIntelligenceBrief,
    semantic: SemanticSubjectExtraction
  ): {
    heroStory: string;
    supportingStory: string;
    secondaryNarrative: string;
    who: VisualCharacter[];
    actions: StoryAction[];
  } {
    const occupations = semantic.occupations;
    const heroRole = occupations[0] || 'Lead Technical Specialist';

    let supportingRole = occupations[1] || 'Collaborative Specialist';
    if (semantic.isMixedDomain && semantic.secondaryDomain) {
      // Find secondary domain occupation for supportingRole
      const secKeywords = ['security', 'cybersecurity', 'cloud', 'soc', 'analyst', 'logistics', 'engineer', 'technician'];
      const secMatch = occupations.slice(1).find((o) => secKeywords.some((k) => o.toLowerCase().includes(k)));
      if (secMatch) {
        supportingRole = secMatch;
      }
    }
    const contextualRole = occupations.find((o) => o !== heroRole && o !== supportingRole) || occupations[2] || 'Domain Operations Specialist';

    const who: VisualCharacter[] = [
      {
        role: heroRole,
        relationship: 'Primary focal protagonist executing core operation',
        visualRole: 'hero',
        expression: 'Focused, confident, and highly engaged',
      },
    ];

    if (occupations.length > 1 || semantic.isMixedDomain) {
      who.push({
        role: supportingRole,
        relationship: semantic.isMixedDomain
          ? `Collaborating directly with ${heroRole} to secure and audit cross-domain operations`
          : `Collaborating directly with ${heroRole} on shared technical objective`,
        visualRole: 'supporting',
        expression: 'Attentive, analytical, and supportive',
      });
    }

    if (occupations.length > 2) {
      who.push({
        role: contextualRole,
        relationship: 'Providing specialized domain oversight in the background',
        visualRole: 'contextual',
        expression: 'Professional and observant',
      });
    }

    const primaryAction = semantic.visibleActions[0] || brief.action || 'Executing specialized operation';
    const secondaryAction = semantic.visibleActions[1] || 'Analyzing operational telemetry';

    const actions: StoryAction[] = [
      {
        action: primaryAction,
        intensity: 'dynamic',
        narrativeImpact: `Demonstrates active technical execution by ${heroRole}`,
      },
      {
        action: secondaryAction,
        intensity: 'moderate',
        narrativeImpact: `Provides contextual collaboration between ${heroRole} and ${supportingRole}`,
      },
    ];

    const primaryTools = semantic.physicalObjects.slice(0, 2).join(' and ');
    const secondaryTools = semantic.physicalObjects.slice(2, 4).join(' and ') || 'diagnostic displays';
    const environment = semantic.environment || brief.setting;

    let heroStory: string;
    let supportingStory: string;
    let secondaryNarrative: string;

    if (semantic.isMixedDomain && semantic.secondaryDomain) {
      heroStory = `${heroRole} actively engaged in ${primaryAction} within a ${environment} utilizing ${primaryTools}, while ${supportingRole} monitors ${secondaryAction} on ${secondaryTools}.`;
      supportingStory = `${supportingRole} collaborating alongside ${heroRole} to audit cross-domain ${semantic.domain} and ${semantic.secondaryDomain} compliance on visible ${secondaryTools}.`;
      secondaryNarrative = `Set inside a ${environment}, bridging ${semantic.domain} and ${semantic.secondaryDomain} operations with authentic visual evidence, professional trust, and data security.`;
    } else {
      heroStory = `${heroRole} actively engaged in ${primaryAction} within a ${environment} utilizing ${primaryTools}.`;
      supportingStory = `${supportingRole} collaborating alongside ${heroRole} to analyze ${secondaryAction} on visible ${semantic.physicalObjects[1] || 'diagnostic displays'}.`;
      secondaryNarrative = `Set inside a ${environment}, communicating ${semantic.domain} excellence, professional trust, and operational clarity.`;
    }

    return {
      heroStory,
      supportingStory,
      secondaryNarrative,
      who,
      actions,
    };
  }
}

export class NarrativePlanner {
  /**
   * Maps sequential visual interactions and constructs the visual narrative tree.
   */
  public static planNarrativeTree(
    semantic: SemanticSubjectExtraction,
    heroRole: string,
    supportingRole: string
  ): {
    interactionFlow: string[];
    visualNarrativeTree: VisualNarrativeTree;
  } {
    const primaryTool = semantic.physicalObjects[0] || 'workstation setup';
    const secondaryTool = semantic.physicalObjects[1] || 'analytical telemetry display';
    const primaryAction = semantic.visibleActions[0] || 'operation execution';

    const interactionFlow: string[] = [
      `1. Focal Point: ${heroRole} initiates ${primaryAction} using ${primaryTool}.`,
      `2. Secondary Interaction: ${supportingRole} reviews telemetry on ${secondaryTool}.`,
      `3. Contextual Backdrop: Integrated ${semantic.environment} providing structural domain relevance.`,
    ];

    const visualNarrativeTree: VisualNarrativeTree = {
      root: `${semantic.domain.toUpperCase()}${semantic.isMixedDomain ? ' + ' + (semantic.secondaryDomain || '').toUpperCase() : ''}: ${semantic.primarySubject}`,
      branches: [
        {
          node: `Hero Focus: ${heroRole}`,
          relationship: `Directly operates ${primaryTool}`,
          children: [`Action: ${primaryAction}`, `Tool: ${primaryTool}`],
        },
        {
          node: `Supporting Node: ${supportingRole}`,
          relationship: semantic.isMixedDomain ? `Manages ${semantic.secondaryDomain} infrastructure` : `Assists in ${primaryAction}`,
          children: [`Tool: ${secondaryTool}`],
        },
        {
          node: `Environment Setting: ${semantic.environment}`,
          relationship: 'Provides realistic physical workspace backdrop',
        },
      ],
    };

    return {
      interactionFlow,
      visualNarrativeTree,
    };
  }
}

export class StoryValidator {
  /**
   * Transparent, weighted, deterministic validation system.
   * Calculates validation score from empirical story quality criteria and records exact deductions.
   */
  public static validateStory(
    story: VisualStoryNarrative,
    semantic: SemanticSubjectExtraction
  ): StoryValidationReport {
    const deductions: ScoreDeduction[] = [];
    const findings: string[] = [];
    const passedCriteria: string[] = [];

    let score = 100;
    const lowerHero = (story.heroStory || '').toLowerCase();
    const lowerSupporting = (story.supportingStory || '').toLowerCase();

    // 1. Hero Subject Fidelity (Weight 20)
    if (!story.who || story.who.length === 0 || !story.who[0].role || story.who[0].role.trim().length < 3) {
      score -= 20;
      deductions.push({
        criterion: 'Hero Subject Fidelity',
        pointsDeducted: 20,
        reason: 'Missing or invalid hero character protagonist.',
        isCriticalFailure: true,
      });
      findings.push('Hero character is missing or invalid.');
    } else if (lowerHero.length < 25) {
      score -= 10;
      deductions.push({
        criterion: 'Hero Subject Fidelity',
        pointsDeducted: 10,
        reason: 'Hero story description is too brief (< 25 characters).',
      });
      findings.push('Hero story description is too brief.');
    } else {
      passedCriteria.push('Hero Subject Fidelity');
    }

    // 2. Supporting & Mixed-Domain Coverage (Weight 20)
    if (semantic.isMixedDomain && semantic.secondaryDomain) {
      const secDomainLower = semantic.secondaryDomain.toLowerCase();
      const hasSecondaryCoverage =
        lowerHero.includes(secDomainLower) ||
        lowerSupporting.includes(secDomainLower) ||
        story.who.some((w) => w.relationship.toLowerCase().includes(secDomainLower)) ||
        story.requiredVisualEvidence.some((e) => e.toLowerCase().includes(secDomainLower));

      if (!hasSecondaryCoverage) {
        score -= 15;
        deductions.push({
          criterion: 'Mixed-Domain Coverage',
          pointsDeducted: 15,
          reason: `Mixed-domain article omits representation of secondary domain "${semantic.secondaryDomain}".`,
        });
        findings.push(`Secondary domain "${semantic.secondaryDomain}" is absent from visual story.`);
      } else {
        passedCriteria.push('Mixed-Domain Coverage');
      }
    } else if (semantic.occupations.length > 1 && story.who.length < 2) {
      score -= 10;
      deductions.push({
        criterion: 'Supporting Subject Fidelity',
        pointsDeducted: 10,
        reason: 'Multiple occupations extracted but supporting subject is missing from story character list.',
      });
      findings.push('Supporting subject missing from story character list.');
    } else {
      passedCriteria.push('Supporting Subject Fidelity');
    }

    // 3. Visible Action Coverage (Weight 15)
    if (!story.actions || story.actions.length === 0) {
      score -= 15;
      deductions.push({
        criterion: 'Visible Action Coverage',
        pointsDeducted: 15,
        reason: 'No visible actions defined in story.',
      });
      findings.push('No visible actions defined.');
    } else {
      passedCriteria.push('Visible Action Coverage');
    }

    // 4. Environment Relevance (Weight 15)
    if (!story.context || story.context.trim().length < 10) {
      score -= 15;
      deductions.push({
        criterion: 'Environment Relevance',
        pointsDeducted: 15,
        reason: 'Environment context is missing or under 10 characters.',
      });
      findings.push('Environment context missing.');
    } else {
      passedCriteria.push('Environment Relevance');
    }

    // 5. Required Objects Grounding (Weight 15)
    if (!story.requiredVisualEvidence || story.requiredVisualEvidence.length === 0) {
      score -= 15;
      deductions.push({
        criterion: 'Required Objects Grounding',
        pointsDeducted: 15,
        reason: 'Required visual evidence list is empty.',
      });
      findings.push('Required visual evidence list empty.');
    } else {
      passedCriteria.push('Required Objects Grounding');
    }

    // 6. Prohibited Abstract Imagery Violations (Penalty 25 per item)
    const prohibitedAbstracts = ['glowing blue hologram', 'floating abstract circle', 'meaningless glowing cube', 'matrix text', 'glowing floating sphere'];
    for (const clutter of prohibitedAbstracts) {
      if (lowerHero.includes(clutter) || lowerSupporting.includes(clutter)) {
        score -= 25;
        deductions.push({
          criterion: 'Prohibited Abstract Imagery',
          pointsDeducted: 25,
          reason: `Prohibited abstract clutter detected: "${clutter}".`,
          isCriticalFailure: true,
        });
        findings.push(`Prohibited clutter detected: "${clutter}".`);
      }
    }

    // 7. Unrelated Occupation Penalty (Penalty 20 per item)
    const unrelatedOccupations = ['chef', 'pilot', 'astronaut', 'deep-sea diver', 'circus performer'];
    for (const offOcc of unrelatedOccupations) {
      if (lowerHero.includes(offOcc) || lowerSupporting.includes(offOcc)) {
        score -= 20;
        deductions.push({
          criterion: 'Unrelated Occupation Penalty',
          pointsDeducted: 20,
          reason: `Unrelated off-domain occupation detected: "${offOcc}".`,
        });
        findings.push(`Unrelated occupation detected: "${offOcc}".`);
      }
    }

    // 8. Conflicting Semantic Evidence (Penalty 20)
    if (lowerHero.includes('outdoor solar farm') && lowerHero.includes('closed dark basement')) {
      score -= 20;
      deductions.push({
        criterion: 'Internal Semantic Contradiction',
        pointsDeducted: 20,
        reason: 'Contradictory environment setting: outdoor solar farm inside closed dark basement.',
      });
      findings.push('Contradictory environment setting detected.');
    }

    // Normalize final score between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    const hasCriticalFailure = deductions.some((d) => d.isCriticalFailure);
    const isValid = finalScore >= 80 && !hasCriticalFailure;

    return {
      isValid,
      validationScore: finalScore,
      deductions,
      findings,
      passedCriteria,
    };
  }
}

export class StoryPriorityPlanner {
  /**
   * Determines story priority strategy and calculates story confidence dynamically.
   */
  public static planPriority(
    whoCount: number,
    actionCount: number,
    validationScore: number
  ): { storyPriority: StoryPriority; storyConfidence: number } {
    let storyPriority: StoryPriority = 'hero-first';

    if (whoCount > 2) {
      storyPriority = 'balanced-narrative';
    } else if (whoCount === 1) {
      storyPriority = 'hero-first';
    } else {
      storyPriority = 'contextual-story';
    }

    const storyConfidence = Math.min(100, Math.max(0, Math.round(validationScore * 0.9 + actionCount * 3.5)));

    return {
      storyPriority,
      storyConfidence,
    };
  }
}

export class VisualStoryEngine {
  /**
   * Core facade orchestrator: Converts semantic entities and brief data into a structured VisualStoryNarrative.
   */
  public static generateStory(
    brief: VisualIntelligenceBrief,
    semanticSubject?: SemanticSubjectExtraction
  ): VisualStoryResult {
    if (!brief || !brief.id) {
      throw new Error('INVALID_STORY_INPUT: VisualIntelligenceBrief is required for story generation.');
    }

    const semantic = semanticSubject || brief.semanticSubject || SemanticSubjectIntelligence.extract(brief.sanitizedSourceSummary || brief.centralMessage, brief.id);
    const timestamp = new Date().toISOString();

    // 1. Build Story Content
    const content = StoryBuilder.buildStoryContent(brief, semantic);

    // 2. Plan Narrative Tree & Interaction Flow
    const heroRole = content.who[0]?.role || 'Specialist';
    const supportingRole = content.who[1]?.role || 'Collaborator';
    const narrativePlan = NarrativePlanner.planNarrativeTree(semantic, heroRole, supportingRole);

    // 3. Determine Required Visual Evidence & Prohibited Imagery
    const requiredVisualEvidence = Array.from(new Set([
      ...semantic.elementsThatMustAppear,
      `Recognizable ${heroRole} in action`,
      `Visible ${semantic.physicalObjects[0] || 'professional tool'}`,
      `Setting inside ${semantic.environment}`,
    ]));

    if (semantic.isMixedDomain && semantic.secondaryDomain) {
      requiredVisualEvidence.push(`Visible ${semantic.secondaryDomain} operation evidence`);
    }

    const prohibitedImagery = Array.from(new Set([
      ...semantic.elementsThatMustNeverAppear,
      'generic floating graphics',
      'unrelated abstract symbols',
    ]));

    // 4. Deterministic Fingerprint
    const fpInput = `${brief.id}||${semantic.id}||${content.heroStory}`;
    const fingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');
    const storyId = `vse_${fingerprint.slice(0, 12)}`;

    // 5. Construct VisualStoryNarrative
    const story: VisualStoryNarrative = {
      id: storyId,
      briefId: brief.id,

      heroStory: content.heroStory,
      supportingStory: content.supportingStory,
      secondaryNarrative: content.secondaryNarrative,

      interactionFlow: narrativePlan.interactionFlow,
      visualNarrativeTree: narrativePlan.visualNarrativeTree,

      who: content.who,
      actions: content.actions,

      context: `Inside ${semantic.environment} within ${semantic.domain}${semantic.isMixedDomain ? ' and ' + semantic.secondaryDomain : ''} industry`,
      narrativePurpose: `Communicating authentic visual story of ${semantic.primarySubject}`,
      emotionalContext: semantic.emotionalEffect || 'Inspiring trust, clarity, and authority',

      requiredVisualEvidence,
      prohibitedImagery,

      storyPriority: 'hero-first',
      storyConfidence: 95,

      generatedAt: timestamp,
      fingerprint,
    };

    // 6. Validate & Determine Priority dynamically
    const validationReport = StoryValidator.validateStory(story, semantic);
    const priority = StoryPriorityPlanner.planPriority(content.who.length, content.actions.length, validationReport.validationScore);

    story.storyPriority = priority.storyPriority;
    story.storyConfidence = priority.storyConfidence;

    const result: VisualStoryResult = {
      briefId: brief.id,
      story,
      validationScore: validationReport.validationScore,
      isValid: validationReport.isValid,
      generatedAt: timestamp,
    };

    VisualStoryResultSchema.parse(result);

    return result;
  }
}
