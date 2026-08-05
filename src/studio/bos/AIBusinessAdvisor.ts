export interface StrategicRecommendation {
  id: string;
  category: 'publishing_schedule' | 'budget_allocation' | 'content_angle' | 'seo_opportunity';
  recommendation: string;
  supportingEvidence: string;
  expectedROI: string;
  impactScore: number;
}

export class AIBusinessAdvisor {
  static getStrategicRecommendations(): StrategicRecommendation[] {
    return [
      {
        id: 'rec_901',
        category: 'publishing_schedule',
        recommendation: 'Increase LinkedIn posting frequency for Logistics Educational Explainers to Tuesday 09:00 EST.',
        supportingEvidence: 'Historical engagement analytics show 45% higher CTR during Tuesday morning peak hours.',
        expectedROI: '+28% Lead Conversion',
        impactScore: 94,
      },
      {
        id: 'rec_902',
        category: 'budget_allocation',
        recommendation: 'Allocate 60% of LLM budget to Gemini 2.5 Flash for high-speed draft generation.',
        supportingEvidence: 'Gemini 2.5 Flash delivers 1,210ms response time at $0.0001/1k tokens with 96.2 quality score.',
        expectedROI: '$1,450/mo Cost Reduction',
        impactScore: 96,
      },
    ];
  }
}
