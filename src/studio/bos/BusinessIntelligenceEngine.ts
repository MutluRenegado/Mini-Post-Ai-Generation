export interface BusinessMetrics {
  mrr: number;
  arr: number;
  churnRate: number;
  ltvToCac: number;
  contentAttributedRevenue: number;
  pipelineContribution: string;
}

export class BusinessIntelligenceEngine {
  static getMetrics(): BusinessMetrics {
    return {
      mrr: 148000,
      arr: 1776000,
      churnRate: 0.8,
      ltvToCac: 5.4,
      contentAttributedRevenue: 645000,
      pipelineContribution: '38.5%',
    };
  }

  static queryKnowledgeGraph(concept: string) {
    return {
      concept,
      relatedEntities: ['Customs Clearance', 'Incoterms 2020', 'Supply Chain Resiliency'],
      linkedCampaigns: ['Q3 Logistics Enterprise Campaign'],
      avgROI: '420%',
    };
  }
}
