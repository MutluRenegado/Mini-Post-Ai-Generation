import { GenerationResponse } from '@/app/api/orchestrate/route';

export interface StudioGenerationPayload {
  topic: string;
  action?: string;
  platforms?: string[];
  tone?: string;
  goal?: string;
  audience?: string;
  industry?: string;
  keywords?: string[];
  cta?: string;
  brandName?: string;
  currentText?: string;
  templateId?: string;
  userId?: string;
  userTier?: string;
  [key: string]: any;
}

export class StudioClientService {
  static async generate(payload: StudioGenerationPayload): Promise<GenerationResponse> {
    const topic = payload.topic || payload.currentText || payload.raw_idea || '';
    if (!topic || !topic.trim()) {
      return {
        success: false,
        requestId: `client_${Date.now()}`,
        error: {
          code: 'EMPTY_TOPIC',
          message: 'Please enter a valid topic or prompt before generating.',
        },
      };
    }

    try {
      const endpoint = typeof window !== 'undefined' ? '/api/orchestrate' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/orchestrate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_post',
          basePrompt: topic,
          masterText: topic,
          targetPlatforms: payload.platforms,
          ...payload,
          topic,
        }),
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok || !resData) {
        return {
          success: false,
          requestId: resData?.requestId || `req_err_${Date.now()}`,
          error: {
            code: resData?.error?.code || `HTTP_${response.status}`,
            message: resData?.error?.message || resData?.error || `Generation failed with status ${response.status}`,
          },
        };
      }

      if (!resData.success) {
        return {
          success: false,
          requestId: resData.requestId || `req_err_${Date.now()}`,
          error: {
            code: resData.error?.code || 'GENERATION_FAILED',
            message: resData.error?.message || resData.error || 'Generation failed.',
          },
        };
      }

      // Normalize data property
      const content =
        resData.data?.content ||
        resData.text ||
        resData.templates?.master_post ||
        resData.result?.masterPost ||
        '';

      const hashtags =
        resData.data?.hashtags ||
        resData.hashtags ||
        resData.templates?.hashtags ||
        [];

      const imagePrompt =
        resData.data?.imagePrompt ||
        resData.imagePrompt ||
        resData.templates?.imagePrompt ||
        `Photorealistic 8k visual for ${topic.slice(0, 50)}`;

      const imageUrl =
        resData.data?.imageUrl ||
        resData.imageUrl ||
        resData.result?.imageUrl ||
        resData.data?.metadata?.imageContract?.imageUrl;

      const imageMimeType =
        resData.data?.imageMimeType ||
        resData.imageMimeType ||
        resData.data?.metadata?.imageContract?.imageMimeType;

      const imageStatus =
        resData.data?.imageStatus ||
        resData.imageStatus ||
        resData.data?.metadata?.imageContract?.imageStatus;

      const storagePath =
        resData.data?.storagePath ||
        resData.storagePath ||
        resData.data?.metadata?.imageContract?.storagePath;

      const imageError =
        resData.data?.imageError ||
        resData.imageError ||
        resData.data?.metadata?.imageContract?.imageError;

      return {
        success: true,
        requestId: resData.requestId || `req_succ_${Date.now()}`,
        data: {
          title: resData.data?.title || topic.slice(0, 40),
          content,
          imagePrompt,
          imageUrl,
          imageMimeType,
          imageStatus,
          storagePath,
          imageError,
          hashtags,
          seo: resData.data?.seo,
          metadata: {
            ...resData,
          },
        },
      };
    } catch (err: any) {
      console.error('[StudioClientService.generate] Exception:', err);
      return {
        success: false,
        requestId: `client_err_${Date.now()}`,
        error: {
          code: 'NETWORK_ERROR',
          message: err?.message || 'Network error occurred while connecting to the studio pipeline.',
        },
      };
    }
  }

  static async recreateImage(payload: import('@/lib/ai-image-generator/images/image.types').ImageRecreationRequest): Promise<GenerationResponse> {
    try {
      const endpoint = typeof window !== 'undefined' ? '/api/orchestrate' : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/orchestrate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'recreate_image',
          ...payload,
        }),
      });

      const resData = await response.json().catch(() => null);

      if (!response.ok || !resData || !resData.success) {
        return {
          success: false,
          requestId: resData?.requestId || `req_err_${Date.now()}`,
          error: {
            code: resData?.error?.code || `HTTP_${response?.status || 500}`,
            message: resData?.error?.message || 'Image recreation failed.',
          },
        };
      }

      return {
        success: true,
        requestId: resData.requestId,
        data: {
          title: resData.data?.title || payload.postTopic.slice(0, 40),
          content: resData.data?.content || payload.postContent || payload.postTopic,
          imagePrompt: resData.data?.imagePrompt,
          imageUrl: resData.data?.imageUrl,
          imageMimeType: resData.data?.imageMimeType,
          imageStatus: resData.data?.imageStatus,
          storagePath: resData.data?.storagePath,
          imageError: resData.data?.imageError,
          metadata: resData.data?.metadata,
        },
      };
    } catch (err: any) {
      console.error('[StudioClientService.recreateImage] Exception:', err);
      return {
        success: false,
        requestId: `client_err_${Date.now()}`,
        error: {
          code: 'NETWORK_ERROR',
          message: err?.message || 'Network error during image recreation.',
        },
      };
    }
  }
}
