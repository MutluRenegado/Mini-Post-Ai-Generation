import { BrandService } from '@/lib/services/brandService';

export class StudioBrandEngine {
  static getActiveBrandRules() {
    return BrandService.getActiveBrandRules();
  }

  static updateBrandRules(rules: any) {
    return BrandService.saveBrandRules(rules);
  }
}
