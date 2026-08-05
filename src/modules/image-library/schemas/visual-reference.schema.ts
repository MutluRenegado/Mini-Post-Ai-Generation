import { z } from 'zod';

export const ReviewStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'NEEDS_CHANGES',
  'ARCHIVED',
]);

export const SourceTypeSchema = z.enum([
  'Internal Upload',
  'Generated Approved',
  'Generated Rejected',
  'Licensed External',
  'Unsplash Reference',
  'Imported Folder',
]);

export const RightsRecordSchema = z.object({
  rightsConfirmed: z.boolean(),
  ownerId: z.string().optional(),
  sourceProvider: z.string().min(1, 'Source provider is required'),
  licenceType: z.string().min(1, 'Licence type is required'),
  attributionRequired: z.boolean(),
  attributionText: z.string().optional(),
  sourceUrl: z.string().url().or(z.literal('')).optional(),
  commercialUseReviewStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NOT_APPLICABLE']),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
});

export const ReviewRecordSchema = z.object({
  status: ReviewStatusSchema,
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

export const VisualReferenceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  caption: z.string().optional(),
  description: z.string().optional(),

  sourceType: SourceTypeSchema,
  sourceProvider: z.string(),
  originalFileName: z.string(),
  storagePath: z.string(),
  thumbnailPath: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number().positive(),

  checksum: z.string(),
  perceptualHash: z.string(),

  width: z.number().positive(),
  height: z.number().positive(),
  aspectRatio: z.string(),
  orientation: z.enum(['landscape', 'portrait', 'square']),

  topic: z.string().optional(),
  industry: z.string().optional(),
  category: z.string().optional(),
  scene: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  classificationState: z.enum(['SUGGESTED', 'MANUALLY_REVIEWED']).optional(),

  peoplePresent: z.boolean().optional(),
  peopleCount: z.number().optional(),
  peopleDescription: z.string().optional(),
  professionalRoles: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),

  objects: z.array(z.string()).optional(),
  products: z.array(z.string()).optional(),
  devices: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  environment: z.string().optional(),

  photographyStyle: z.string().optional(),
  realismLevel: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  cameraAngle: z.string().optional(),
  composition: z.string().optional(),
  colorPalette: z.array(z.string()).optional(),

  platformSuitability: z.array(z.string()).optional(),
  contentType: z.string().optional(),
  templateSuitability: z.array(z.string()).optional(),

  qualityScores: QualityScoresSchema.optional(),
  mustInclude: z.array(z.string()).optional(),
  mustAvoid: z.array(z.string()).optional(),

  rights: RightsRecordSchema,
  review: ReviewRecordSchema,

  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().default(1),
  usageCount: z.number().default(0),
  retrievalCount: z.number().default(0),
});

export const MetadataUpdateSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  topic: z.string().optional(),
  industry: z.string().optional(),
  category: z.string().optional(),
  scene: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  peoplePresent: z.boolean().optional(),
  peopleCount: z.number().optional(),
  peopleDescription: z.string().optional(),
  professionalRoles: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
  objects: z.array(z.string()).optional(),
  products: z.array(z.string()).optional(),
  devices: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  environment: z.string().optional(),
  photographyStyle: z.string().optional(),
  realismLevel: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  cameraAngle: z.string().optional(),
  composition: z.string().optional(),
  colorPalette: z.array(z.string()).optional(),
  platformSuitability: z.array(z.string()).optional(),
  mustInclude: z.array(z.string()).optional(),
  mustAvoid: z.array(z.string()).optional(),
});
