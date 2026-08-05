import { z } from 'zod';

export const SceneNodeTypeSchema = z.enum(['person', 'occupation', 'action', 'object', 'environment', 'location', 'visual_evidence']);
export const EdgeProvenanceSchema = z.enum(['direct', 'inferred']);

export const SceneNodeSchema = z.object({
  id: z.string().min(1),
  type: SceneNodeTypeSchema,
  label: z.string().min(1),
  category: z.string().min(1),
  domain: z.string().min(1),
  provenance: EdgeProvenanceSchema,
  sourceEvidence: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  attributes: z.record(z.string(), z.string()).optional(),
});

export const SceneEdgeSchema = z.object({
  id: z.string().min(1),
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  relationshipType: z.string().min(1),
  description: z.string().min(1),
  provenance: EdgeProvenanceSchema,
  confidence: z.number().min(0).max(1),
  isCrossDomain: z.boolean().optional(),
});

export const SceneGraphSchema = z.object({
  id: z.string().min(1),
  storyId: z.string().optional(),
  briefId: z.string().optional(),

  primaryDomain: z.string().min(1),
  secondaryDomain: z.string().optional(),
  isMixedDomain: z.boolean(),

  nodes: z.array(SceneNodeSchema),
  edges: z.array(SceneEdgeSchema),

  heroNodeId: z.string().optional(),
  environmentNodeId: z.string().optional(),
  supportingNodeIds: z.array(z.string()),

  directEvidenceCount: z.number().min(0),
  inferredEvidenceCount: z.number().min(0),
  isolatedNodeCount: z.number().min(0),

  generatedAt: z.string().min(1),
  fingerprint: z.string().min(1),
});

export const GraphValidationDefectSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(['critical', 'warning']),
  message: z.string().min(1),
  nodeId: z.string().optional(),
  edgeId: z.string().optional(),
});

export const SceneGraphResultSchema = z.object({
  briefId: z.string().optional(),
  graph: SceneGraphSchema,
  serializedJson: z.string().min(1),
  humanReadableSummary: z.string().min(1),
  validationScore: z.number().min(0).max(100),
  isValid: z.boolean(),
  defects: z.array(GraphValidationDefectSchema),
  generatedAt: z.string().min(1),
});
