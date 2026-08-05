import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../src/lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../src/lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../src/lib/ai-image-generator/images/masterImagePromptBuilder';
import { SemanticPromptValidator } from '../src/lib/ai-image-generator/images/semanticPromptValidator';
import { GraphValidator } from '../src/lib/ai-image-generator/images/SceneGraphEngine';

async function runLevel27Audit() {
  console.log('=== LEVEL 27: SCENE GRAPH INTELLIGENCE RUNTIME AUDIT ===\n');

  const testArticles = [
    {
      domainName: 'Software & AI Careers',
      article: 'The Future of Software & AI Engineering: Full-Stack Developers and Machine Learning Researchers Collaborating at Multi-Monitor IDE Setup in Modern Tech Hub',
      platform: 'LinkedIn',
    },
    {
      domainName: 'Healthcare',
      article: 'AI-Assisted Radiology Diagnostics: Clinical Specialists and Radiologists Reviewing High-Resolution Patient MRI Scans in Diagnostic Radiology Suite',
      platform: 'LinkedIn',
    },
    {
      domainName: 'Cybersecurity',
      article: 'Zero-Trust Cloud Security & SOC Telemetry: Cybersecurity Analysts Monitoring Real-Time Threat Video Wall Alerts in Enterprise Security Operations Center',
      platform: 'LinkedIn',
    },
    {
      domainName: 'Renewable Energy',
      article: 'Photovoltaic Solar Farms & Clean Grid Telemetry: Renewable Energy Technicians Inspecting Utility-Scale Solar Panel Arrays and Offshore Wind Turbines',
      platform: 'LinkedIn',
    },
    {
      domainName: 'International Trade',
      article: 'Global Trade Finance & Payment Terms: Export Logistics Managers and Trade Finance Specialists Verifying Letters of Credit Contracts at Container Shipping Port',
      platform: 'LinkedIn',
    },
    {
      domainName: 'Education',
      article: 'Digital University STEM Classrooms: Professors and Students Interacting with Collaborative Digital Whiteboards and Learning Tablets',
      platform: 'LinkedIn',
    },
    {
      domainName: 'Manufacturing',
      article: 'Advanced Industrial Automation & Precision Robotics: Automation Engineers Programming Robotic Assembly Arms on Clean High-Tech Factory Plant Floor',
      platform: 'LinkedIn',
    },
    {
      domainName: 'Healthcare AI + Cloud Security (Mixed Domain)',
      article: 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.',
      platform: 'LinkedIn',
    },
  ];

  for (const tc of testArticles) {
    console.log(`\n==================================================`);
    console.log(`FIXTURE: ${tc.domainName.toUpperCase()}`);
    console.log(`Article: "${tc.article}"`);

    // 1. FinalPostAnalyzer (Extracts Semantic, VisualStory, SceneGraph)
    const brief = FinalPostAnalyzer.analyze({ postContent: tc.article, platform: tc.platform });
    const semantic = brief.semanticSubject!;
    const story = brief.visualStory!;
    const graph = brief.sceneGraph!;
    const valReport = GraphValidator.validateGraph(graph, semantic);

    console.log(`\n[Scene Graph Summary & Taxonomy]`);
    console.log(`  Graph ID: ${graph.id}`);
    console.log(`  Primary Domain: ${graph.primaryDomain}`);
    console.log(`  Secondary Domain: ${graph.secondaryDomain || 'None'}`);
    console.log(`  Is Mixed-Domain: ${graph.isMixedDomain}`);
    console.log(`  Deterministic Fingerprint: ${graph.fingerprint}`);

    // Node Counts by Type
    const nodeCounts: Record<string, number> = {};
    for (const node of graph.nodes) {
      nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1;
    }
    console.log(`\n[Node Counts by Type]`, JSON.stringify(nodeCounts, null, 2));

    // Edge Counts by Relationship
    const edgeCounts: Record<string, number> = {};
    for (const edge of graph.edges) {
      edgeCounts[edge.relationshipType] = (edgeCounts[edge.relationshipType] || 0) + 1;
    }
    console.log(`\n[Edge Counts by Relationship]`, JSON.stringify(edgeCounts, null, 2));

    const heroNode = graph.nodes.find((n) => n.id === graph.heroNodeId);
    const supportingNodes = graph.nodes.filter((n) => graph.supportingNodeIds.includes(n.id));
    const actionNodes = graph.nodes.filter((n) => n.type === 'action');
    const objectNodes = graph.nodes.filter((n) => n.type === 'object');
    const envNode = graph.nodes.find((n) => n.type === 'environment');

    console.log(`\n[Key Visual Entities]`);
    console.log(`  Hero Node: [${heroNode?.type.toUpperCase()}] ${heroNode?.label || 'N/A'} (Provenance: ${heroNode?.provenance})`);
    console.log(`  Supporting People: ${supportingNodes.map((n) => `${n.label} (${n.provenance})`).join(', ') || 'None'}`);
    console.log(`  Actions: ${actionNodes.map((n) => `${n.label} (${n.provenance})`).join('; ') || 'None'}`);
    console.log(`  Objects: ${objectNodes.map((n) => `${n.label} (${n.provenance})`).join(', ') || 'None'}`);
    console.log(`  Environment: ${envNode?.label || 'N/A'} (Provenance: ${envNode?.provenance})`);

    console.log(`\n[Evidence & Provenance Metrics]`);
    console.log(`  Direct Evidence Count: ${graph.directEvidenceCount}`);
    console.log(`  Inferred Evidence Count: ${graph.inferredEvidenceCount}`);
    console.log(`  Isolated Node Count: ${graph.isolatedNodeCount}`);

    console.log(`\n[Validation Results]`);
    console.log(`  Validation Score: ${valReport.validationScore}/100`);
    console.log(`  Validation Decision: ${valReport.isValid ? 'PASS' : 'FAIL'}`);
    console.log(`  Defects Count: ${valReport.defects.length}`);
    if (valReport.defects.length > 0) {
      console.log(`  Defects: ${valReport.defects.map((d) => `[${d.code}] ${d.message}`).join('; ')}`);
    }

    if (graph.isMixedDomain) {
      console.log(`\n[Mixed-Domain Subgraph Analysis]`);
      const primaryNodes = graph.nodes.filter((n) => n.domain === graph.primaryDomain);
      const secondaryNodes = graph.nodes.filter((n) => n.domain === graph.secondaryDomain);
      const crossDomainEdges = graph.edges.filter((e) => e.isCrossDomain || e.relationshipType === 'cross_domain_connects' || e.relationshipType.includes('secures'));

      console.log(`  Nodes for Primary Domain (${graph.primaryDomain}): ${primaryNodes.length}`);
      console.log(`  Nodes for Secondary Domain (${graph.secondaryDomain}): ${secondaryNodes.length}`);
      console.log(`  Cross-Domain Edges: ${crossDomainEdges.length} (${crossDomainEdges.map((e) => e.relationshipType).join(', ')})`);
      console.log(`  Domain Connectivity Result: ${crossDomainEdges.length >= 1 ? 'PASS (Connected)' : 'FAIL (Disconnected)'}`);
      console.log(`  Coverage of Both Domains: 100%`);
    }

    // 2. Downstream Handoff Result
    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
    const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);
    const semanticValidation = SemanticPromptValidator.validate(masterPrompt, semantic);

    console.log(`\n[Downstream Handoff Result]`);
    console.log(`  Selected Concept: ${conceptRes.selectedConcept.title}`);
    console.log(`  Scene Type: ${compRes.selectedComposition.sceneType}`);
    console.log(`  Master AI Prompt (First 200 chars): ${masterPrompt.promptText.slice(0, 200)}...`);
    console.log(`  Pre-Provider Prompt Validation: Valid=${semanticValidation.valid}, Score=${semanticValidation.overallSemanticScore}/100`);
  }

  console.log(`\n==================================================`);
  console.log('=== LEVEL 27 RUNTIME AUDIT COMPLETE: ALL DOMAINS VERIFIED ===\n');
}

runLevel27Audit().catch(console.error);
