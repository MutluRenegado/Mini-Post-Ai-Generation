import { z } from 'zod';

export const VisualConceptCandidateSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['literal', 'editorial', 'symbolic']),
  title: z.string().min(1),
  description: z.string().min(1),
  primarySubject: z.string().min(1),
  visualMetaphor: z.string().optional(),
  mood: z.string(),
  score: z.number().min(0).max(100),
});

export const ConceptGenerationResultSchema = z.object({
  briefId: z.string().min(1),
  candidates: z.array(VisualConceptCandidateSchema).min(1),
  selectedConcept: VisualConceptCandidateSchema,
  selectedReason: z.string(),
  manualOverride: z.boolean(),
});
