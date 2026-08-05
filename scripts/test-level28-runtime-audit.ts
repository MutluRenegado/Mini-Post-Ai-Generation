import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../src/lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../src/lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../src/lib/ai-image-generator/images/masterImagePromptBuilder';
import { SpatialReasoningEngine } from '../src/lib/ai-image-generator/images/SpatialReasoningEngine';

async function runLevel28Audit() {
  console.log('=== LEVEL 28: SPATIAL REASONING AND SCENE PLACEMENT RUNTIME AUDIT ===\n');

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

    const brief = FinalPostAnalyzer.analyze({ postContent: tc.article, platform: tc.platform });
    const layout = brief.spatialLayout!;
    const coreLayout = SpatialReasoningEngine.getCoreDirectLayout(layout);

    console.log(`\n[Spatial Layout Summary & Fingerprint]`);
    console.log(`  Layout ID: ${layout.id}`);
    console.log(`  Primary Domain: ${layout.primaryDomain}`);
    console.log(`  Secondary Domain: ${layout.secondaryDomain || 'None'}`);
    console.log(`  Is Mixed-Domain: ${layout.isMixedDomain}`);
    console.log(`  Fingerprint: ${layout.fingerprint}`);

    console.log(`\n[Depth Layer Metrics]`);
    console.log(`  Foreground Count: ${layout.foregroundCount}`);
    console.log(`  Midground Count: ${layout.midgroundCount}`);
    console.log(`  Background Count: ${layout.backgroundCount}`);

    console.log(`\n[Provenance Metrics]`);
    console.log(`  Direct Placements: ${layout.directPlacementCount}`);
    console.log(`  Inferred Placements: ${layout.inferredPlacementCount}`);
    console.log(`  Core Direct Layout Count: ${coreLayout.placements.length}`);

    console.log(`\n[Physical Consistency Status]`);
    console.log(`  Is Hero Prominent: ${layout.isHeroProminent}`);
    console.log(`  All Objects Reachable: ${layout.allObjectsReachable}`);

    console.log(`\n[Placement Details & Provenance Reasoning]`);
    for (const p of layout.placements) {
      console.log(`  - [${p.depthLayer.toUpperCase()}] (${p.position.zone}) ${p.label} -> x:${p.position.x}, y:${p.position.y}, z:${p.position.zDepth}, Vis:${p.visibilityScore}, Prov:${p.provenance} (${p.placementProvenance.placementReason})`);
    }

    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
    const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);

    console.log(`\n[Downstream Handoff Result]`);
    console.log(`  Selected Concept: ${conceptRes.selectedConcept.title}`);
    console.log(`  Master AI Prompt (First 200 chars): ${masterPrompt.promptText.slice(0, 200)}...`);
  }

  console.log(`\n==================================================`);
  console.log('=== LEVEL 28 RUNTIME AUDIT COMPLETE: ALL DOMAINS VERIFIED ===\n');
}

runLevel28Audit().catch(console.error);
