/**
 * Mini Post App - Publishing Hashtag Standard
 * Informed by Social Platform Discovery & Anti-Spam Guidelines.
 */

export interface HashtagStandardSpec {
  prohibitedHashtags: string[];
  maxHashtagLength: number;
  frameworkAlignment: {
    platformRules: {
      antiSpam: string;
    };
  };
}

export const HashtagStandard: HashtagStandardSpec = {
  prohibitedHashtags: ['follow4follow', 'like4like', 'f4f', 'l4l', 'sub4sub'],
  maxHashtagLength: 30,
  frameworkAlignment: {
    platformRules: {
      antiSpam: 'Blocks repetitive, low-relevance, or shadowbanned engagement pods and hashtag spam',
    },
  },
};
