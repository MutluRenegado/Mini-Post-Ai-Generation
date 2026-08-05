import crypto from 'crypto';
import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { SemanticSubjectExtraction } from './semantic-subject.types';
import { SemanticSubjectIntelligence } from './semanticSubjectIntelligence';
import { VisualStoryNarrative } from './visual-story.types';
import {
  SceneGraph,
  SceneNode,
  SceneEdge,
  SceneGraphResult,
  GraphValidationDefect,
  SceneNodeType,
  EdgeProvenance,
} from './scene-graph.types';
import { SceneGraphResultSchema } from './scene-graph.schema';

export class SceneGraphBuilder {
  /**
   * Generates a deterministic slug from a string label.
   */
  public static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  /**
   * Generates a deterministic node ID based on type and normalized label.
   */
  public static generateNodeId(type: SceneNodeType, label: string): string {
    const slug = this.slugify(label);
    return `node_${type}_${slug}`;
  }

  /**
   * Generates a deterministic edge ID based on source, target, and relationship.
   */
  public static generateEdgeId(sourceId: string, targetId: string, relationshipType: string): string {
    const relSlug = this.slugify(relationshipType);
    return `edge_${sourceId}_to_${targetId}_${relSlug}`;
  }

  /**
   * Evaluates whether a node label has direct support in article text or story evidence.
   */
  public static checkDirectEvidence(label: string, articleText: string, extractions: string[]): boolean {
    const textLower = articleText.toLowerCase();
    const labelTokens = label.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    
    // Direct keyword match in article text
    if (labelTokens.some((token) => textLower.includes(token))) {
      return true;
    }
    // Match in extracted evidence strings
    return extractions.some((ext) => labelTokens.some((token) => ext.toLowerCase().includes(token)));
  }

  /**
   * Merges duplicate nodes with identical IDs, combining source evidence.
   */
  public static mergeDuplicateNodes(nodes: SceneNode[]): SceneNode[] {
    const nodeMap = new Map<string, SceneNode>();

    for (const node of nodes) {
      if (nodeMap.has(node.id)) {
        const existing = nodeMap.get(node.id)!;
        const mergedEvidence = Array.from(new Set([...existing.sourceEvidence, ...node.sourceEvidence]));
        const mergedConfidence = Math.max(existing.confidence, node.confidence);
        nodeMap.set(node.id, {
          ...existing,
          sourceEvidence: mergedEvidence,
          confidence: mergedConfidence,
        });
      } else {
        nodeMap.set(node.id, { ...node });
      }
    }

    return Array.from(nodeMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  }

  /**
   * Merges duplicate edges with identical IDs.
   */
  public static mergeDuplicateEdges(edges: SceneEdge[]): SceneEdge[] {
    const edgeMap = new Map<string, SceneEdge>();

    for (const edge of edges) {
      if (edgeMap.has(edge.id)) {
        const existing = edgeMap.get(edge.id)!;
        const mergedConfidence = Math.max(existing.confidence, edge.confidence);
        edgeMap.set(edge.id, {
          ...existing,
          confidence: mergedConfidence,
        });
      } else {
        edgeMap.set(edge.id, { ...edge });
      }
    }

    return Array.from(edgeMap.values()).sort((a, b) => a.id.localeCompare(b.id));
  }
}

export class RelationshipEngine {
  /**
   * Builds canonical, evidence-backed semantic edges connecting nodes.
   */
  public static buildEdges(
    nodes: SceneNode[],
    semantic: SemanticSubjectExtraction,
    story: VisualStoryNarrative
  ): SceneEdge[] {
    const edges: SceneEdge[] = [];

    const envNode = nodes.find((n) => n.type === 'environment');
    const heroNode = nodes.find((n) => n.type === 'person' && n.id.includes('hero'));

    // 1. Connect Person Nodes to Environment (situated_in)
    if (envNode) {
      const personNodes = nodes.filter((n) => n.type === 'person' || n.type === 'occupation');
      for (const pNode of personNodes) {
        const edgeId = SceneGraphBuilder.generateEdgeId(pNode.id, envNode.id, 'situated_in');
        edges.push({
          id: edgeId,
          sourceNodeId: pNode.id,
          targetNodeId: envNode.id,
          relationshipType: 'situated_in',
          description: `${pNode.label} is situated inside ${envNode.label}`,
          provenance: pNode.provenance,
          confidence: pNode.confidence,
        });
      }
    }

    // 2. Connect Person Nodes to Actions (executes)
    const actionNodes = nodes.filter((n) => n.type === 'action');
    if (heroNode && actionNodes.length > 0) {
      const primaryActionNode = actionNodes[0];
      const edgeId = SceneGraphBuilder.generateEdgeId(heroNode.id, primaryActionNode.id, 'executes');
      edges.push({
        id: edgeId,
        sourceNodeId: heroNode.id,
        targetNodeId: primaryActionNode.id,
        relationshipType: 'executes',
        description: `${heroNode.label} actively executes ${primaryActionNode.label}`,
        provenance: 'direct',
        confidence: 0.95,
      });
    }

    // 3. Connect Person Nodes to Physical Objects (operates)
    const objectNodes = nodes.filter((n) => n.type === 'object');
    const peopleNodes = nodes.filter((n) => n.type === 'person');

    for (let i = 0; i < objectNodes.length; i++) {
      const objNode = objectNodes[i];
      const assignedPerson = peopleNodes[i % peopleNodes.length] || heroNode;

      if (assignedPerson) {
        const edgeId = SceneGraphBuilder.generateEdgeId(assignedPerson.id, objNode.id, 'operates');
        edges.push({
          id: edgeId,
          sourceNodeId: assignedPerson.id,
          targetNodeId: objNode.id,
          relationshipType: 'operates',
          description: `${assignedPerson.label} operates or uses ${objNode.label}`,
          provenance: objNode.provenance,
          confidence: Math.min(assignedPerson.confidence, objNode.confidence),
        });
      }
    }

    // 4. Connect Supporting People to Hero Person (collaborates_with)
    const supportingNodes = nodes.filter((n) => n.type === 'person' && !n.id.includes('hero'));
    if (heroNode) {
      for (const supNode of supportingNodes) {
        const edgeId = SceneGraphBuilder.generateEdgeId(heroNode.id, supNode.id, 'collaborates_with');
        edges.push({
          id: edgeId,
          sourceNodeId: heroNode.id,
          targetNodeId: supNode.id,
          relationshipType: 'collaborates_with',
          description: `${heroNode.label} collaborates directly with ${supNode.label}`,
          provenance: supNode.provenance,
          confidence: supNode.confidence,
        });
      }
    }

    // 5. Mixed-Domain Semantic Relationships (secures_and_monitors / cross_domain_connects)
    if (semantic.isMixedDomain && semantic.secondaryDomain && peopleNodes.length >= 2) {
      const primaryPerson = peopleNodes[0];
      const secondaryPerson = peopleNodes[1];

      // Specific domain semantic relation
      let relType = 'secures_and_monitors';
      if (semantic.domain === 'healthcare' && semantic.secondaryDomain === 'cybersecurity') {
        relType = 'secures_and_monitors_clinical_data';
      }

      const crossEdgeId = SceneGraphBuilder.generateEdgeId(secondaryPerson.id, primaryPerson.id, relType);
      edges.push({
        id: crossEdgeId,
        sourceNodeId: secondaryPerson.id,
        targetNodeId: primaryPerson.id,
        relationshipType: relType,
        description: `Cross-domain integration: ${secondaryPerson.label} (${secondaryPerson.domain.toUpperCase()}) ${relType.replace(/_/g, ' ')} for ${primaryPerson.label} (${primaryPerson.domain.toUpperCase()})`,
        provenance: 'direct',
        confidence: 0.96,
        isCrossDomain: true,
      });

      // Structural cross-domain marker edge
      const structuralEdgeId = SceneGraphBuilder.generateEdgeId(primaryPerson.id, secondaryPerson.id, 'cross_domain_connects');
      edges.push({
        id: structuralEdgeId,
        sourceNodeId: primaryPerson.id,
        targetNodeId: secondaryPerson.id,
        relationshipType: 'cross_domain_connects',
        description: `Structural cross-domain link between ${primaryPerson.domain} and ${secondaryPerson.domain}`,
        provenance: 'direct',
        confidence: 0.95,
        isCrossDomain: true,
      });
    }

    return SceneGraphBuilder.mergeDuplicateEdges(edges);
  }
}

export class GraphValidator {
  /**
   * Audits scene graph for structural defects, evidence completeness, dangling edges, and prohibited imagery.
   * Computes a transparent weighted score: Score = Math.max(0, Math.min(100, Math.round(100 - sum(Deductions))))
   */
  public static validateGraph(graph: SceneGraph, semantic: SemanticSubjectExtraction): {
    isValid: boolean;
    validationScore: number;
    defects: GraphValidationDefect[];
  } {
    const defects: GraphValidationDefect[] = [];
    let deductions = 0;

    const nodeMap = new Map<string, SceneNode>(graph.nodes.map((n) => [n.id, n]));

    // 1. Audit Dangling Edges & Self-References
    for (const edge of graph.edges) {
      if (!nodeMap.has(edge.sourceNodeId)) {
        deductions += 25;
        defects.push({
          code: 'DANGLING_SOURCE_EDGE',
          severity: 'critical',
          message: `Edge ${edge.id} references non-existent source node ${edge.sourceNodeId}.`,
          edgeId: edge.id,
        });
      }
      if (!nodeMap.has(edge.targetNodeId)) {
        deductions += 25;
        defects.push({
          code: 'DANGLING_TARGET_EDGE',
          severity: 'critical',
          message: `Edge ${edge.id} references non-existent target node ${edge.targetNodeId}.`,
          edgeId: edge.id,
        });
      }
      if (edge.sourceNodeId === edge.targetNodeId) {
        deductions += 15;
        defects.push({
          code: 'INVALID_SELF_REFERENCE_EDGE',
          severity: 'warning',
          message: `Edge ${edge.id} has an invalid self-reference loop.`,
          edgeId: edge.id,
        });
      }
    }

    // 2. Audit Evidence Traceability & Inferred Ratios
    let missingEvidenceCount = 0;
    for (const node of graph.nodes) {
      if (!node.sourceEvidence || node.sourceEvidence.length === 0) {
        missingEvidenceCount++;
        deductions += 15;
        defects.push({
          code: 'MISSING_NODE_EVIDENCE',
          severity: 'critical',
          message: `Node ${node.id} (${node.label}) has no supporting article source evidence.`,
          nodeId: node.id,
        });
      }
    }

    if (graph.nodes.length > 0) {
      const inferredRatio = graph.inferredEvidenceCount / graph.nodes.length;
      if (inferredRatio > 0.4) {
        deductions += 15;
        defects.push({
          code: 'EXCESSIVE_INFERRED_NODE_RATIO',
          severity: 'warning',
          message: `Inferred node ratio (${Math.round(inferredRatio * 100)}%) exceeds safe threshold (40%).`,
        });
      }
    }

    // 3. Audit Hero Subject Connectivity
    if (!graph.heroNodeId || !nodeMap.has(graph.heroNodeId)) {
      deductions += 25;
      defects.push({
        code: 'MISSING_HERO_NODE',
        severity: 'critical',
        message: 'Graph is missing a primary hero person node.',
      });
    } else {
      const heroEdges = graph.edges.filter((e) => e.sourceNodeId === graph.heroNodeId || e.targetNodeId === graph.heroNodeId);
      if (heroEdges.length === 0) {
        deductions += 20;
        defects.push({
          code: 'DISCONNECTED_HERO_NODE',
          severity: 'critical',
          message: 'Hero person node is disconnected from all actions, environment, and objects in the graph.',
          nodeId: graph.heroNodeId,
        });
      }
    }

    // 4. Audit Required Object Connectivity
    const objectNodes = graph.nodes.filter((n) => n.type === 'object');
    for (const objNode of objectNodes) {
      const objEdges = graph.edges.filter((e) => e.sourceNodeId === objNode.id || e.targetNodeId === objNode.id);
      if (objEdges.length === 0) {
        deductions += 15;
        defects.push({
          code: 'MISSING_REQUIRED_OBJECT_EDGE',
          severity: 'warning',
          message: `Object node ${objNode.id} (${objNode.label}) has no operational relationship edges.`,
          nodeId: objNode.id,
        });
      }
    }

    // 5. Audit Mixed-Domain Connectivity
    if (graph.isMixedDomain && graph.secondaryDomain) {
      const crossEdges = graph.edges.filter((e) => e.isCrossDomain || e.relationshipType === 'cross_domain_connects' || e.relationshipType.includes('secures'));
      if (crossEdges.length === 0) {
        deductions += 20;
        defects.push({
          code: 'DISCONNECTED_MIXED_DOMAIN_SUBGRAPH',
          severity: 'critical',
          message: `Mixed-domain graph lacks cross-domain edges connecting ${graph.primaryDomain} and ${graph.secondaryDomain}.`,
        });
      }
    }

    // 6. Audit Prohibited Imagery as Active Nodes
    const prohibitedTerms = ['glowing blue hologram', 'floating abstract circle', 'matrix text'];
    for (const node of graph.nodes) {
      const labelLower = node.label.toLowerCase();
      if (prohibitedTerms.some((term) => labelLower.includes(term))) {
        deductions += 30;
        defects.push({
          code: 'PROHIBITED_IMAGERY_IN_GRAPH',
          severity: 'critical',
          message: `Prohibited abstract imagery "${node.label}" present as active graph node.`,
          nodeId: node.id,
        });
      }
    }

    // 7. Audit Conflicting Environments
    const envNodes = graph.nodes.filter((n) => n.type === 'environment');
    if (envNodes.length > 1) {
      deductions += 15;
      defects.push({
        code: 'CONFLICTING_ENVIRONMENTS_IN_GRAPH',
        severity: 'warning',
        message: `Graph contains ${envNodes.length} conflicting environment nodes: ${envNodes.map((e) => e.label).join(', ')}.`,
      });
    }

    // 8. Deduct for Inferred/Isolated Fallback Content (Valid but Imperfect Graph Normalization)
    if (graph.inferredEvidenceCount > 0 && defects.length === 0) {
      deductions += 10;
      defects.push({
        code: 'IMPERFECT_GRAPH_INFERRED_CONTENT',
        severity: 'warning',
        message: `Graph contains ${graph.inferredEvidenceCount} inferred fallback nodes. Score adjusted to reflect non-direct evidence.`,
      });
    }

    // Normalize final score
    const finalScore = Math.max(0, Math.min(100, Math.round(100 - deductions)));
    const hasCriticalDefect = defects.some((d) => d.severity === 'critical');
    const isValid = finalScore >= 80 && !hasCriticalDefect;

    return {
      isValid,
      validationScore: finalScore,
      defects,
    };
  }
}

export class GraphSerializer {
  /**
   * Serializes SceneGraph to normalized JSON format.
   */
  public static serializeJson(graph: SceneGraph): string {
    return JSON.stringify(graph, null, 2);
  }

  /**
   * Serializes SceneGraph to human-readable graph summary.
   */
  public static serializeHumanReadable(graph: SceneGraph): string {
    const lines: string[] = [];
    lines.push(`SCENE GRAPH [${graph.id}] - Domain: ${graph.primaryDomain}${graph.isMixedDomain ? ' + ' + graph.secondaryDomain : ''}`);
    lines.push(`Nodes (${graph.nodes.length}):`);
    for (const n of graph.nodes) {
      lines.push(`  - [${n.type.toUpperCase()}] ${n.label} (Domain: ${n.domain}, Provenance: ${n.provenance})`);
    }
    lines.push(`Edges (${graph.edges.length}):`);
    for (const e of graph.edges) {
      lines.push(`  - (${e.sourceNodeId}) --[${e.relationshipType}]--> (${e.targetNodeId}) : ${e.description}`);
    }
    return lines.join('\n');
  }
}

export class SceneGraphEngine {
  /**
   * Facade orchestrator: Builds evidence-traceable SceneGraph from Level 25 & 26 outputs.
   */
  public static buildGraph(
    brief: VisualIntelligenceBrief,
    story: VisualStoryNarrative,
    semanticSubject?: SemanticSubjectExtraction
  ): SceneGraphResult {
    if (!brief || !brief.id) {
      throw new Error('INVALID_GRAPH_INPUT: VisualIntelligenceBrief is required for SceneGraph execution.');
    }
    if (!story || !story.id) {
      throw new Error('INVALID_GRAPH_INPUT: VisualStoryNarrative is required for SceneGraph execution.');
    }

    const semantic = semanticSubject || brief.semanticSubject || SemanticSubjectIntelligence.extract(brief.sanitizedSourceSummary || brief.centralMessage, brief.id);
    const articleText = brief.sanitizedSourceSummary || brief.centralMessage || '';
    const timestamp = new Date().toISOString();

    const rawNodes: SceneNode[] = [];

    // 1. Create Environment Node
    const envLabel = semantic.environment;
    const isEnvDirect = SceneGraphBuilder.checkDirectEvidence(envLabel, articleText, semantic.sourceEvidence);
    const envNodeId = SceneGraphBuilder.generateNodeId('environment', envLabel);
    rawNodes.push({
      id: envNodeId,
      type: 'environment',
      label: envLabel,
      category: 'workspace_environment',
      domain: semantic.domain,
      provenance: isEnvDirect ? 'direct' : 'inferred',
      sourceEvidence: isEnvDirect ? semantic.sourceEvidence : ['Inferred environment backdrop (article support indirect)'],
      confidence: isEnvDirect ? 0.96 : 0.75,
    });

    // 2. Create Person & Occupation Nodes for Hero & Supporting Characters
    let heroNodeId: string | undefined = undefined;
    const supportingNodeIds: string[] = [];

    story.who.forEach((char, idx) => {
      const isHero = char.visualRole === 'hero';
      const nodeType: SceneNodeType = 'person';
      const nodeLabel = char.role;
      const nodeId = isHero ? `node_person_hero_${SceneGraphBuilder.slugify(nodeLabel)}` : SceneGraphBuilder.generateNodeId('person', nodeLabel);

      if (isHero) {
        heroNodeId = nodeId;
      } else {
        supportingNodeIds.push(nodeId);
      }

      const charDomain = idx === 1 && semantic.isMixedDomain && semantic.secondaryDomain ? semantic.secondaryDomain : semantic.domain;
      const isCharDirect = SceneGraphBuilder.checkDirectEvidence(nodeLabel, articleText, semantic.sourceEvidence);

      rawNodes.push({
        id: nodeId,
        type: nodeType,
        label: nodeLabel,
        category: char.visualRole,
        domain: charDomain,
        provenance: isCharDirect ? 'direct' : 'inferred',
        sourceEvidence: isCharDirect
          ? [`Extracted from article story character hierarchy: ${char.role} (${char.relationship})`]
          : [`Inferred supporting occupation: ${char.role} (derived from domain specification)`],
        confidence: isCharDirect ? 0.95 : 0.70,
        attributes: {
          visualRole: char.visualRole,
          expression: char.expression,
          relationship: char.relationship,
        },
      });
    });

    // 3. Create Action Nodes
    story.actions.forEach((act) => {
      const actionNodeId = SceneGraphBuilder.generateNodeId('action', act.action);
      const isActDirect = SceneGraphBuilder.checkDirectEvidence(act.action, articleText, semantic.sourceEvidence);

      rawNodes.push({
        id: actionNodeId,
        type: 'action',
        label: act.action,
        category: 'visible_human_action',
        domain: semantic.domain,
        provenance: isActDirect ? 'direct' : 'inferred',
        sourceEvidence: isActDirect
          ? [`Extracted from article visible action: ${act.action}`]
          : [`Inferred action description: ${act.action}`],
        confidence: isActDirect ? 0.93 : 0.72,
        attributes: {
          intensity: act.intensity,
          narrativeImpact: act.narrativeImpact,
        },
      });
    });

    // 4. Create Physical Object Nodes
    semantic.physicalObjects.forEach((obj: string, idx: number) => {
      const objNodeId = SceneGraphBuilder.generateNodeId('object', obj);
      const objDomain = idx >= 2 && semantic.isMixedDomain && semantic.secondaryDomain ? semantic.secondaryDomain : semantic.domain;
      const isObjDirect = SceneGraphBuilder.checkDirectEvidence(obj, articleText, semantic.sourceEvidence);

      rawNodes.push({
        id: objNodeId,
        type: 'object',
        label: obj,
        category: 'profession_tool',
        domain: objDomain,
        provenance: isObjDirect ? 'direct' : 'inferred',
        sourceEvidence: isObjDirect
          ? [`Extracted from article physical objects: ${obj}`]
          : [`Inferred domain tool: ${obj} (derived from domain specification)`],
        confidence: isObjDirect ? 0.92 : 0.68,
      });
    });

    // 5. Create Visual Evidence Nodes
    story.requiredVisualEvidence.forEach((ev) => {
      const evNodeId = SceneGraphBuilder.generateNodeId('visual_evidence', ev);
      const isEvDirect = SceneGraphBuilder.checkDirectEvidence(ev, articleText, semantic.sourceEvidence);

      rawNodes.push({
        id: evNodeId,
        type: 'visual_evidence',
        label: ev,
        category: 'required_visual_element',
        domain: semantic.domain,
        provenance: isEvDirect ? 'direct' : 'inferred',
        sourceEvidence: isEvDirect ? [`Required visual evidence: ${ev}`] : [`Inferred visual evidence: ${ev}`],
        confidence: isEvDirect ? 0.95 : 0.70,
      });
    });

    // Deduplicate & Merge Nodes
    const mergedNodes = SceneGraphBuilder.mergeDuplicateNodes(rawNodes);

    // 6. Build Relationship Edges
    const edges = RelationshipEngine.buildEdges(mergedNodes, semantic, story);

    // Compute evidence counts
    const directEvidenceCount = mergedNodes.filter((n) => n.provenance === 'direct').length;
    const inferredEvidenceCount = mergedNodes.filter((n) => n.provenance === 'inferred').length;

    // Compute isolated nodes (nodes with 0 connected edges)
    const connectedNodeIds = new Set<string>();
    edges.forEach((e) => {
      connectedNodeIds.add(e.sourceNodeId);
      connectedNodeIds.add(e.targetNodeId);
    });
    const isolatedNodeCount = mergedNodes.filter((n) => !connectedNodeIds.has(n.id)).length;

    // 7. Compute Deterministic Fingerprint
    const fpInput = `${brief.id}||${story.id}||${mergedNodes.map((n) => n.id).join(',')}||${edges.map((e) => e.id).join(',')}`;
    const fingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');
    const graphId = `sg_${fingerprint.slice(0, 12)}`;

    const graph: SceneGraph = {
      id: graphId,
      storyId: story.id,
      briefId: brief.id,

      primaryDomain: semantic.domain,
      secondaryDomain: semantic.secondaryDomain,
      isMixedDomain: semantic.isMixedDomain || false,

      nodes: mergedNodes,
      edges,

      heroNodeId,
      environmentNodeId: envNodeId,
      supportingNodeIds,

      directEvidenceCount,
      inferredEvidenceCount,
      isolatedNodeCount,

      generatedAt: timestamp,
      fingerprint,
    };

    // 8. Validate & Serialize
    const validationReport = GraphValidator.validateGraph(graph, semantic);
    const serializedJson = GraphSerializer.serializeJson(graph);
    const humanReadableSummary = GraphSerializer.serializeHumanReadable(graph);

    const result: SceneGraphResult = {
      briefId: brief.id,
      graph,
      serializedJson,
      humanReadableSummary,
      validationScore: validationReport.validationScore,
      isValid: validationReport.isValid,
      defects: validationReport.defects,
      generatedAt: timestamp,
    };

    SceneGraphResultSchema.parse(result);

    return result;
  }
}
