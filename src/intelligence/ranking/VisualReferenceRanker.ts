import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { NormalizedQuery } from '../retrieval/retrieval.types';
import type { TransparentRankingResult, DetailedComponentScores, ComponentScoreDetail } from './ranking.types';
import { RankingWeights } from './RankingWeights';
import { RankingExplanationBuilder } from './RankingExplanationBuilder';
import { DiversityController } from '../diversity/DiversityController';

export class VisualReferenceRanker {
  /**
   * Transparent multi-component ranking engine.
   * Calculates explicit raw, weighted, evidence, and explanation breakdowns for every component.
   */
  static rankCandidate(
    reference: VisualReference,
    normalizedQuery: NormalizedQuery,
    rankPosition: number = 1
  ): TransparentRankingResult {
    const weights = RankingWeights.DEFAULT_CONFIG.weights;
    const query = normalizedQuery.originalQuery;

    // Helper score builder
    const createDetail = (
      name: string,
      raw: number,
      w: number,
      ev: string,
      exp: string
    ): ComponentScoreDetail => ({
      componentName: name,
      rawScore: raw,
      weight: w,
      weightedScore: Math.round(raw * w * 100) / 100,
      evidence: ev,
      explanation: exp,
    });

    // 1. Component Matches
    const topicQuery = normalizedQuery.normalizedTopic || normalizedQuery.normalizedSubject || '';
    let topicRaw = 0;
    let topicEv = 'No topic match';
    if (topicQuery) {
      if (reference.title.toLowerCase().includes(topicQuery)) {
        topicRaw = 100;
        topicEv = `Title contains "${topicQuery}"`;
      } else if (reference.topic?.toLowerCase().includes(topicQuery)) {
        topicRaw = 100;
        topicEv = `Topic metadata contains "${topicQuery}"`;
      } else if (reference.description?.toLowerCase().includes(topicQuery) || reference.caption?.toLowerCase().includes(topicQuery)) {
        topicRaw = 80;
        topicEv = `Description/caption contains "${topicQuery}"`;
      } else {
        topicRaw = 0;
        topicEv = `Query topic "${topicQuery}" not found in title/topic/description`;
      }
    } else {
      topicRaw = 50;
      topicEv = 'No query topic specified';
    }

    const industryRaw = query.industry && reference.industry
      ? (reference.industry.toLowerCase().includes(normalizedQuery.normalizedIndustry || '') ? 100 : 0)
      : 50;

    const categoryRaw = query.category && reference.category
      ? (reference.category.toLowerCase() === query.category.toLowerCase() ? 100 : 0)
      : 50;

    const sceneRaw = query.scene && reference.scene
      ? (reference.scene.toLowerCase().includes(normalizedQuery.normalizedScene || '') ? 100 : 0)
      : 50;

    const subjectRaw = 50;
    const peopleRaw = query.people !== undefined
      ? (reference.peoplePresent === query.people ? 100 : 0)
      : 50;

    // Roles Overlap
    let roleRaw = 50;
    let roleEv = 'No role query specified';
    if (normalizedQuery.normalizedRoles.length > 0 && reference.professionalRoles) {
      const matchCount = normalizedQuery.normalizedRoles.filter((r) =>
        reference.professionalRoles?.some((pr) => pr.toLowerCase().includes(r))
      ).length;
      roleRaw = Math.round((matchCount / normalizedQuery.normalizedRoles.length) * 100);
      roleEv = `Matched ${matchCount}/${normalizedQuery.normalizedRoles.length} roles`;
    }

    const actionRaw = 50;

    // Objects Overlap
    let objectRaw = 50;
    let objectEv = 'No object query specified';
    if (normalizedQuery.normalizedObjects.length > 0 && reference.objects) {
      const matchCount = normalizedQuery.normalizedObjects.filter((o) =>
        reference.objects?.some((ro) => ro.toLowerCase().includes(o))
      ).length;
      objectRaw = Math.round((matchCount / normalizedQuery.normalizedObjects.length) * 100);
      objectEv = `Matched ${matchCount}/${normalizedQuery.normalizedObjects.length} objects`;
    }

    const environmentRaw = query.environment && reference.environment
      ? (reference.environment.toLowerCase().includes(query.environment.toLowerCase()) ? 100 : 40)
      : 50;

    const styleRaw = query.visualStyle && reference.photographyStyle
      ? (reference.photographyStyle.toLowerCase().includes(query.visualStyle.toLowerCase()) ? 100 : 40)
      : 50;

    const lightingRaw = query.lighting && reference.lighting
      ? (reference.lighting.toLowerCase().includes(query.lighting.toLowerCase()) ? 100 : 50)
      : 50;

    const compositionRaw = query.composition && reference.composition
      ? (reference.composition.toLowerCase().includes(query.composition.toLowerCase()) ? 100 : 50)
      : 50;

    const cameraAngleRaw = query.cameraAngle && reference.cameraAngle
      ? (reference.cameraAngle.toLowerCase().includes(query.cameraAngle.toLowerCase()) ? 100 : 50)
      : 50;

    const moodRaw = query.mood && reference.mood
      ? (reference.mood.toLowerCase().includes(query.mood.toLowerCase()) ? 100 : 50)
      : 50;

    const colorRaw = 50;

    const orientationRaw = query.orientation && reference.orientation
      ? (reference.orientation === query.orientation ? 100 : 20)
      : 50;

    const aspectRatioRaw = query.aspectRatio && reference.aspectRatio
      ? (reference.aspectRatio === query.aspectRatio ? 100 : 20)
      : 50;

    const technicalQualityScore = reference.qualityScores?.technicalQualityScore || 75;
    const curationQualityScore = reference.qualityScores?.overallQualityScore || 75;
    const approvalHistoryScore = reference.review?.status === 'APPROVED' ? 100 : 0;
    const rejectionPenalty = reference.review?.status === 'REJECTED' ? 100 : 0;

    // Diversity Penalties
    const diversity = DiversityController.calculateDiversityAdjustments(reference, {
      currentCampaignId: query.campaignId,
      currentTopic: query.topic,
    });

    const scores: DetailedComponentScores = {
      topicMatch: createDetail('topicMatch', topicRaw, weights.topicMatch, topicEv, `Topic score ${topicRaw}`),
      industryMatch: createDetail('industryMatch', industryRaw, weights.industryMatch, `Industry ${query.industry}`, `Industry score ${industryRaw}`),
      categoryMatch: createDetail('categoryMatch', categoryRaw, weights.categoryMatch, `Category ${query.category}`, `Category score ${categoryRaw}`),
      sceneMatch: createDetail('sceneMatch', sceneRaw, weights.sceneMatch, `Scene ${query.scene}`, `Scene score ${sceneRaw}`),
      subjectMatch: createDetail('subjectMatch', subjectRaw, weights.subjectMatch, 'Subject match', `Subject score ${subjectRaw}`),
      peopleMatch: createDetail('peopleMatch', peopleRaw, weights.peopleMatch, 'People match', `People score ${peopleRaw}`),
      roleMatch: createDetail('roleMatch', roleRaw, weights.roleMatch, roleEv, `Role score ${roleRaw}`),
      actionMatch: createDetail('actionMatch', actionRaw, weights.actionMatch, 'Action match', `Action score ${actionRaw}`),
      objectMatch: createDetail('objectMatch', objectRaw, weights.objectMatch, objectEv, `Object score ${objectRaw}`),
      environmentMatch: createDetail('environmentMatch', environmentRaw, weights.environmentMatch, `Environment ${query.environment}`, `Environment score ${environmentRaw}`),
      styleMatch: createDetail('styleMatch', styleRaw, weights.styleMatch, `Style ${query.visualStyle}`, `Style score ${styleRaw}`),
      lightingMatch: createDetail('lightingMatch', lightingRaw, weights.lightingMatch, `Lighting ${query.lighting}`, `Lighting score ${lightingRaw}`),
      compositionMatch: createDetail('compositionMatch', compositionRaw, weights.compositionMatch, `Composition ${query.composition}`, `Composition score ${compositionRaw}`),
      cameraAngleMatch: createDetail('cameraAngleMatch', cameraAngleRaw, weights.cameraAngleMatch, `Camera ${query.cameraAngle}`, `Camera angle score ${cameraAngleRaw}`),
      moodMatch: createDetail('moodMatch', moodRaw, weights.moodMatch, `Mood ${query.mood}`, `Mood score ${moodRaw}`),
      colorMatch: createDetail('colorMatch', colorRaw, weights.colorMatch, 'Color match', `Color score ${colorRaw}`),
      orientationMatch: createDetail('orientationMatch', orientationRaw, weights.orientationMatch, `Orientation ${query.orientation}`, `Orientation score ${orientationRaw}`),
      aspectRatioMatch: createDetail('aspectRatioMatch', aspectRatioRaw, weights.aspectRatioMatch, `Aspect ratio ${query.aspectRatio}`, `Aspect ratio score ${aspectRatioRaw}`),
      technicalQualityScore: createDetail('technicalQualityScore', technicalQualityScore, weights.technicalQualityScore, `Technical ${technicalQualityScore}`, `Technical quality score ${technicalQualityScore}`),
      curationQualityScore: createDetail('curationQualityScore', curationQualityScore, weights.curationQualityScore, `Curation ${curationQualityScore}`, `Curation quality score ${curationQualityScore}`),
      approvalHistoryScore: createDetail('approvalHistoryScore', approvalHistoryScore, 0.05, `Approval ${reference.review?.status}`, `Approval score ${approvalHistoryScore}`),
      rejectionPenalty: createDetail('rejectionPenalty', rejectionPenalty, 1.0, `Rejection penalty ${rejectionPenalty}`, `Rejection penalty ${rejectionPenalty}`),
      recentUsagePenalty: createDetail('recentUsagePenalty', diversity.usagePenalty + Math.abs(diversity.recencyAdjustment), 1.0, `Recent usage penalty ${diversity.usagePenalty}`, `Usage penalty ${diversity.usagePenalty}`),
      repeatedAssetPenalty: createDetail('repeatedAssetPenalty', diversity.repeatedAssetPenalty, 1.0, `Repeated asset penalty ${diversity.repeatedAssetPenalty}`, `Asset penalty ${diversity.repeatedAssetPenalty}`),
      repeatedScenePenalty: createDetail('repeatedScenePenalty', diversity.diversityPenalty, 1.0, `Repeated scene penalty ${diversity.diversityPenalty}`, `Scene penalty ${diversity.diversityPenalty}`),
      campaignDiversityPenalty: createDetail('campaignDiversityPenalty', 0, 1.0, 'No campaign penalty', 'Campaign penalty 0'),
      sourceAvailabilityPenalty: createDetail('sourceAvailabilityPenalty', reference.sourceAvailability === 'MISSING' ? 100 : 0, 1.0, `Availability ${reference.sourceAvailability}`, `Source availability penalty`),
    };

    // Calculate Raw Weighted Total
    const positiveWeightedSum =
      scores.topicMatch.weightedScore +
      scores.industryMatch.weightedScore +
      scores.categoryMatch.weightedScore +
      scores.sceneMatch.weightedScore +
      scores.roleMatch.weightedScore +
      scores.objectMatch.weightedScore +
      scores.environmentMatch.weightedScore +
      scores.styleMatch.weightedScore +
      scores.lightingMatch.weightedScore +
      scores.compositionMatch.weightedScore +
      scores.cameraAngleMatch.weightedScore +
      scores.moodMatch.weightedScore +
      scores.orientationMatch.weightedScore +
      scores.aspectRatioMatch.weightedScore +
      scores.technicalQualityScore.weightedScore +
      scores.curationQualityScore.weightedScore;

    const topicMismatchPenalty = (query.topic || query.subject) && topicRaw === 0 ? 30 : 0;

    const totalPenalties =
      scores.rejectionPenalty.rawScore +
      scores.recentUsagePenalty.rawScore +
      scores.repeatedAssetPenalty.rawScore +
      scores.repeatedScenePenalty.rawScore +
      scores.sourceAvailabilityPenalty.rawScore +
      topicMismatchPenalty;

    const rawScore = Math.round(positiveWeightedSum);
    const finalScore = Math.max(0, Math.min(100, Math.round(positiveWeightedSum - totalPenalties)));

    const humanReadableExplanation = RankingExplanationBuilder.buildExplanation(
      reference.title,
      finalScore,
      scores
    );

    return {
      candidateId: reference.id,
      title: reference.title,
      rawScore,
      finalScore,
      rankPosition,
      rankingVersion: RankingWeights.DEFAULT_CONFIG.version,
      selectionStatus: finalScore >= 75 ? 'TOP_MATCH' : finalScore >= 50 ? 'QUALIFIED' : 'DISQUALIFIED',
      componentScores: scores,
      humanReadableExplanation,
      reference,
    };
  }
}
