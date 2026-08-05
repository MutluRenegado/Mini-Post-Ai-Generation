export interface DomainRuleSet {
  readonly preferredSubjects: readonly string[];
  readonly preferredActions: readonly string[];
  readonly preferredObjects: readonly string[];
  readonly prohibitedElements: readonly string[];
  readonly humanPresenceRequired: boolean;
}

export class DomainKnowledgeResolver {
  public resolve(domain: string): DomainRuleSet {
    const humanPresenceRequired = domain !== 'environment-design';
    return {
      preferredSubjects: [domain],
      preferredActions: ['perform a concrete action directly connected to the topic'],
      preferredObjects: ['use only topic-specific supporting evidence'],
      prohibitedElements: ['empty office', 'generic stock photo', 'environment dominance'],
      humanPresenceRequired,
    };
  }
}
