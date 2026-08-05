export type ConstraintType = 'REQUIRED' | 'PREFERRED' | 'AVOID';

export type VisibilityScope = 'PRIVATE' | 'ORGANIZATION' | 'GLOBAL_APPROVED';

export interface QueryConstraint {
  field: string;
  value: string | string[] | boolean;
  type: ConstraintType;
  weight?: number;
  explanation?: string;
}

export interface VisualReferenceQuery {
  queryId: string;
  subject?: string;
  topic?: string;
  industry?: string;
  category?: string;
  scene?: string;
  subjects?: string[];
  people?: boolean;
  roles?: string[];
  actions?: string[];
  objects?: string[];
  environment?: string;
  visualStyle?: string;
  lighting?: string;
  composition?: string;
  cameraAngle?: string;
  mood?: string;
  colors?: string[];
  orientation?: 'landscape' | 'portrait' | 'square';
  aspectRatio?: string;
  intendedUse?: string;

  // Scoping & Identity
  organizationId?: string;
  userId?: string;
  campaignId?: string;
  visibilityScope?: VisibilityScope;

  // Exclusions & Frequency
  excludedReferenceIds?: string[];
  recentlyUsedReferenceIds?: string[];

  // Explicit Constraints
  constraints?: QueryConstraint[];

  limit?: number;
  createdAt: string;
}

export interface NormalizedQuery {
  originalQuery: VisualReferenceQuery;
  normalizedSubject?: string;
  normalizedTopic?: string;
  normalizedIndustry?: string;
  normalizedScene?: string;
  normalizedRoles: string[];
  normalizedObjects: string[];
  requiredConstraints: QueryConstraint[];
  preferredConstraints: QueryConstraint[];
  avoidConstraints: QueryConstraint[];
  explanation: string;
}
