export interface ProviderCapabilitySpec {
  providerId: string;
  modelName: string;
  supportedAspectRatios: string[];
  maxPromptLengthChars: number;
  supportsNegativePrompt: boolean;
  supportsSeed: boolean;
  supportsImageReference: boolean;
  serverSideOnly: true;
}

export interface ProviderCompatibilityCheckResult {
  providerId: string;
  modelName: string;
  isCompatible: boolean;
  resolvedDimensions: { width: number; height: number };
  resolvedAspectRatio: string;
  isRetryableFailure: boolean;
  incompatibilityReasons?: string[];
  secretsExposed: false;
  deterministicFingerprint: string;
}
