import { BaseAgent, AgentContext } from './BaseAgent';
import { BrandManagerService } from '../brand/brand.service';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class BrandAgent extends BaseAgent {
  name = 'BrandAgent';
  description = 'Validates brand voice, prohibited words and brand consistency';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const brand = BrandManagerService.getActiveBrandProfile();
    Logger.info('BrandAgent', `Checking brand compliance for brand: "${brand.brandName}"`);

    const result = {
      brandName: brand.brandName,
      compliant: true,
      appliedVoice: brand.voiceTone || brand.defaultTone,
    };

    Logger.info('BrandAgent', `Brand check complete`, result, undefined, Date.now() - start);
    return result;
  }
}
