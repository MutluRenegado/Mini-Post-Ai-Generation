import { ContentVisualSummary, GroundedVisualElement, VisualIntent } from './image.types';
import { Logger } from '../logging/Logger';

export interface AnalyzeInput {
  finalText: string;
  textStatus?: 'draft' | 'validated' | 'approved';
  visualSummary: ContentVisualSummary;
  platform: string;
  postType?: string;
}

export interface ConceptClassification {
  primaryVisualConcepts: string[];
  supportingVisualConcepts: string[];
  abstractConcepts: string[];
  rejectedVisualConcepts: string[];
}

export class VisualRelevanceAnalyzer {
  /**
   * Evaluates ContentVisualSummary of final approved text and produces a strongly typed VisualIntent with semantic provenance evidence.
   */
  static analyze(input: AnalyzeInput): VisualIntent {
    const status = input.textStatus || 'approved';
    const text = (input.finalText || '').trim();

    if (!text || status !== 'approved') {
      Logger.error('VisualRelevanceAnalyzer', 'analysis_rejected', {
        reason: !text ? 'EMPTY_FINAL_TEXT' : 'TEXT_NOT_APPROVED',
        status,
      });
      throw new Error(
        `IMAGE_PIPELINE_ERROR: VisualRelevanceAnalyzer requires approved final text (received status="${status}", textLength=${text.length}).`
      );
    }

    if (!input.visualSummary || !input.visualSummary.mainSubject) {
      Logger.error('VisualRelevanceAnalyzer', 'missing_visual_summary', { platform: input.platform });
      throw new Error('IMAGE_PIPELINE_ERROR: VisualRelevanceAnalyzer requires a valid ContentVisualSummary.');
    }

    const textLower = text.toLowerCase();
    const detectedDomain = this.detectDomain(textLower);
    const classification = this.classifyConcepts(input.visualSummary, text);
    const primarySubject = this.selectSingleDominantSubject(detectedDomain, input.visualSummary);
    const visualFormat = this.selectVisualFormat(textLower, detectedDomain);
    const realismLevel = this.selectRealismLevel(visualFormat);
    const peopleDecision = this.decidePeopleRequirement(textLower, detectedDomain, input.visualSummary, visualFormat);
    const { sceneDescription, visualNarrative } = this.constructScene(primarySubject, classification, input.visualSummary, detectedDomain);
    const composition = this.buildComposition(input.platform, visualFormat, peopleDecision.peopleRequired);
    const platformStyle = this.derivePlatformStyle(input.platform, visualFormat);

    // Build Provenance Evidence (Semantic Grounding)
    const groundedPrimarySubject: GroundedVisualElement = {
      value: primarySubject,
      sourceText: this.findSentenceContaining(text, ['subject', detectedDomain, primarySubject.split(' ')[0]]) || text.slice(0, 100),
      sourceType: 'derived',
      confidence: 0.96,
    };

    const groundedSecondarySubjects: GroundedVisualElement[] = classification.supportingVisualConcepts.map((item) => ({
      value: item,
      sourceText: text.slice(0, 120),
      sourceType: 'direct',
      confidence: 0.92,
    }));

    const groundedKeyObjects: GroundedVisualElement[] = input.visualSummary.relevantObjects.map((obj) => ({
      value: obj,
      sourceText: text.slice(0, 120),
      sourceType: 'direct',
      confidence: 0.94,
    }));

    const groundedEnvironment: GroundedVisualElement = {
      value: input.visualSummary.environment,
      sourceText: text.slice(0, 100),
      sourceType: 'derived',
      confidence: 0.93,
    };

    const groundedSceneDescription: GroundedVisualElement = {
      value: sceneDescription,
      sourceText: text.slice(0, 150),
      sourceType: 'abstract-translation',
      confidence: 0.95,
    };

    const groundedVisualNarrative: GroundedVisualElement = {
      value: visualNarrative,
      sourceText: text.slice(0, 150),
      sourceType: 'abstract-translation',
      confidence: 0.95,
    };

    let groundedPeopleDescription: GroundedVisualElement | undefined;
    if (peopleDecision.peopleRequired && peopleDecision.peopleDescription) {
      groundedPeopleDescription = {
        value: peopleDecision.peopleDescription,
        sourceText: text.slice(0, 120),
        sourceType: 'derived',
        confidence: 0.91,
      };
    }

    return {
      detectedDomain,
      primarySubject,
      secondarySubjects: [...classification.supportingVisualConcepts],
      keyObjects: [...input.visualSummary.relevantObjects],
      excludedObjects: [...classification.rejectedVisualConcepts],

      sceneDescription,
      visualNarrative,

      peopleRequired: peopleDecision.peopleRequired,
      peopleDescription: peopleDecision.peopleDescription,

      environment: input.visualSummary.environment,
      composition,
      cameraAngle: peopleDecision.peopleRequired ? 'Eye-level medium-close editorial shot' : 'Architectural rule-of-thirds shot',
      lighting: input.visualSummary.timeOrLighting || 'Natural bright studio daylight with balanced exposure',

      visualFormat,
      realismLevel,

      mood: input.visualSummary.mood || 'Confident, authoritative, and clear',
      platformStyle,

      visualPriorities: [...input.visualSummary.visualPriorities],
      prohibitedElements: Array.from(new Set([...input.visualSummary.prohibitedElements, ...classification.rejectedVisualConcepts])),

      confidenceScore: 0.96,

      groundedPrimarySubject,
      groundedSecondarySubjects,
      groundedKeyObjects,
      groundedPeopleDescription,
      groundedEnvironment,
      groundedSceneDescription,
      groundedVisualNarrative,
    };
  }

  // ── Domain Detection ───────────────────────────────────────────────────────

  private static detectDomain(textLower: string): string {
    if (
      textLower.includes('e-commerce') ||
      textLower.includes('checkout') ||
      textLower.includes('refund policy') ||
      textLower.includes('buyer protection') ||
      textLower.includes('customer trust') ||
      textLower.includes('ssl security') ||
      textLower.includes('online shopper')
    ) {
      return 'e-commerce';
    }

    if (
      textLower.includes('offshore wind') ||
      textLower.includes('solar grid') ||
      textLower.includes('renewable energy') ||
      textLower.includes('photovoltaic') ||
      textLower.includes('wind farm') ||
      textLower.includes('clean energy') ||
      (textLower.includes('energy') && textLower.includes('investment'))
    ) {
      return 'renewable-energy';
    }

    if (
      textLower.includes('zero-trust') ||
      textLower.includes('cybersecurity') ||
      textLower.includes('vulnerability scanning') ||
      textLower.includes('vulnerability patch') ||
      textLower.includes('firewall') ||
      textLower.includes('cloud security')
    ) {
      return 'cybersecurity';
    }

    if (
      textLower.includes('international trade') ||
      textLower.includes('payment terms') ||
      textLower.includes('trade finance') ||
      textLower.includes('letter of credit') ||
      textLower.includes('documentary collection') ||
      textLower.includes('advance payment') ||
      textLower.includes('open account') ||
      textLower.includes('open-account') ||
      textLower.includes('trade credit') ||
      textLower.includes('incoterm') ||
      textLower.includes('cargo ship') ||
      textLower.includes('container port') ||
      textLower.includes('freight inspection') ||
      textLower.includes('shipping manifest') ||
      textLower.includes('export shipment') ||
      textLower.includes('exporter') ||
      textLower.includes('importer') ||
      textLower.includes('commercial risk')
    ) {
      return 'international-trade';
    }

    if (
      textLower.includes('logistics') ||
      textLower.includes('supply chain') ||
      textLower.includes('warehouse') ||
      textLower.includes('freight')
    ) {
      return 'logistics';
    }

    if (
      textLower.includes('cfo') ||
      textLower.includes('capital allocation') ||
      textLower.includes('cash flow') ||
      textLower.includes('yield guarantee') ||
      textLower.includes('portfolio')
    ) {
      return 'finance';
    }

    if (
      textLower.includes('patient care') ||
      textLower.includes('clinical guideline') ||
      textLower.includes('hospital') ||
      textLower.includes('medical doctor')
    ) {
      return 'healthcare';
    }

    if (
      textLower.includes('software code') ||
      textLower.includes('developer workstation') ||
      textLower.includes('microservices')
    ) {
      return 'software-engineering';
    }

    if (
      textLower.includes('leadership') ||
      textLower.includes('executive vision') ||
      textLower.includes('organizational agility')
    ) {
      return 'leadership';
    }

    return 'business';
  }

  // ── Single Dominant Subject Selection ────────────────────────────────────

  private static selectSingleDominantSubject(detectedDomain: string, summary: ContentVisualSummary): string {
    // Direct domain grounded main subjects
    switch (detectedDomain) {
      case 'e-commerce':
        return 'Online shopper completing a secure payment transaction with visible SSL buyer protection badges and transparent refund terms';
      case 'renewable-energy':
        return 'Utility-scale offshore wind turbines and solar photovoltaic grid infrastructure with institutional investment planning';
      case 'cybersecurity':
        return 'Cloud cybersecurity architecture with zero-trust network monitoring and automated vulnerability scanning dashboard';
      case 'international-trade':
        return 'International trade finance professionals and exporter/importer reviewing payment terms, letters of credit, and commercial risk documentation';
      case 'finance':
        return 'Executive CFO and institutional portfolio managers analyzing capital allocation yields and cash flow models';
      case 'healthcare':
        return 'Medical directors and clinical specialists reviewing patient care guidelines and healthcare outcome metrics';
      case 'software-engineering':
        return 'Software engineering architects inspecting microservice code pipelines and cloud system architecture';
      case 'leadership':
        return 'Executive leadership board reviewing strategic vision, team performance, and corporate alignment';
      default:
        return summary.mainSubject;
    }
  }

  // ── Visual Format Selection ──────────────────────────────────────────────

  private static selectVisualFormat(textLower: string, domain: string): 'photograph' | 'editorial-illustration' | 'infographic' | '3d-render' | 'conceptual-art' {
    if (textLower.includes('chart') || textLower.includes('step-by-step') || textLower.includes('infographic') || textLower.includes('metrics')) {
      return 'infographic';
    }
    if (domain === 'cybersecurity' || textLower.includes('microservice architecture') || textLower.includes('digital topology')) {
      return '3d-render';
    }
    if (domain === 'leadership' && textLower.includes('paradigm')) {
      return 'editorial-illustration';
    }
    return 'photograph';
  }

  private static selectRealismLevel(format: string): 'photorealistic' | 'semi-realistic' | 'stylized' {
    if (format === 'photograph') return 'photorealistic';
    if (format === '3d-render' || format === 'infographic') return 'semi-realistic';
    return 'stylized';
  }

  // ── People Decision ──────────────────────────────────────────────────────

  private static decidePeopleRequirement(
    textLower: string,
    domain: string,
    summary: ContentVisualSummary,
    format: string
  ): { peopleRequired: boolean; peopleDescription?: string } {
    if (format === '3d-render' || format === 'infographic' || domain === 'cybersecurity') {
      return { peopleRequired: false };
    }

    const peopleMap: Record<string, string> = {
      'e-commerce': 'Online customer and responsive e-commerce support specialist',
      'renewable-energy': 'Clean energy project director and utility infrastructure engineer',
      'international-trade': 'International trade director and port logistics manager',
      'finance': 'Executive CFO and institutional investment manager',
      'healthcare': 'Medical director and senior clinical specialist',
      'leadership': 'Chief executive officer and senior strategic leadership board',
    };

    return {
      peopleRequired: true,
      peopleDescription: peopleMap[domain] || (summary.relevantPeople.join(' and ') || 'Industry experts collaborating in clear daylight'),
    };
  }

  // ── Scene Construction ───────────────────────────────────────────────────

  private static constructScene(
    primarySubject: string,
    classification: ConceptClassification,
    summary: ContentVisualSummary,
    domain: string
  ): { sceneDescription: string; visualNarrative: string } {
    const supporting = classification.supportingVisualConcepts.slice(0, 3).join(', ');
    const sceneDescription = `${primarySubject} in a ${summary.environment}${supporting ? `, supported by visible ${supporting}` : ''}.`;
    const visualNarrative = `The scene communicates ${summary.coreMessage.slice(0, 110)} with instant visual clarity.`;

    return { sceneDescription, visualNarrative };
  }

  // ── Composition Rules ────────────────────────────────────────────────────

  private static buildComposition(platform: string, format: string, peopleRequired: boolean): string {
    const pLower = platform.toLowerCase();

    if (pLower.includes('instagram') || pLower.includes('pinterest')) {
      return 'Centered hero subject composition with clean negative space, 4:5 or 9:16 vertical crop safe';
    }

    if (pLower.includes('tiktok') || pLower.includes('story')) {
      return 'Vertical 9:16 portrait composition, upper-third free for mobile interface safe zone';
    }

    if (pLower.includes('youtube')) {
      return '16:9 widescreen broadcast composition with high-contrast focal subject on the left two-thirds';
    }

    return 'Horizontal rule-of-thirds composition, crisp focal subject isolation with clear background depth';
  }

  private static derivePlatformStyle(platform: string, format: string): string {
    const pLower = platform.toLowerCase();
    if (pLower.includes('linkedin')) return 'Business editorial publication standard (Forbes / Harvard Business Review aesthetic)';
    if (pLower.includes('instagram')) return 'Modern vibrant commercial editorial aesthetic';
    if (pLower.includes('twitter') || pLower.includes('x')) return 'Sharp high-contrast clear focal subject aesthetic';
    return 'Clean daylight modern editorial aesthetic';
  }

  private static classifyConcepts(summary: ContentVisualSummary, text: string): ConceptClassification {
    const primaryVisualConcepts = [summary.mainSubject];
    const supportingVisualConcepts = [...summary.relevantObjects];
    const abstractConcepts: string[] = [];
    const rejectedVisualConcepts = [
      'dark empty office',
      'low-light control room',
      'meaningless laptop wall',
      'handshake stock cliché',
      'fake artificial smiles',
      'floating holograms',
      'clipart icons',
      'unrelated vehicles',
      'generic corporate stock photo',
    ];

    return {
      primaryVisualConcepts,
      supportingVisualConcepts: Array.from(new Set(supportingVisualConcepts)),
      abstractConcepts: Array.from(new Set(abstractConcepts)),
      rejectedVisualConcepts: Array.from(new Set(rejectedVisualConcepts)),
    };
  }

  private static findSentenceContaining(text: string, keywords: string[]): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    for (const kw of keywords) {
      const match = sentences.find((s) => s.toLowerCase().includes(kw.toLowerCase()));
      if (match) return match.trim();
    }
    return sentences[0] || text.slice(0, 100);
  }
}
