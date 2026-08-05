import { z } from 'zod';

export const SemanticSubjectExtractionSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().optional(),

  domain: z.string().min(1),
  secondaryDomain: z.string().optional(),
  isMixedDomain: z.boolean().optional(),
  domainRelationships: z.array(z.string()).optional(),

  primarySubject: z.string().min(1),
  secondarySubjects: z.array(z.string()),

  occupations: z.array(z.string()),
  physicalObjects: z.array(z.string()),
  environment: z.string().min(1),
  location: z.string().min(1),
  visibleActions: z.array(z.string()),

  timePeriod: z.string().min(1),
  audience: z.string().min(1),
  mood: z.string().min(1),
  emotionalEffect: z.string().min(1),

  visualKeywords: z.array(z.string()),
  visualMetaphors: z.array(z.string()),

  elementsThatMustAppear: z.array(z.string()),
  elementsThatMustNeverAppear: z.array(z.string()),

  confidenceByElement: z.record(z.string(), z.number()),
  sourceEvidence: z.array(z.string()),
  deterministicFingerprint: z.string().min(1),
});
