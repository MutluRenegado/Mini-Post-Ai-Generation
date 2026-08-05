import { BusinessIntelligenceEngine } from '../bos/BusinessIntelligenceEngine';
import { AIBusinessAdvisor } from '../bos/AIBusinessAdvisor';
import { CloudPlatformManager } from '../cloud/CloudPlatformManager';
import { StudioHealthService } from '../monitoring/StudioHealthService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`AI-BOS Test Assertion Failed: ${message}`);
  }
}

export class StudioOS_AIBOS_v9Runner {
  static async runFullAIBOSV9Tests(): Promise<{ passed: number; failed: number; log: string[] }> {
    const log: string[] = [];
    let passed = 0;
    let failed = 0;

    const runTest = async (testName: string, testFn: () => void | Promise<void>) => {
      try {
        await testFn();
        passed++;
        log.push(`✅ [PASS] ${testName}`);
      } catch (err: any) {
        failed++;
        log.push(`❌ [FAIL] ${testName}: ${err?.message}`);
      }
    };

    // 1. Business Intelligence Engine Metrics & Revenue Attribution
    await runTest('1. Business Intelligence Engine Metrics & Revenue Attribution', () => {
      const metrics = BusinessIntelligenceEngine.getMetrics();
      assert(metrics.arr > 1000000, 'ARR must exceed $1M');
      assert(metrics.contentAttributedRevenue > 500000, 'Attributed revenue must exceed $500k');
    });

    // 2. Knowledge Graph Semantic Querying
    await runTest('2. Knowledge Graph Semantic Querying', () => {
      const graph = BusinessIntelligenceEngine.queryKnowledgeGraph('Customs Strategy');
      assert(graph.relatedEntities.length >= 2, 'Knowledge graph must return linked entities');
    });

    // 3. AI Business Advisor Strategic Recommendations
    await runTest('3. AI Business Advisor Strategic Recommendations', () => {
      const recs = AIBusinessAdvisor.getStrategicRecommendations();
      assert(recs.length >= 2, 'Advisor must output strategic recommendations');
      assert(recs.every((r) => r.impactScore >= 90), 'Recommendations must have impact score >= 90');
    });

    return { passed, failed, log };
  }
}
