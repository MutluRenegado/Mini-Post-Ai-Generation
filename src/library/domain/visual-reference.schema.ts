import { z } from 'zod';

export const RightsRecordSchema = z.object({
  rightsConfirmed: z.boolean(),
  ownerId: z.string().optional(),
  sourceProvider: z.string().min(1, 'Source provider is required'),
  licenceType: z.string().min(1, 'Licence type is required'),
  attributionRequired: z.boolean(),
  attributionText: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  commercialUseReviewStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NOT_APPLICABLE']),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
});

export const ReviewRecordSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_CHANGES', 'ARCHIVED']),
  reviewerId: z.string().optional(),
  reviewerName: z.string().optional(),
  reviewedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
  reviewerNotes: z.string().optional(),
});

export const QualityScoresSchema = z.object({
  relevanceScore: z.number().min(0).max(100).optional(),
  realismScore: z.number().min(0).max(100).optional(),
  compositionScore: z.number().min(0).max(100).optional(),
  technicalQualityScore: z.number().min(0).max(100).optional(),
  overallQualityScore: z.number().min(0).max(100).optional(),
});

export const MetadataUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  topic: z.string().optional(),
  industry: z.string().optional(),
  category: z.string().optional(),
  scene: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  peoplePresent: z.boolean().optional(),
  peopleCount: z.number().optional(),
  professionalRoles: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
  objects: z.array(z.string()).optional(),
  environment: z.string().optional(),
  photographyStyle: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  cameraAngle: z.string().optional(),
  composition: z.string().optional(),
  qualityScores: QualityScoresSchema.optional(),
  rights: RightsRecordSchema.partial().optional(),
});
