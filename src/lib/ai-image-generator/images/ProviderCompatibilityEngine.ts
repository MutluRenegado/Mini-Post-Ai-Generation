import crypto from 'crypto';
import { ProviderCompatibilityCheckResult, ProviderCapabilitySpec } from './provider-compatibility.types';

export class ProviderCompatibilityEngine {
  private static PROVIDER_SPECS: Record<string, ProviderCapabilitySpec> = {
    google: {
      providerId: 'google',
      modelName: 'imagen-3.0-generate-002',
      supportedAspectRatios: ['1:1', '16:9', '4:5', '9:16', '1.91:1'],
      maxPromptLengthChars: 1024,
      supportsNegativePrompt: true,
      supportsSeed: true,
      supportsImageReference: true,
      serverSideOnly: true,
    },
    openai: {
      providerId: 'openai',
      modelName: 'dall-e-3',
      supportedAspectRatios: ['1:1', '16:9', '9:16'],
      maxPromptLengthChars: 4000,
      supportsNegativePrompt: false,
      supportsSeed: false,
      supportsImageReference: false,
      serverSideOnly: true,
    },
  };

  public static checkCompatibility(input: {
    providerId?: string;
    aspectRatio?: string;
    promptTextLength?: number;
    negativePromptProvided?: boolean;
    seedProvided?: boolean;
  }): ProviderCompatibilityCheckResult {
    const providerId = (input.providerId || 'google').toLowerCase();
    const spec = this.PROVIDER_SPECS[providerId] || this.PROVIDER_SPECS.google;

    const targetAspectRatio = input.aspectRatio || '1:1';
    const promptLength = input.promptTextLength || 0;
    const incompatibilities: string[] = [];
    let isRetryableFailure = false;

    // Check server key configuration without leaking secret values
    const hasApiKey = providerId === 'google'
      ? !!process.env.GOOGLE_GENERATIVE_AI_API_KEY || !!process.env.GEMINI_API_KEY
      : !!process.env.OPENAI_API_KEY;

    if (!hasApiKey) {
      incompatibilities.push(`SERVER_SECRET_MISSING: Provider '${providerId}' secret key is not configured on server.`);
      isRetryableFailure = false; // Configuration errors are non-retryable
    }

    if (!spec.supportedAspectRatios.includes(targetAspectRatio)) {
      incompatibilities.push(`UNSUPPORTED_ASPECT_RATIO: Provider '${providerId}' does not support aspect ratio '${targetAspectRatio}'.`);
    }

    if (promptLength > spec.maxPromptLengthChars) {
      incompatibilities.push(`PROMPT_LENGTH_EXCEEDED: Prompt length (${promptLength} chars) exceeds provider limit of ${spec.maxPromptLengthChars}.`);
    }

    if (input.negativePromptProvided && !spec.supportsNegativePrompt) {
      incompatibilities.push(`NEGATIVE_PROMPT_UNSUPPORTED: Provider '${providerId}' does not support negative prompts.`);
    }

    const isCompatible = incompatibilities.length === 0;

    let width = 1080;
    let height = 1080;
    if (targetAspectRatio === '16:9') { width = 1920; height = 1080; }
    else if (targetAspectRatio === '9:16') { width = 1080; height = 1920; }
    else if (targetAspectRatio === '4:5') { width = 1080; height = 1350; }
    else if (targetAspectRatio === '1.91:1') { width = 1200; height = 627; }

    const payload = `${providerId}|${spec.modelName}|${targetAspectRatio}|${isCompatible}`;
    const deterministicFingerprint = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      providerId: spec.providerId,
      modelName: spec.modelName,
      isCompatible,
      resolvedDimensions: { width, height },
      resolvedAspectRatio: targetAspectRatio,
      isRetryableFailure,
      incompatibilityReasons: isCompatible ? undefined : incompatibilities,
      secretsExposed: false,
      deterministicFingerprint,
    };
  }
}
