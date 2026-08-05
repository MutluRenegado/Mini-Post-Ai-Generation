import { AssetsService } from '@/lib/services/assetsService';

export class StudioAssetEngine {
  static getAssets() {
    return AssetsService.getStoredAssets();
  }

  static addAsset(asset: any) {
    return AssetsService.addAsset(asset);
  }
}

