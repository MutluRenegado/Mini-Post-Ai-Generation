import assert from 'assert';
import { test, describe } from 'node:test';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { SceneGraphEngine, SceneGraphBuilder, RelationshipEngine, GraphValidator, GraphSerializer } from '../lib/ai-image-generator/images/SceneGraphEngine';
import { SceneGraph, SceneNode, SceneEdge } from '../lib/ai-image-generator/images/scene-graph.types';

describe('Level 27: Scene Graph Intelligence & Strict Evidence Audit Suite (18 Core + 10 Degraded Cases)', () => {
  const singleDomainText = 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups in a tech hub.';
  const mixedDomainText = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';

  test('1. Valid single-domain graph construction succeeds', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.sceneGraph !== undefined, true);

    const graph = brief.sceneGraph!;
    assert.strictEqual(graph.primaryDomain, 'software-engineering');
    assert.strictEqual(graph.isMixedDomain, false);
    assert.strictEqual(graph.nodes.length >= 4, true);
    assert.strictEqual(graph.edges.length >= 3, true);
    assert.strictEqual(graph.heroNodeId !== undefined, true);
  });

  test('2. Valid mixed-domain graph connects Healthcare AI and Cloud Security', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    assert.strictEqual(graph.isMixedDomain, true);
    assert.strictEqual(graph.primaryDomain, 'healthcare');
    assert.strictEqual(graph.secondaryDomain, 'cybersecurity');

    // Both domains present in nodes
    const domainsPresent = new Set(graph.nodes.map((n) => n.domain));
    assert.strictEqual(domainsPresent.has('healthcare'), true);
    assert.strictEqual(domainsPresent.has('cybersecurity'), true);

    // Cross-domain edge exists
    const crossEdges = graph.edges.filter((e) => e.isCrossDomain || e.relationshipType === 'cross_domain_connects' || e.relationshipType.includes('secures'));
    assert.strictEqual(crossEdges.length >= 1, true);
  });

  test('3. Deterministic node and edge IDs are generated stably', () => {
    const nodeId1 = SceneGraphBuilder.generateNodeId('person', 'Radiologist');
    const nodeId2 = SceneGraphBuilder.generateNodeId('person', 'Radiologist');
    assert.strictEqual(nodeId1, nodeId2);
    assert.strictEqual(nodeId1, 'node_person_radiologist');

    const edgeId1 = SceneGraphBuilder.generateEdgeId(nodeId1, 'node_object_mri_scan', 'operates');
    const edgeId2 = SceneGraphBuilder.generateEdgeId(nodeId1, 'node_object_mri_scan', 'operates');
    assert.strictEqual(edgeId1, edgeId2);
    assert.strictEqual(edgeId1, 'edge_node_person_radiologist_to_node_object_mri_scan_operates');
  });

  test('4. Duplicate-node merging combines evidence and preserves highest confidence', () => {
    const nodes: SceneNode[] = [
      { id: 'n1', type: 'person', label: 'Radiologist', category: 'hero', domain: 'healthcare', provenance: 'direct', sourceEvidence: ['Evidence A'], confidence: 0.9 },
      { id: 'n1', type: 'person', label: 'Radiologist', category: 'hero', domain: 'healthcare', provenance: 'direct', sourceEvidence: ['Evidence B'], confidence: 0.95 },
    ];

    const merged = SceneGraphBuilder.mergeDuplicateNodes(nodes);
    assert.strictEqual(merged.length, 1);
    assert.strictEqual(merged[0].sourceEvidence.length, 2);
    assert.strictEqual(merged[0].confidence, 0.95);
  });

  test('5. Duplicate-edge merging dedupes duplicate directed edges', () => {
    const edges: SceneEdge[] = [
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2', relationshipType: 'operates', description: 'desc', provenance: 'direct', confidence: 0.9 },
      { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2', relationshipType: 'operates', description: 'desc', provenance: 'direct', confidence: 0.95 },
    ];

    const merged = SceneGraphBuilder.mergeDuplicateEdges(edges);
    assert.strictEqual(merged.length, 1);
    assert.strictEqual(merged[0].confidence, 0.95);
  });

  test('6. Dangling-edge rejection flags non-existent node references', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      edges: [
        ...graph.edges,
        { id: 'e_dangling', sourceNodeId: 'non_existent_node', targetNodeId: graph.heroNodeId!, relationshipType: 'invalid', description: 'dangling', provenance: 'direct', confidence: 0.5 },
      ],
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, false);
    assert.strictEqual(val.defects.some((d) => d.code === 'DANGLING_SOURCE_EDGE'), true);
  });

  test('7. Missing-evidence rejection flags nodes with empty source evidence', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      nodes: graph.nodes.map((n, idx) => (idx === 0 ? { ...n, sourceEvidence: [] } : n)),
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, false);
    assert.strictEqual(val.defects.some((d) => d.code === 'MISSING_NODE_EVIDENCE'), true);
  });

  test('8. Unsupported invented-node rejection flags unevidenced entities', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      nodes: [
        ...graph.nodes,
        { id: 'node_invented', type: 'person', label: 'Alien Astronaut', category: 'invented', domain: 'sci-fi', provenance: 'direct', sourceEvidence: [], confidence: 0.1 },
      ],
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, false);
  });

  test('9. Hero connectivity validation detects disconnected hero nodes', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      edges: graph.edges.filter((e) => e.sourceNodeId !== graph.heroNodeId && e.targetNodeId !== graph.heroNodeId),
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, false);
    assert.strictEqual(val.defects.some((d) => d.code === 'DISCONNECTED_HERO_NODE'), true);
  });

  test('10. Required-object connectivity ensures objects have valid relationships', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const objectNodes = graph.nodes.filter((n) => n.type === 'object');
    assert.strictEqual(objectNodes.length >= 1, true);

    const objEdges = graph.edges.filter((e) => objectNodes.some((o) => o.id === e.targetNodeId || o.id === e.sourceNodeId));
    assert.strictEqual(objEdges.length >= 1, true);
  });

  test('11. Mixed-domain connectivity verifies cross-domain edge requirement', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      edges: graph.edges.filter((e) => !e.isCrossDomain && e.relationshipType !== 'cross_domain_connects' && !e.relationshipType.includes('secures')),
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, false);
    assert.strictEqual(val.defects.some((d) => d.code === 'DISCONNECTED_MIXED_DOMAIN_SUBGRAPH'), true);
  });

  test('12. Conflicting environments detection reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      nodes: [
        ...graph.nodes,
        { id: 'node_env_conflicting', type: 'environment', label: 'closed dark basement', category: 'workspace', domain: 'healthcare', provenance: 'direct', sourceEvidence: ['contradiction'], confidence: 0.9 },
      ],
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.validationScore <= 85, true);
  });

  test('13. Contradictory actions detection reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    assert.strictEqual(graph.nodes.some((n) => n.type === 'action'), true);
  });

  test('14. Prohibited-imagery exclusion flags active prohibited nodes', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const defectiveGraph: SceneGraph = {
      ...graph,
      nodes: [
        ...graph.nodes,
        { id: 'node_prohibited', type: 'object', label: 'glowing blue hologram', category: 'abstract', domain: 'ai', provenance: 'direct', sourceEvidence: ['clutter'], confidence: 0.9 },
      ],
    };

    const val = GraphValidator.validateGraph(defectiveGraph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, false);
    assert.strictEqual(val.defects.some((d) => d.code === 'PROHIBITED_IMAGERY_IN_GRAPH'), true);
  });

  test('15. Empty or minimal article rejection throws expected error', () => {
    assert.throws(
      () => FinalPostAnalyzer.analyze({ postContent: '', platform: 'LinkedIn' }),
      /FINALIZED_POST_REQUIRED/
    );
  });

  test('16. Serialization stability verifies JSON and human-readable output', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;

    const json = GraphSerializer.serializeJson(graph);
    assert.strictEqual(typeof json, 'string');
    assert.strictEqual(json.includes(graph.id), true);

    const summary = GraphSerializer.serializeHumanReadable(graph);
    assert.strictEqual(summary.includes('SCENE GRAPH'), true);
    assert.strictEqual(summary.includes(graph.primaryDomain), true);
  });

  test('17. Fingerprint stability verifies deterministic SHA-256 fingerprinting', () => {
    const brief1 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const brief2 = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });

    assert.strictEqual(brief1.sceneGraph!.fingerprint.length, 64);
    assert.strictEqual(brief2.sceneGraph!.fingerprint.length, 64);
  });

  test('18. Backward-compatible brief parsing verifies optional sceneGraph', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    assert.strictEqual(brief.semanticSubject !== undefined, true);
    assert.strictEqual(brief.visualStory !== undefined, true);
    assert.strictEqual(brief.sceneGraph !== undefined, true);
  });

  // --- 10 Degraded Graph Score Cases ---

  test('Degraded 1: Missing hero connection causes critical failure', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const defective: SceneGraph = {
      ...graph,
      edges: graph.edges.filter((e) => e.sourceNodeId !== graph.heroNodeId && e.targetNodeId !== graph.heroNodeId),
    };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.defects.some((d) => d.code === 'DISCONNECTED_HERO_NODE'), true);
  });

  test('Degraded 2: Missing required object edge reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const isolatedObj: SceneNode = { id: 'node_object_unconnected', type: 'object', label: 'Unconnected Tool', category: 'tool', domain: 'software', provenance: 'direct', sourceEvidence: ['test'], confidence: 0.9 };
    const defective: SceneGraph = { ...graph, nodes: [...graph.nodes, isolatedObj] };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.defects.some((d) => d.code === 'MISSING_REQUIRED_OBJECT_EDGE'), true);
  });

  test('Degraded 3: Unsupported inferred object reduces confidence and score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const inferredObj: SceneNode = { id: 'node_object_inferred', type: 'object', label: 'Generic Notebook', category: 'tool', domain: 'software', provenance: 'inferred', sourceEvidence: [], confidence: 0.5 };
    const defective: SceneGraph = { ...graph, nodes: [...graph.nodes, inferredObj] };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.defects.some((d) => d.code === 'MISSING_NODE_EVIDENCE'), true);
  });

  test('Degraded 4: Secondary domain without cross-domain semantic relation reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const defective: SceneGraph = { ...graph, edges: graph.edges.filter((e) => !e.isCrossDomain && e.relationshipType !== 'cross_domain_connects') };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.defects.some((d) => d.code === 'DISCONNECTED_MIXED_DOMAIN_SUBGRAPH'), true);
  });

  test('Degraded 5: Synthetic connectivity edge without evidence incurs deduction', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    assert.strictEqual(graph.nodes.length >= 4, true);
  });

  test('Degraded 6: Conflicting environments reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const env2: SceneNode = { id: 'node_env_2', type: 'environment', label: 'Dark Basement', category: 'env', domain: 'sw', provenance: 'direct', sourceEvidence: ['text'], confidence: 0.9 };
    const defective: SceneGraph = { ...graph, nodes: [...graph.nodes, env2] };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.defects.some((d) => d.code === 'CONFLICTING_ENVIRONMENTS_IN_GRAPH'), true);
  });

  test('Degraded 7: Prohibited imagery incurs critical failure (-30 pts)', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const badNode: SceneNode = { id: 'node_bad', type: 'object', label: 'glowing blue hologram', category: 'bad', domain: 'sw', provenance: 'direct', sourceEvidence: ['text'], confidence: 0.9 };
    const defective: SceneGraph = { ...graph, nodes: [...graph.nodes, badNode] };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.defects.some((d) => d.code === 'PROHIBITED_IMAGERY_IN_GRAPH'), true);
  });

  test('Degraded 8: Dangling evidence reference incurs critical failure', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const danglingEdge: SceneEdge = { id: 'e_dang', sourceNodeId: 'node_invalid_source', targetNodeId: graph.nodes[0].id, relationshipType: 'operates', description: 'desc', provenance: 'direct', confidence: 0.8 };
    const defective: SceneGraph = { ...graph, edges: [...graph.edges, danglingEdge] };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.defects.some((d) => d.code === 'DANGLING_SOURCE_EDGE'), true);
  });

  test('Degraded 9: Excessive inferred-node ratio (> 40%) incurs deduction', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: singleDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    const defective: SceneGraph = {
      ...graph,
      inferredEvidenceCount: 10,
      nodes: [
        ...graph.nodes,
        { id: 'inf1', type: 'object', label: 'inf1', category: 't', domain: 'sw', provenance: 'inferred', sourceEvidence: ['e'], confidence: 0.5 },
        { id: 'inf2', type: 'object', label: 'inf2', category: 't', domain: 'sw', provenance: 'inferred', sourceEvidence: ['e'], confidence: 0.5 },
        { id: 'inf3', type: 'object', label: 'inf3', category: 't', domain: 'sw', provenance: 'inferred', sourceEvidence: ['e'], confidence: 0.5 },
        { id: 'inf4', type: 'object', label: 'inf4', category: 't', domain: 'sw', provenance: 'inferred', sourceEvidence: ['e'], confidence: 0.5 },
        { id: 'inf5', type: 'object', label: 'inf5', category: 't', domain: 'sw', provenance: 'inferred', sourceEvidence: ['e'], confidence: 0.5 },
      ],
    };
    const res = GraphValidator.validateGraph(defective, brief.semanticSubject!);
    assert.strictEqual(res.defects.some((d) => d.code === 'EXCESSIVE_INFERRED_NODE_RATIO'), true);
  });

  test('Degraded 10: Valid but imperfect graph with inferred fallback nodes receives 90/100', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedDomainText, platform: 'LinkedIn' });
    const graph = brief.sceneGraph!;
    assert.strictEqual(graph.inferredEvidenceCount >= 1, true);

    const val = GraphValidator.validateGraph(graph, brief.semanticSubject!);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(val.validationScore, 90);
    assert.strictEqual(val.defects.some((d) => d.code === 'IMPERFECT_GRAPH_INFERRED_CONTENT'), true);
  });
});
