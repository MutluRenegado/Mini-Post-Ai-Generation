export type SceneNodeType = 'person' | 'occupation' | 'action' | 'object' | 'environment' | 'location' | 'visual_evidence';
export type EdgeProvenance = 'direct' | 'inferred';

export interface SceneNode {
  id: string;
  type: SceneNodeType;
  label: string;
  category: string;
  domain: string;
  provenance: EdgeProvenance;
  sourceEvidence: string[];
  confidence: number;
  attributes?: Record<string, string>;
}

export interface SceneEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  description: string;
  provenance: EdgeProvenance;
  confidence: number;
  isCrossDomain?: boolean;
}

export interface SceneGraph {
  id: string;
  storyId?: string;
  briefId?: string;

  primaryDomain: string;
  secondaryDomain?: string;
  isMixedDomain: boolean;

  nodes: SceneNode[];
  edges: SceneEdge[];

  heroNodeId?: string;
  environmentNodeId?: string;
  supportingNodeIds: string[];

  directEvidenceCount: number;
  inferredEvidenceCount: number;
  isolatedNodeCount: number;

  generatedAt: string;
  fingerprint: string;
}

export interface GraphValidationDefect {
  code: string;
  severity: 'critical' | 'warning';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface SceneGraphResult {
  briefId?: string;
  graph: SceneGraph;
  serializedJson: string;
  humanReadableSummary: string;
  validationScore: number;
  isValid: boolean;
  defects: GraphValidationDefect[];
  generatedAt: string;
}
