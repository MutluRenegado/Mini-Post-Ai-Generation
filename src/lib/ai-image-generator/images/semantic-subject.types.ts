export interface SemanticSubjectExtraction {
  id: string;
  briefId?: string;

  domain: string;
  secondaryDomain?: string;
  isMixedDomain?: boolean;
  domainRelationships?: string[];

  primarySubject: string;
  secondarySubjects: string[];

  occupations: string[];
  physicalObjects: string[];
  environment: string;
  location: string;
  visibleActions: string[];

  timePeriod: string;
  audience: string;
  mood: string;
  emotionalEffect: string;

  visualKeywords: string[];
  visualMetaphors: string[];

  elementsThatMustAppear: string[];
  elementsThatMustNeverAppear: string[];

  confidenceByElement: Record<string, number>;
  sourceEvidence: string[];
  deterministicFingerprint: string;
}
