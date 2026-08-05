import type { ComponentScores, RankingResult, VisualReference } from '../models/visual-reference.model';
import { DiversityController } from './diversity-controller';

export interface VisualRankingQuery {
  topic?: string;
  industry?: string;
  category?: string;
  scene?: string;
  subjects?: string[];
  people?: boolean;
  roles?: string[];
  objects?: string[];
  environment?: string;
  visualStyle?: string;
  lighting?: string;
  composition?: string;
  mood?: string;
  platform?: string;
  aspectRatio?: string;
  campaignId?: string;
}

export class VisualRankingService {
  /**
   * Transparent multi-component ranking engine.
   * Evaluates candidate references against query criteria and outputs explicit score breakdown & human-readable explanation.
   */
  static rankCandidate(
    reference: VisualReference,
    query: VisualRankingQuery
  ): RankingResult {
    // 1. Mandatory Rights & Status Gating Check
    const isApproved = reference.review?.status === 'APPROVED';
    const isRightsConfirmed = reference.rights?.rightsConfirmed === true;
    const isCommercialApproved = reference.rights?.commercialUseReviewStatus === 'APPROVED';
    const isAvailable = reference.sourceAvailability !== 'MISSING';
    const isArchived = reference.review?.status === 'ARCHIVED';
    const isRejected = reference.review?.status === 'REJECTED';

    const isQualified =
      isApproved &&
      isRightsConfirmed &&
      isCommercialApproved &&
      isAvailable &&
      !isArchived &&
      !isRejected;

    // 2. Component Score Calculations
    const industryMatch =
      query.industry && reference.industry
        ? query.industry.toLowerCase() === reference.industry.toLowerCase()
          ? 100
          : 0
        : 50;

    const categoryMatch =
      query.category && reference.category
        ? query.category.toLowerCase() === reference.category.toLowerCase()
          ? 100
          : 0
        : 50;

    const sceneMatch =
      query.scene && reference.scene
        ? reference.scene.toLowerCase().includes(query.scene.toLowerCase())
          ? 100
          : 0
        : 50;

    const topicQuery = query.topic?.toLowerCase() || '';
    let metadataSimilarity = 50;
    if (topicQuery) {
      const inTitle = reference.title.toLowerCase().includes(topicQuery);
      const inTopic = reference.topic?.toLowerCase().includes(topicQuery);
      const inDesc = reference.description?.toLowerCase().includes(topicQuery) || reference.caption?.toLowerCase().includes(topicQuery);

      if (inTitle || inTopic) {
        metadataSimilarity = 100;
      } else if (inDesc) {
        metadataSimilarity = 80;
      } else {
        metadataSimilarity = 30;
      }
    }

    const aspectRatioMatch =
      query.aspectRatio && reference.aspectRatio
        ? query.aspectRatio === reference.aspectRatio
          ? 100
          : 20
        : 50;

    const platformMatch =
      query.platform && reference.platformSuitability
        ? reference.platformSuitability.includes(query.platform)
          ? 100
          : 50
        : 50;

    const styleMatch =
      query.visualStyle && reference.photographyStyle
        ? query.visualStyle.toLowerCase() === reference.photographyStyle.toLowerCase()
          ? 100
          : 40
        : 50;

    const lightingMatch =
      query.lighting && reference.lighting
        ? query.lighting.toLowerCase() === reference.lighting.toLowerCase()
          ? 100
          : 50
        : 50;

    const compositionMatch =
      query.composition && reference.composition
        ? query.composition.toLowerCase() === reference.composition.toLowerCase()
          ? 100
          : 50
        : 50;

    const moodMatch =
      query.mood && reference.mood
        ? query.mood.toLowerCase() === reference.mood.toLowerCase()
          ? 100
          : 50
        : 50;

    // Objects overlap
    let objectMatch = 50;
    if (query.objects && query.objects.length > 0 && reference.objects) {
      const matchCount = query.objects.filter((obj) =>
        reference.objects?.some((ro) => ro.toLowerCase().includes(obj.toLowerCase()))
      ).length;
      objectMatch = Math.round((matchCount / query.objects.length) * 100);
    }

    // Roles overlap
    let roleMatch = 50;
    if (query.roles && query.roles.length > 0 && reference.professionalRoles) {
      const matchCount = query.roles.filter((role) =>
        reference.professionalRoles?.some((pr) => pr.toLowerCase().includes(role.toLowerCase()))
      ).length;
      roleMatch = Math.round((matchCount / query.roles.length) * 100);
    }

    const peopleMatch = query.people !== undefined
      ? reference.peoplePresent === query.people
        ? 100
        : 0
      : 50;

    const environmentMatch = query.environment && reference.environment
      ? reference.environment.toLowerCase().includes(query.environment.toLowerCase())
        ? 100
        : 40
      : 50;

    const subjectMatch = 50;
    const qualityScore = reference.qualityScores?.overallQualityScore || 75;
    const approvalScore = isApproved ? 100 : 0;
    const rejectionPenalty = isRejected ? -100 : 0;

    // 3. Diversity Adjustments
    const diversity = DiversityController.calculateDiversityAdjustments(reference, {
      currentCampaignId: query.campaignId,
      currentTopic: query.topic,
      currentPlatform: query.platform,
    });

    const componentScores: ComponentScores = {
      metadataSimilarity,
      industryMatch,
      categoryMatch,
      sceneMatch,
      subjectMatch,
      peopleMatch,
      roleMatch,
      objectMatch,
      environmentMatch,
      styleMatch,
      lightingMatch,
      compositionMatch,
      moodMatch,
      platformMatch,
      aspectRatioMatch,
      qualityScore,
      approvalScore,
      rejectionPenalty,
      diversityPenalty: diversity.diversityPenalty,
      usagePenalty: diversity.usagePenalty,
      recencyAdjustment: diversity.recencyAdjustment,
    };

    // 4. Weighted Final Score Computation
    if (!isQualified) {
      return {
        candidateId: reference.id,
        title: reference.title,
        finalScore: 0,
        componentScores,
        rankingVersion: '2.0.0-metadata-transparent',
        explanation: `DISQUALIFIED: Reference "${reference.title}" failed mandatory approval/rights gating (Status: ${reference.review?.status}, Rights: ${reference.rights?.rightsConfirmed}).`,
        selectionStatus: 'DISQUALIFIED',
        reference,
      };
    }

    const weightedScore =
      metadataSimilarity * 0.25 +
      industryMatch * 0.15 +
      sceneMatch * 0.15 +
      styleMatch * 0.10 +
      aspectRatioMatch * 0.10 +
      qualityScore * 0.15 +
      objectMatch * 0.10 -
      diversity.usagePenalty -
      diversity.diversityPenalty +
      diversity.recencyAdjustment;

    const finalScore = Math.max(0, Math.min(100, Math.round(weightedScore)));

    const explanation = `Ranked candidate "${reference.title}" (Score: ${finalScore}/100) — Metadata Match: ${metadataSimilarity}%, Industry Match: ${industryMatch}%, Scene Match: ${sceneMatch}%, Style: ${styleMatch}%, Aspect Ratio: ${aspectRatioMatch}%, Quality: ${qualityScore}, Usage Penalty: -${diversity.usagePenalty}.`;

    return {
      candidateId: reference.id,
      title: reference.title,
      finalScore,
      componentScores,
      rankingVersion: '2.0.0-metadata-transparent',
      explanation,
      selectionStatus: finalScore >= 75 ? 'TOP_MATCH' : 'QUALIFIED',
      reference,
    };
  }
}
