import type { VisualReferenceQuery, NormalizedQuery, QueryConstraint } from './retrieval.types';

export class MetadataQueryBuilder {
  private static ALIAS_REGISTRY: Record<string, string> = {
    'international trade finance': 'finance',
    'trade finance': 'finance',
    'banking': 'finance',
    'financial meeting': 'finance',
    'executive boardroom': 'office',
    'tech lab': 'technology',
    'cybersecurity': 'technology',
    'cargo containers': 'logistics',
    'shipping container': 'logistics',
    'medical equipment': 'healthcare',
  };

  private static normalizeTerm(term: string): string {
    let clean = term.trim().toLowerCase();
    // Basic singular normalization
    if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
      clean = clean.slice(0, -1);
    }
    return this.ALIAS_REGISTRY[clean] || clean;
  }

  /**
   * Normalizes case, whitespace, maps aliases, and builds structured constraints.
   * Deterministic processing - does NOT use an LLM or claim semantic AI.
   */
  static buildNormalizedQuery(query: VisualReferenceQuery): NormalizedQuery {
    if (!query || (!query.subject && !query.topic && !query.industry && !query.scene && (!query.objects || query.objects.length === 0))) {
      throw new Error('Invalid query: At least one topic, subject, industry, scene, or object must be specified.');
    }

    const normalizedSubject = query.subject ? this.normalizeTerm(query.subject) : undefined;
    const normalizedTopic = query.topic ? this.normalizeTerm(query.topic) : undefined;
    const normalizedIndustry = query.industry ? this.normalizeTerm(query.industry) : undefined;
    const normalizedScene = query.scene ? this.normalizeTerm(query.scene) : undefined;

    const normalizedRoles = Array.from(
      new Set((query.roles || []).map((r) => this.normalizeTerm(r)))
    );

    const normalizedObjects = Array.from(
      new Set((query.objects || []).map((o) => this.normalizeTerm(o)))
    );

    const requiredConstraints: QueryConstraint[] = [];
    const preferredConstraints: QueryConstraint[] = [];
    const avoidConstraints: QueryConstraint[] = [];

    // Base Required Constraints
    requiredConstraints.push({
      field: 'reviewStatus',
      value: 'APPROVED',
      type: 'REQUIRED',
      explanation: 'Must be explicitly approved in review workflow.',
    });
    requiredConstraints.push({
      field: 'rightsConfirmed',
      value: true,
      type: 'REQUIRED',
      explanation: 'Must have confirmed commercial usage rights.',
    });
    requiredConstraints.push({
      field: 'sourceAvailability',
      value: 'AVAILABLE',
      type: 'REQUIRED',
      explanation: 'Original or managed source asset must be present.',
    });

    if (query.industry) {
      preferredConstraints.push({
        field: 'industry',
        value: normalizedIndustry || query.industry,
        type: 'PREFERRED',
        weight: 15,
        explanation: `Matches requested industry "${query.industry}".`,
      });
    }

    if (query.topic || query.subject) {
      preferredConstraints.push({
        field: 'topic',
        value: normalizedTopic || normalizedSubject || '',
        type: 'PREFERRED',
        weight: 20,
        explanation: `Matches requested topic/subject "${query.topic || query.subject}".`,
      });
    }

    if (query.constraints) {
      for (const c of query.constraints) {
        if (c.type === 'REQUIRED') requiredConstraints.push(c);
        else if (c.type === 'PREFERRED') preferredConstraints.push(c);
        else if (c.type === 'AVOID') avoidConstraints.push(c);
      }
    }

    const explanation = `Normalized query ${query.queryId} — Subject: "${normalizedSubject || 'none'}", Industry: "${normalizedIndustry || 'none'}", Scene: "${normalizedScene || 'none'}". Defined ${requiredConstraints.length} required, ${preferredConstraints.length} preferred, and ${avoidConstraints.length} avoid constraints.`;

    return {
      originalQuery: query,
      normalizedSubject,
      normalizedTopic,
      normalizedIndustry,
      normalizedScene,
      normalizedRoles,
      normalizedObjects,
      requiredConstraints,
      preferredConstraints,
      avoidConstraints,
      explanation,
    };
  }
}
