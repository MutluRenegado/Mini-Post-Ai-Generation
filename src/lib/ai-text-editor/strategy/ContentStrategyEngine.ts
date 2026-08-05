import { ContentType, StudioGoal, AudienceProfile, ToneConfig, TopicProfile } from '../models/ai.types';

export interface ContentStrategy {
  contentType: ContentType;
  writingFramework: string;
  structureTemplate: string[];
  wordCount: { min: number; max: number };
  angleDescription: string;
  uniqueDifferentiator: string;
}

export class ContentStrategyEngine {
  static build(
    topicProfile: TopicProfile,
    audienceProfile: AudienceProfile,
    toneConfig: ToneConfig
  ): ContentStrategy {
    const type = topicProfile.contentType;
    return {
      contentType: type,
      writingFramework: this.selectFramework(type, toneConfig),
      structureTemplate: this.buildStructure(type),
      wordCount: this.getWordCount(type, audienceProfile),
      angleDescription: this.buildAngle(topicProfile, audienceProfile),
      uniqueDifferentiator: this.buildDifferentiator(topicProfile, toneConfig),
    };
  }

  private static selectFramework(type: ContentType, tone: ToneConfig): string {
    const frameworks: Record<string, string> = {
      'Educational': 'PASS: Problem → Analysis → Solution → Summary',
      'Thought Leadership': 'AIDA: Attention → Interest → Desire → Action',
      'Promotional': 'PAS: Problem → Agitation → Solution',
      'Story': 'HSO: Hook → Story → Offer',
      'Tips': 'Listicle: Hook → Numbered insights → CTA',
      'Checklist': 'PREP: Point → Reason → Example → Point restated',
      'Comparison': 'BAB: Before → After → Bridge',
      'Case Study': 'STAR: Situation → Task → Action → Result',
      'Guide': 'SCQA: Situation → Complication → Question → Answer',
      'Tutorial': 'SB7: 7-step tutorial framework',
      'Announcement': 'WWW: What → Why it matters → What to do next',
      'Opinion': 'PEEL: Point → Evidence → Explanation → Link',
    };
    return frameworks[type] || frameworks['Educational'];
  }

  private static buildStructure(type: ContentType): string[] {
    const structures: Record<string, string[]> = {
      'Educational': ['Attention-grabbing hook', 'Problem statement', 'Core explanation', 'Key insights (3-5 points)', 'Practical application', 'CTA'],
      'Thought Leadership': ['Bold opening statement', 'Industry context', 'Unique perspective', 'Supporting evidence', 'Actionable takeaway', 'Discussion CTA'],
      'Promotional': ['Pain point hook', 'Agitate the problem', 'Present solution', 'Social proof', 'Urgency/scarcity', 'Direct CTA'],
      'Story': ['Relatable scene-setting', 'Conflict or challenge', 'Turning point', 'Resolution', 'Lesson learned', 'Soft CTA'],
      'Tips': ['Curiosity hook', 'Quick context', 'Tips 1-5 with explanation', 'Bonus tip', 'Save/share CTA'],
      'Checklist': ['Why this matters hook', 'The checklist items', 'What to do first', 'CTA to save'],
      'Announcement': ['News hook', 'What is happening', 'Why it matters', 'When/where/how', 'CTA to engage'],
      'Quote': ['The quote', 'Context', 'Personal reflection', 'Invitation to agree or disagree'],
    };
    return structures[type] || structures['Educational'];
  }

  private static getWordCount(type: ContentType, audience: AudienceProfile): { min: number; max: number } {
    const base: Record<string, [number, number]> = {
      'Educational': [300, 800],
      'Thought Leadership': [400, 900],
      'Promotional': [150, 400],
      'Story': [250, 600],
      'Tips': [200, 500],
      'Checklist': [150, 350],
      'Announcement': [100, 250],
      'Quote': [50, 150],
    };
    const [min, max] = base[type] || [200, 500];
    const multiplier = audience.formality === 'executive' ? 0.75 : 1;
    return { min: Math.round(min * multiplier), max: Math.round(max * multiplier) };
  }

  private static buildAngle(topic: TopicProfile, audience: AudienceProfile): string {
    return `Write from the perspective of addressing ${audience.segment} who ${audience.painPoints[0] || 'want to improve their results'}. Focus on ${topic.mainTopic} with emphasis on ${topic.relatedConcepts[0] || 'best practices'}.`;
  }

  private static buildDifferentiator(topic: TopicProfile, tone: ToneConfig): string {
    return `Use ${tone.powerWords.slice(0, 3).join(', ')} as power words. Reference ${topic.entities[0] || 'industry leaders'} where relevant. Avoid clichés and generic statements.`;
  }
}
