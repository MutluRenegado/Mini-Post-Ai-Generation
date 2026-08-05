import { StudioMarketplace } from '../marketplace/StudioMarketplace';
import { StudioOSDeveloperSDK } from '../sdk/StudioOSDeveloperSDK';
import { GAPlatformOps } from '../ga/GAPlatformOps';
import { StudioHealthService } from '../monitoring/StudioHealthService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Ecosystem Test Assertion Failed: ${message}`);
  }
}

export class StudioOS_Ecosystem_v7Runner {
  static async runFullEcosystemV7Tests(): Promise<{ passed: number; failed: number; log: string[] }> {
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

    // 1. Studio Marketplace Item Retrieval & Installation
    await runTest('1. Studio Marketplace Item Retrieval & Installation', () => {
      const items = StudioMarketplace.listMarketplaceItems();
      assert(items.length >= 2, 'Marketplace must have items');
      const installed = StudioMarketplace.installItem(items[0].id);
      assert(installed === true, 'Item installation must succeed');
    });

    // 2. Developer SDK Execution & OpenAPI Specification
    await runTest('2. Developer SDK Execution & OpenAPI Specification', async () => {
      const sdk = new StudioOSDeveloperSDK({ apiKey: 'sk_test_studio_v7_101' });
      const res = await sdk.generatePost('AI Enterprise Ecosystems', ['LinkedIn']);
      assert(res.status === 'success', 'SDK post generation must succeed');
      assert(res.qualityScore >= 92, 'SDK content quality score must be >= 92');

      const openApi = sdk.getOpenAPISpec();
      assert(openApi.info.version === '7.0.0', 'OpenAPI version must be 7.0.0');
    });

    // 3. Platform Health & Operations SLA
    await runTest('3. Platform Health & Operations SLA', () => {
      const health = StudioHealthService.getHealthOverview();
      assert(health.status === 'OPERATIONAL', 'System health must be OPERATIONAL');
    });

    return { passed, failed, log };
  }
}
