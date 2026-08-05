import { StudioRequest, ContentType } from '../models/ai.types';

export interface Intent {
  primary: ContentType;
  secondary?: ContentType;
  urgency: 'evergreen' | 'timely' | 'urgent';
  commercialIntent: number; // 0-1
  educationalIntent: number; // 0-1
  viralPotential: number; // 0-1
  emotionalTrigger: string;
  contentAngle: string;
}

export class IntentDetector {
  static detect(request: StudioRequest): Intent {
    const lower = (request.topic + ' ' + request.goal).toLowerCase();

    const educational = this.scoreIntent(lower, ['what is', 'how to', 'guide', 'explain', 'learn', 'understand', 'tutorial', 'tips']);
    const commercial = this.scoreIntent(lower, ['buy', 'sale', 'discount', 'product', 'service', 'offer', 'promote', 'launch']);

    return {
      primary: this.mapGoalToContentType(request.goal),
      urgency: this.detectUrgency(lower),
      commercialIntent: commercial,
      educationalIntent: educational,
      viralPotential: this.scoreViralPotential(lower, request.platforms),
      emotionalTrigger: this.detectEmotionalTrigger(lower, request.tone),
      contentAngle: this.selectContentAngle(lower, request.goal, request.tone),
    };
  }

  private static scoreIntent(lower: string, signals: string[]): number {
    const matched = signals.filter((s) => lower.includes(s)).length;
    return Math.min(matched / signals.length, 1);
  }

  private static mapGoalToContentType(goal: string): ContentType {
    const map: Record<string, ContentType> = {
      'Brand Awareness': 'Thought Leadership',
      'Promote Product': 'Promotional',
      'Promote Service': 'Promotional',
      'Blog Article': 'Guide',
      'Educational': 'Educational',
      'Event': 'Announcement',
      'Announcement': 'Announcement',
      'Discount': 'Promotional',
      'Testimonial': 'Story',
      'Quote': 'Quote',
      'Thought Leadership': 'Thought Leadership',
    };
    return map[goal] || 'Educational';
  }

  private static detectUrgency(lower: string): 'evergreen' | 'timely' | 'urgent' {
    if (lower.includes('today') || lower.includes('now') || lower.includes('urgent') || lower.includes('breaking')) return 'urgent';
    if (lower.includes('2024') || lower.includes('2025') || lower.includes('2026') || lower.includes('this week') || lower.includes('this year')) return 'timely';
    return 'evergreen';
  }

  private static scoreViralPotential(lower: string, platforms: string[]): number {
    let score = 0;
    const viralSignals = ['controversial', 'surprising', 'secret', 'nobody tells', 'shocking', 'mistake', 'truth about', 'myth', 'stop doing'];
    score += viralSignals.filter((s) => lower.includes(s)).length * 0.15;
    if (platforms.some((p) => p.toLowerCase().includes('tiktok'))) score += 0.2;
    if (platforms.some((p) => p.toLowerCase().includes('twitter'))) score += 0.15;
    return Math.min(score, 1);
  }

  private static detectEmotionalTrigger(lower: string, tone: string): string {
    if (lower.includes('mistake') || lower.includes('avoid') || lower.includes('danger')) return 'Fear of Loss';
    if (lower.includes('success') || lower.includes('achieve') || lower.includes('win')) return 'Aspiration';
    if (lower.includes('secret') || lower.includes('nobody') || lower.includes('hidden')) return 'Curiosity';
    if (lower.includes('save') || lower.includes('free') || lower.includes('discount')) return 'Value';
    if (tone === 'Inspirational') return 'Aspiration';
    if (tone === 'Bold') return 'Challenge';
    return 'Authority';
  }

  private static selectContentAngle(lower: string, goal: string, tone: string): string {
    if (lower.includes('mistake')) return 'Problem-Aware (Common Mistakes)';
    if (lower.includes('how to') || lower.includes('guide')) return 'Solution-Focused (Step-by-Step)';
    if (lower.includes('why')) return 'Insight-Driven (The Why)';
    if (goal === 'Thought Leadership') return 'Authority Positioning';
    if (goal === 'Promotional') return 'Benefit-Led (Value Proposition)';
    if (tone === 'Inspirational') return 'Transformation Story';
    return 'Educational Authority';
  }
}
