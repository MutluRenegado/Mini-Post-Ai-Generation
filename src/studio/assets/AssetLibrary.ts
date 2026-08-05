import { BrandAssets } from './BrandAssets';
import { PromptAssets } from './PromptAssets';
import { MediaAssets } from './MediaAssets';

export class AssetLibrary {
  static getBrandKit() {
    return BrandAssets.getAssets();
  }

  static getPromptTemplates() {
    return PromptAssets.getPrompts();
  }

  static getMediaLibrary() {
    return MediaAssets.listMedia();
  }
}
