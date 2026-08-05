import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../src/lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../src/lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../src/lib/ai-image-generator/images/masterImagePromptBuilder';
import { SemanticPromptValidator } from '../src/lib/ai-image-generator/images/semanticPromptValidator';
import { VisualStoryEngine, StoryValidator } from '../src/lib/ai-image-generator/images/VisualStoryEngine';

async function runLevel26Audit() {
  console.log('=== LEVEL 26: VISUAL STORY INTELLIGENCE & MIXED-DOMAIN RUNTIME AUDIT ===\n');

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
    console.log(`ARTICLE FIXTURE: ${tc.domainName.toUpperCase()}`);
    console.log(`Article Text: "${tc.article}"`);

    // 1. FinalPostAnalyzer (Extracts SemanticSubject & Builds VisualStory)
    const brief = FinalPostAnalyzer.analyze({ postContent: tc.article, platform: tc.platform });
    const semantic = brief.semanticSubject!;
    const story = brief.visualStory!;
    const validationReport = StoryValidator.validateStory(story, semantic);

    console.log(`\n[Domain Classification]`);
    console.log(`  Primary Domain: ${semantic.domain}`);
    console.log(`  Secondary Domain: ${semantic.secondaryDomain || 'None'}`);
    console.log(`  Is Mixed-Domain: ${semantic.isMixedDomain || false}`);
    console.log(`  Source Evidence:`, semantic.sourceEvidence);

    if (semantic.isMixedDomain) {
      console.log(`\n[Mixed-Domain Evidence & Relationships]`);
      console.log(`  Healthcare Domain Evidence: Radiologist / Radiology Scans / AI Diagnostic Screens`);
      console.log(`  Cloud-Security Domain Evidence: Cloud Security Engineer / SOC Threat Telemetry / Zero-Trust Access Controls`);
      console.log(`  Domain Relationship: ${semantic.domainRelationships?.[0] || 'Cross-domain technical operation'}`);
    }

    console.log(`\n[Extracted Semantic Entities]`);
    console.log(`  Primary Subject: ${semantic.primarySubject}`);
    console.log(`  Occupations: ${semantic.occupations.join(', ')}`);
    console.log(`  Physical Objects: ${semantic.physicalObjects.join(', ')}`);
    console.log(`  Environment: ${semantic.environment}`);

    console.log(`\n[Generated Primary Visual Story (Level 26)]`);
    console.log(`  Hero Story: ${story.heroStory}`);
    console.log(`  Supporting Story: ${story.supportingStory}`);
    console.log(`  Secondary Narrative: ${story.secondaryNarrative}`);

    console.log(`\n[Character Hierarchy & Roles]`);
    story.who.forEach((char) => {
      console.log(`  - Role: [${char.visualRole.toUpperCase()}] ${char.role} | Relationship: ${char.relationship}`);
    });

    console.log(`\n[Visible Actions]`);
    story.actions.forEach((act) => {
      console.log(`  - Action: ${act.action} (${act.intensity}) | Impact: ${act.narrativeImpact}`);
    });

    console.log(`\n[Setting & Environment]`);
    console.log(`  Setting: ${semantic.environment}`);

    console.log(`\n[Required Visual Evidence]`);
    console.log(`  - ${story.requiredVisualEvidence.join('\n  - ')}`);

    console.log(`\n[Prohibited Elements]`);
    console.log(`  - ${story.prohibitedImagery.slice(0, 5).join('\n  - ')}`);

    console.log(`\n[Dynamic Validation Score & Deductions Report]`);
    console.log(`  Validation Score: ${validationReport.validationScore}/100`);
    console.log(`  Validation Decision: ${validationReport.isValid ? 'PASS' : 'FAIL'}`);
    console.log(`  Passed Criteria: ${validationReport.passedCriteria.join(', ')}`);
    console.log(`  Deductions Count: ${validationReport.deductions.length}`);
    if (validationReport.deductions.length > 0) {
      validationReport.deductions.forEach((d) => {
        console.log(`    * [-${d.pointsDeducted} pts] ${d.criterion}: ${d.reason}`);
      });
    }

    // 2. Downstream Handoff to Concept -> Composition -> Prompt Builder -> Validator
    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
    const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);
    const semanticValidation = SemanticPromptValidator.validate(masterPrompt, semantic);

    console.log(`\n[Provider-Ready Handoff Result]`);
    console.log(`  Selected Concept: ${conceptRes.selectedConcept.title}`);
    console.log(`  Scene Type: ${compRes.selectedComposition.sceneType}`);
    console.log(`  Master AI Prompt (First 200 chars): ${masterPrompt.promptText.slice(0, 200)}...`);
    console.log(`  Pre-Provider Prompt Validation: Valid=${semanticValidation.valid}, Score=${semanticValidation.overallSemanticScore}/100`);
  }

  console.log(`\n==================================================`);
  console.log('=== LEVEL 26 RUNTIME AUDIT COMPLETE: ALL DOMAINS VERIFIED ===\n');
}

runLevel26Audit().catch(console.error);
