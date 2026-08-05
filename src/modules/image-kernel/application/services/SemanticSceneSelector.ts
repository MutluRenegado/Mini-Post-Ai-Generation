import type { ImageScene } from '../../domain/entities/ImageScene';

export interface SceneSelectionInput {
  readonly topic: string;
  readonly content?: string;
  readonly platform?: string;
  readonly postType?: string;
  readonly domain?: string;
}

const PEOPLE_DOMAINS = ['business', 'finance', 'trade', 'technology', 'marketing', 'education', 'healthcare', 'management', 'legal'];

export class SemanticSceneSelector {
  public select(input: SceneSelectionInput): ImageScene {
    const mainText = (input.content && input.content.trim()) ? input.content : input.topic;
    const text = mainText.toLowerCase();
    const domain = input.domain ?? this.inferDomain(text);
    const primarySubject = this.subjectFor(domain);
    const visibleAction = this.actionFor(domain, text);
    const supportingObjects = this.objectsFor(domain);
    const backgroundContext = this.backgroundFor(domain);
    const communicationGoal = `Communicate the practical meaning of: ${mainText.slice(0, 80)}`;
    const readerIntent = `Help the viewer understand the key decision, action, or outcome in ${mainText.slice(0, 80)}`;

    return {
      exactTopic: mainText.slice(0, 100),
      communicationGoal,
      readerIntent,
      domain,
      primarySubject,
      visibleAction,
      supportingObjects,
      backgroundContext,
      emotionalTone: 'clear, credible, modern, professional',
      platform: input.platform ?? 'generic',
      postType: input.postType ?? 'post',
      visualStory: {
        who: primarySubject,
        action: visibleAction,
        evidence: supportingObjects,
        setting: backgroundContext,
        viewerTakeaway: communicationGoal,
      },
    };
  }

  private inferDomain(text: string): string {
    if (/office interior|office design|interior architecture|warehouse design|data center design|building layout|real estate|environment design/.test(text)) return 'environment-design';
    if (/trade|incoterm|letter of credit|payment term|export|import/.test(text)) return 'trade';
    if (/finance|bank|cash flow|investment|risk/.test(text)) return 'finance';
    if (/health|medical|clinical|doctor|hospital/.test(text)) return 'healthcare';
    if (/education|school|teacher|student|learning/.test(text)) return 'education';
    if (/marketing|brand|campaign|audience|content/.test(text)) return 'marketing';
    if (/software|technology|ai|system|developer/.test(text)) return 'technology';
    if (/factory|manufacturing|production|industrial/.test(text)) return 'manufacturing';
    return 'business';
  }

  private subjectFor(domain: string): string {
    const map: Record<string, string> = {
      trade: 'international trade finance executives and commercial risk specialists',
      finance: 'CFOs and financial risk analysts',
      healthcare: 'qualified clinicians and healthcare professionals',
      education: 'teachers and learners actively engaged with the lesson',
      marketing: 'creative directors and campaign strategists',
      technology: 'software architects and engineers',
      manufacturing: 'manufacturing engineers and quality specialists',
      'environment-design': 'the designed environment itself',
      business: 'business leaders and subject-matter experts',
    };
    return map[domain] ?? map.business;
  }

  private actionFor(domain: string, _text: string): string {
    const map: Record<string, string> = {
      trade: 'analyzing contracts, payment terms, and cross-border risk evidence',
      finance: 'comparing risk, cash-flow, and financial decision evidence',
      healthcare: 'reviewing relevant clinical information and discussing the next action',
      education: 'teaching and applying the central concept with visible learning materials',
      marketing: 'evaluating campaign materials, audience data, and content strategy',
      technology: 'reviewing a clear system architecture and discussing implementation decisions',
      manufacturing: 'inspecting a process, technical plan, and quality evidence',
      'environment-design': 'showing the environment as the explicit subject of the article',
      business: 'reviewing evidence and making a concrete professional decision',
    };
    return map[domain] ?? map.business;
  }

  private objectsFor(domain: string): readonly string[] {
    const map: Record<string, readonly string[]> = {
      trade: ['contracts', 'letters of credit', 'risk matrix', 'bank guarantee documents'],
      finance: ['financial reports', 'cash-flow chart', 'risk model', 'decision notes'],
      healthcare: ['clinical chart', 'diagnostic image', 'appropriate medical equipment'],
      education: ['lesson materials', 'diagram', 'worked example'],
      marketing: ['campaign boards', 'audience chart', 'content calendar'],
      technology: ['system diagram', 'architecture flow', 'technical notes'],
      manufacturing: ['technical drawing', 'quality checklist', 'production component'],
      'environment-design': ['materials', 'lighting features', 'spatial layout'],
      business: ['reports', 'decision framework', 'relevant documents'],
    };
    return map[domain] ?? map.business;
  }

  private backgroundFor(domain: string): string {
    if (domain === 'environment-design') return 'the environment is intentionally the primary subject';
    return 'a bright, modern, context-appropriate professional setting kept clearly subordinate to the people and action';
  }
}
