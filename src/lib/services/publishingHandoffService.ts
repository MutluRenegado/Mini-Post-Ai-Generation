import { DatabaseAssetRecord } from './secureAssetPersistenceService';
import { ImageVariant } from './platformSizingManager';
import { PlatformDispatcher, DispatchResult } from '@/studio/publishing/PlatformDispatcher';

export interface PublishingImageAsset {
  assetId: string;
  ownerId: string;
  postId?: string;
  campaignId?: string;

  source: string;
  kind: string;

  activeVariantId: string;
  platform: string;
  preset: string;

  imageUrl: string;
  storagePath?: string;
  width: number;
  height: number;
  mimeType: string;
  altText: string;

  creatorName?: string;
  creatorUrl?: string;
  sourcePageUrl?: string;

  attributionText?: string;
  attributionUrl?: string;
  attributionRequired: boolean;

  licenseName?: string;
  licenseUrl?: string;

  aiProvider?: string;
  aiModel?: string;
  aiVersion?: number;

  providerMetadata?: Record<string, unknown>;
}

export interface PlatformPublishingPayload {
  platform: string;
  postText: string;
  fullContentWithAttribution: string;
  imageAsset: PublishingImageAsset;
  timestamp: string;
}

export class PublishingHandoffService {
  /**
   * Constructs a canonical PublishingImageAsset from a persisted DatabaseAssetRecord and target platform.
   */
  public static buildPublishingAsset(
    record: DatabaseAssetRecord,
    targetPlatform: string
  ): PublishingImageAsset {
    if (!record) {
      throw new Error('INVALID_HANDOFF_INPUT: DatabaseAssetRecord is required for publishing handoff.');
    }

    // Locate target variant matching platform or fallback to active variant / first variant
    const variant: ImageVariant | undefined =
      record.platformVariants.find((v) =>
        v.platform.toLowerCase().includes(targetPlatform.toLowerCase()) ||
        targetPlatform.toLowerCase().includes(v.platform.toLowerCase())
      ) ||
      record.platformVariants.find((v) => v.id === record.activeVariantId) ||
      record.platformVariants[0];

    const variantId = variant?.id || `var_${record.assetId}_default`;
    const platformName = variant?.platform || targetPlatform;
    const presetName = variant?.preset || 'Standard Preset';
    const imageUrl = variant?.url || record.originalUrl;
    const width = variant?.width || record.width;
    const height = variant?.height || record.height;

    const isAttributionRequired = record.source === 'PEXELS' || record.source === 'PIXABAY' || record.source === 'UNSPLASH';

    return {
      assetId: record.assetId,
      ownerId: record.ownerId,
      postId: record.postId,
      campaignId: record.campaignId,
      source: record.source,
      kind: record.kind,

      activeVariantId: variantId,
      platform: platformName,
      preset: presetName,

      imageUrl,
      storagePath: record.originalStoragePath,
      width,
      height,
      mimeType: record.mimeType,
      altText: `${record.source} visual for ${platformName}`,

      creatorName: record.creatorName,
      creatorUrl: record.creatorUrl,
      sourcePageUrl: record.sourcePageUrl,

      attributionText: record.attributionText,
      attributionUrl: record.attributionUrl,
      attributionRequired: isAttributionRequired,

      licenseName: record.licenseName,

      aiProvider: record.aiProvider,
      aiModel: record.aiModel,
      aiVersion: record.selectedVersion ? 1 : undefined,

      providerMetadata: {
        sourceProviderId: record.sourceProviderId,
        unsplashTrackedState: record.unsplashTrackedState,
        pixabayStoredState: record.pixabayStoredState,
      },
    };
  }

  /**
   * Constructs the final platform publishing payload appending attribution text where required.
   */
  public static createPlatformPayload(
    publishingAsset: PublishingImageAsset,
    postText: string
  ): PlatformPublishingPayload {
    let fullContent = postText.trim();

    if (publishingAsset.attributionRequired && publishingAsset.attributionText) {
      fullContent = `${fullContent}\n\n📷 ${publishingAsset.attributionText}`;
    }

    return {
      platform: publishingAsset.platform,
      postText: postText.trim(),
      fullContentWithAttribution: fullContent,
      imageAsset: publishingAsset,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Dispatches the final platform payload through the existing PlatformDispatcher.
   */
  public static async dispatchToPlatform(
    record: DatabaseAssetRecord,
    platform: string,
    postText: string
  ): Promise<{ success: boolean; payload: PlatformPublishingPayload; result: DispatchResult }> {
    const asset = this.buildPublishingAsset(record, platform);
    const payload = this.createPlatformPayload(asset, postText);

    const result = await PlatformDispatcher.dispatch(platform, payload.fullContentWithAttribution);

    return {
      success: result.success,
      payload,
      result,
    };
  }
}
