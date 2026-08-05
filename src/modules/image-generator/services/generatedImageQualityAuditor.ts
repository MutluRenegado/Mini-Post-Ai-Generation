import { AIImageProviderResponse } from '../types/ai-provider-adapter.types';
import { GeneratedImageFinding, GeneratedImageQualityResult } from '../types/generated-image-quality.types';
import { GeneratedImageQualityResultSchema } from '../schemas/generated-image-quality.schema';

export class GeneratedImageQualityAuditor {
  public static auditGeneratedImage(response: AIImageProviderResponse, expectedAspectRatio = '1:1'): GeneratedImageQualityResult {
    const findings: GeneratedImageFinding[] = [];

    if (!response.imageData || response.imageData.length === 0) {
      findings.push({
        id: 'f_payload_empty',
        code: 'PAYLOAD_EMPTY',
        severity: 'blocking',
        message: 'Image binary payload is empty.',
        category: 'payload',
        repairable: false,
      });
    }

    if (response.mimeType !== 'image/png' && response.mimeType !== 'image/jpeg' && response.mimeType !== 'image/webp') {
      findings.push({
        id: 'f_mime_unsupported',
        code: 'MIME_UNSUPPORTED',
        severity: 'error',
        message: `Unsupported MIME type: ${response.mimeType}`,
        category: 'format',
        repairable: true,
      });
    }

    if (response.width < 512 || response.height < 512) {
      findings.push({
        id: 'f_resolution_low',
        code: 'RESOLUTION_LOW',
        severity: 'warning',
        message: `Low resolution image (${response.width}x${response.height}). Recommend at least 1024x1024.`,
        category: 'dimension',
        repairable: true,
      });
    }

    const hasBlocking = findings.some((f) => f.severity === 'blocking');
    const hasError = findings.some((f) => f.severity === 'error');
    const passed = !hasBlocking && !hasError;
    const score = passed ? Math.max(70, 100 - findings.length * 10) : 40;

    const result: GeneratedImageQualityResult = {
      assetId: response.assetId,
      passed,
      score,
      findings,
      auditedAt: new Date().toISOString(),
      recommendations: findings.map((f) => `Fix ${f.code}: ${f.message}`),
      unavailableChecks: ['native_multimodal_vision', 'ocr_text_extraction', 'face_anatomy_detection'],
    };

    GeneratedImageQualityResultSchema.parse(result);
    return result;
  }
}
