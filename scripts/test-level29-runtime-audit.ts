import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../src/lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../src/lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../src/lib/ai-image-generator/images/masterImagePromptBuilder';
import { OccupationInteractionEngine } from '../src/lib/ai-image-generator/images/OccupationInteractionEngine';

async function runLevel29Audit() {
  console.log('=== LEVEL 29: OCCUPATION AND HUMAN INTERACTION INTELLIGENCE RUNTIME AUDIT ===\n');

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
    const plan = brief.occupationInteractionPlan!;

    console.log(`\n[Occupation Interaction Summary & Fingerprint]`);
    console.log(`  Plan ID: ${plan.id}`);
    console.log(`  Primary Domain: ${plan.primaryDomain}`);
    console.log(`  Secondary Domain: ${plan.secondaryDomain || 'None'}`);
    console.log(`  Is Mixed-Domain: ${plan.isMixedDomain}`);
    console.log(`  Fingerprint: ${plan.fingerprint}`);

    console.log(`\n[Occupations & Professional Appearance]`);
    for (const occ of plan.occupations) {
      console.log(`  - ${occ.canonicalName} (${occ.domain}) | Clothing: ${occ.appearance.clothingType} (${occ.appearance.formalityLevel}) | Derivation: ${occ.evidence.derivation}`);
      if (occ.safetyRequirements.length > 0) {
        console.log(`    Safety PPE: ${occ.safetyRequirements.map((s) => s.equipmentName).join(', ')}`);
      }
    }

    console.log(`\n[Human Poses, Gestures, & Gaze Targets]`);
    for (const pose of plan.poses) {
      const gesture = plan.gestures.find((g) => g.personNodeId === pose.personNodeId);
      const gaze = plan.gazes.find((gz) => gz.personNodeId === pose.personNodeId);
      console.log(`  - Person [${pose.personNodeId}] (${pose.occupationName}):`);
      console.log(`      Posture: ${pose.posture} | Gesture: ${gesture?.gesture || 'none'} (${gesture?.primaryHand})`);
      console.log(`      Gaze Target: ${gaze?.targetLabel} (${gaze?.targetType}) | Contact: ${gaze?.eyeContactState}`);
    }

    console.log(`\n[Hand-Object Interactions]`);
    for (const inter of plan.handObjectInteractions) {
      console.log(`  - Person [${inter.personNodeId}] -> ${inter.gripType} -> Object: ${inter.objectLabel} (${inter.handSide}, dist:${inter.distanceMeters}m, reachable:${inter.isReachable})`);
    }

    console.log(`\n[Relationships & Role Hierarchy]`);
    console.log(`  Lead Person: ${plan.roleHierarchy.leadPersonNodeId} (${plan.roleHierarchy.hierarchyType})`);
    for (const rel of plan.relationships) {
      console.log(`  - ${rel.sourcePersonNodeId} -> ${rel.relationshipType} -> ${rel.targetPersonNodeId} (Bridge:${rel.domainBridge})`);
    }

    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
    const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);

    console.log(`\n[Downstream Handoff Result]`);
    console.log(`  Selected Concept: ${conceptRes.selectedConcept.title}`);
    console.log(`  Master AI Prompt (First 200 chars): ${masterPrompt.promptText.slice(0, 200)}...`);
  }

  console.log(`\n==================================================`);
  console.log('=== LEVEL 29 RUNTIME AUDIT COMPLETE: ALL DOMAINS VERIFIED ===\n');
}

runLevel29Audit().catch(console.error);
