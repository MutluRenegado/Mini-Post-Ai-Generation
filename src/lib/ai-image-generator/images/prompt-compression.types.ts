export interface PromptCompressionDelta {
  originalLengthChars: number;
  compressedLengthChars: number;
  reductionPercentage: number;
  removedRedundantTokens: string[];
  preservedMandatoryConstraints: string[];
}

export interface PromptCompressionResult {
  compressedPromptText: string;
  originalPromptFingerprint: string;
  compressedPromptFingerprint: string;
  delta: PromptCompressionDelta;
  providerTokenLimitCompliant: boolean;
}
