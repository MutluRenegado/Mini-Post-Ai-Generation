/**
 * Mini Post App - Video Production Technical Standard
 * Aligned with ISO/IEC 25010 (Performance & Compatibility) and EBU R128 Loudness Normalization.
 */

export interface VideoProductionStandardSpec {
  videoCodec: string;
  audioCodec: string;
  framerates: number[];
  targetLufs: number;
  maxBitrateMbps: number;
  frameworkAlignment: {
    iso25010: {
      performanceEfficiency: string;
      compatibility: string;
    };
    audioStandard: {
      loudnessNormalization: string;
    };
  };
}

export const VideoProductionStandard: VideoProductionStandardSpec = {
  videoCodec: 'H.264 / AAC',
  audioCodec: 'AAC-LC',
  framerates: [30, 60],
  targetLufs: -14,
  maxBitrateMbps: 20,
  frameworkAlignment: {
    iso25010: {
      performanceEfficiency: 'H.264 encoding optimized for low latency hardware acceleration',
      compatibility: 'Cross-platform MP4 container format playback support across mobile & web',
    },
    audioStandard: {
      loudnessNormalization: 'Normalized to -14 Integrated LUFS per web audio distribution standards',
    },
  },
};
