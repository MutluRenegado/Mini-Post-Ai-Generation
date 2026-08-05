import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../src/lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../src/lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../src/lib/ai-image-generator/images/masterImagePromptBuilder';
import { SemanticPromptValidator } from '../src/lib/ai-image-generator/images/semanticPromptValidator';
import { PromptRepairEngine } from '../src/lib/ai-image-generator/images/promptRepairEngine';
import { GeneratedImageQualityAuditor } from '../src/lib/ai-image-generator/images/generatedImageQualityAuditor';

async function runRuntimeAudit() {
  console.log('=== LOCAL RUNTIME AUDIT: SEMANTIC SUBJECT INTELLIGENCE ===\n');

  const testCases = [
    {
      name: 'Future jobs',
      article: 'The Future of Work: High-Growth Careers and Essential Skills for the Next Decade',
      platform: 'LinkedIn',
    },
    {
      name: 'International trade payment terms',
      article: 'What are the payment terms in international trade? Understanding letters of credit and Incoterms.',
      platform: 'Instagram Feed',
    },
    {
      name: 'Healthcare AI',
      article: 'AI-Assisted Radiology: Transformative Clinical Diagnostics and Patient Imaging in Modern Healthcare',
      platform: 'LinkedIn',
    },
    {
      name: 'Cybersecurity',
      article: 'Zero-Trust Enterprise Cloud Security and Real-Time Threat Detection in Security Operations Centers',
      platform: 'LinkedIn',
    },
    {
      name: 'Renewable energy',
      article: 'Utility-Scale Solar Photovoltaic Farms and Offshore Wind Turbine Grid Infrastructure',
      platform: 'LinkedIn',
    },
  ];

  for (const tc of testCases) {
    console.log(`\n--- RUNTIME AUDIT FOR: ${tc.name.toUpperCase()} ---`);
    console.log(`Input Article: "${tc.article}"`);

    // 1. FinalPostAnalyzer & SemanticSubjectIntelligence
    const brief = FinalPostAnalyzer.analyze({ postContent: tc.article, platform: tc.platform });
    const semantic = brief.semanticSubject!;

    console.log(`\n[Extracted Semantic Entities]`);
    console.log(`  Domain: ${semantic.domain}`);
    console.log(`  Primary Subject: ${semantic.primarySubject}`);
    console.log(`  Occupations: ${semantic.occupations.join(', ')}`);
    console.log(`  Physical Objects: ${semantic.physicalObjects.join(', ')}`);
    console.log(`  Environment: ${semantic.environment}`);
    console.log(`  Visible Actions: ${semantic.visibleActions.join('; ')}`);
    console.log(`  Must Appear: ${semantic.elementsThatMustAppear.join('; ')}`);
    console.log(`  Must Never Appear: ${semantic.elementsThatMustNeverAppear.slice(0, 4).join(', ')}`);

    // 2. VisualConceptGenerator
    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const concept = conceptRes.selectedConcept;
    console.log(`\n[Selected Concept]`);
    console.log(`  Title: ${concept.title}`);
    console.log(`  Primary Subject: ${concept.primarySubject}`);

    // 3. CompositionPlanner
    const compRes = CompositionPlanner.planComposition(brief, concept);
    const composition = compRes.selectedComposition;
    console.log(`\n[Composition Plan]`);
    console.log(`  Scene Type: ${composition.sceneType}`);
    console.log(`  Foreground: ${composition.layers.foreground.join(', ')}`);
    console.log(`  Midground: ${composition.layers.midground.join(', ')}`);
    console.log(`  Background: ${composition.layers.background.join(', ')}`);

    // 4. MasterImagePromptBuilder
    const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, concept, composition);
    console.log(`\n[Provider-Ready Master AI Prompt]`);
    console.log(`  Prompt Text: ${masterPrompt.promptText}`);

    // 5. SemanticPromptValidator & PromptRepairEngine
    const validation = SemanticPromptValidator.validate(masterPrompt, semantic);
    console.log(`\n[Semantic Prompt Validation]`);
    console.log(`  Valid: ${validation.valid}`);
    console.log(`  Provider Ready: ${validation.providerReady}`);
    console.log(`  Overall Semantic Score: ${validation.overallSemanticScore}/100`);

    const repairResult = PromptRepairEngine.repairPrompt(masterPrompt);
    console.log(`  Repaired Needed: ${repairResult.repaired}`);

    // 6. GeneratedImageQualityAuditor
    const mockAsset = {
      id: `ast_runtime_${Date.now()}`,
      url: 'https://example.com/generated_image.png',
      width: 1080,
      height: 1080,
      aspectRatio: composition.platform.aspectRatio,
      altText: semantic.occupations[0],
    };

    const audit = GeneratedImageQualityAuditor.auditGeneratedImage(
      mockAsset as any,
      brief,
      concept,
      composition,
      masterPrompt
    );

    console.log(`\n[Generated Image Quality & Semantic Fidelity Audit]`);
    console.log(`  Overall Quality Score: ${audit.overallScore}/100`);
    console.log(`  Pass Decision: ${audit.pass}`);
    console.log(`  Semantic Fidelity Scores:`, JSON.stringify(audit.semanticFidelity, null, 2));
    console.log(`  Analysis Methods Used: ${audit.analysisMethods.join(', ')}`);
    console.log(`  Unavailable Checks: ${audit.unavailableChecks.join(', ')}`);
  }

  console.log('\n=== RUNTIME AUDIT COMPLETED SUCCESSFULLY ===');
}

runRuntimeAudit().catch(console.error);
