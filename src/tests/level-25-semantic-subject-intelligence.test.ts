import assert from 'assert';
import { test, describe } from 'node:test';
import { SemanticSubjectIntelligence } from '../lib/ai-image-generator/images/semanticSubjectIntelligence';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '../lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '../lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '../lib/ai-image-generator/images/masterImagePromptBuilder';
import { SemanticPromptValidator } from '../lib/ai-image-generator/images/semanticPromptValidator';
import { PromptRepairEngine } from '../lib/ai-image-generator/images/promptRepairEngine';
import { GeneratedImageQualityAuditor } from '../lib/ai-image-generator/images/generatedImageQualityAuditor';

describe('Level 25: Semantic Subject Intelligence & Domain Audit Test Suite (45 Assertions)', () => {
  const domainsTestCases = [
    {
      domainName: 'healthcare',
      title: 'Healthcare AI Diagnostics & Clinical Radiology',
      content: 'Radiology specialists and healthcare professionals using AI diagnostic monitors to examine patient MRI scans.',
      expectedDomain: 'healthcare',
      expectedOccupation: 'Radiologist',
      expectedObject: 'AI diagnostic workstation screens',
      expectedEnvironment: 'Bright modern clinical radiology and diagnostic suite with daylight',
    },
    {
      domainName: 'finance',
      title: 'Quarterly Finance & Portfolio Growth',
      content: 'Financial analysts and portfolio managers analyzing real-time stock market risk graphs and Bloomberg data terminals.',
      expectedDomain: 'finance',
      expectedOccupation: 'Financial analyst',
      expectedObject: 'Multi-monitor financial chart displays',
      expectedEnvironment: 'Sunlit high-tech financial firm office with cityscape view',
    },
    {
      domainName: 'international-trade',
      title: 'International Trade Payment Terms & Incoterms',
      content: 'Trade finance specialists reviewing payment terms, letters of credit, and commercial risk contracts at container port.',
      expectedDomain: 'international-trade',
      expectedOccupation: 'Trade finance specialist',
      expectedObject: 'Letter of credit agreement documents',
      expectedEnvironment: 'Modern trade finance executive office overlooking global shipping port container terminal',
    },
    {
      domainName: 'ai',
      title: 'Artificial Intelligence & Neural Network Architecture',
      content: 'AI engineers and machine learning researchers training neural network models at multi-monitor code setups.',
      expectedDomain: 'ai',
      expectedOccupation: 'AI engineer',
      expectedObject: 'Multi-monitor code IDE terminals',
      expectedEnvironment: 'Modern sunlit AI research laboratory workspace',
    },
    {
      domainName: 'education',
      title: 'Digital University Classroom & STEM Education',
      content: 'University professors and students interacting with digital whiteboards and collaborative educational tablets.',
      expectedDomain: 'education',
      expectedOccupation: 'University professor',
      expectedObject: 'Interactive digital whiteboards',
      expectedEnvironment: 'Bright modern university collaborative learning lab classroom',
    },
    {
      domainName: 'cybersecurity',
      title: 'Cybersecurity SOC Center & Zero Trust Security',
      content: 'Cybersecurity analysts in a Security Operations Center monitoring live threat telemetry video wall displays.',
      expectedDomain: 'cybersecurity',
      expectedOccupation: 'Cybersecurity analyst',
      expectedObject: 'SOC threat telemetry video wall',
      expectedEnvironment: 'Modern Security Operations Center (SOC) hub with high-contrast monitoring displays',
    },
    {
      domainName: 'renewable-energy',
      title: 'Photovoltaic Solar Farm & Wind Energy Grid',
      content: 'Renewable energy technicians inspecting solar photovoltaic panel arrays and wind turbine power grid telemetry.',
      expectedDomain: 'renewable-energy',
      expectedOccupation: 'Renewable energy technician',
      expectedObject: 'Photovoltaic solar panels',
      expectedEnvironment: 'Sunny outdoor photovoltaic solar farm with wind turbines under clear blue sky',
    },
    {
      domainName: 'manufacturing',
      title: 'Advanced Robotic Manufacturing Plant',
      content: 'Industrial automation engineers and technicians programming robotic assembly arms on a high-precision factory floor.',
      expectedDomain: 'manufacturing',
      expectedOccupation: 'Industrial automation engineer',
      expectedObject: 'Robotic assembly arms',
      expectedEnvironment: 'Clean modern automated high-precision manufacturing plant floor',
    },
    {
      domainName: 'tourism',
      title: 'Eco-Tourism Resort & Cultural Travel',
      content: 'Travel experience concierges and eco-tourism guides welcoming guests at a scenic destination resort overlooking natural scenery.',
      expectedDomain: 'tourism',
      expectedOccupation: 'Travel experience concierge',
      expectedObject: 'Digital booking tablets',
      expectedEnvironment: 'Sunlit eco-resort pavilion overlooking pristine natural coastal scenery',
    },
    {
      domainName: 'law',
      title: 'Corporate Legal Briefs & Contract Compliance',
      content: 'Corporate attorneys and legal compliance officers reviewing complex contract agreements in a prestigious conference room.',
      expectedDomain: 'law',
      expectedOccupation: 'Corporate attorney',
      expectedObject: 'Legal contract briefs',
      expectedEnvironment: 'Prestigious law firm conference room with mahogany table and classic law library backdrop',
    },
    {
      domainName: 'marketing',
      title: 'Digital Campaign Analytics & Brand Strategy',
      content: 'Digital marketing strategists and creative directors evaluating multi-channel campaign analytics displays.',
      expectedDomain: 'marketing',
      expectedOccupation: 'Digital marketing strategist',
      expectedObject: 'Campaign analytics screens',
      expectedEnvironment: 'Dynamic sunlit creative marketing agency studio with collaborative planning boards',
    },
    {
      domainName: 'software-engineering',
      title: 'Full-Stack Software Architecture & Cloud Automation',
      content: 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups.',
      expectedDomain: 'software-engineering',
      expectedOccupation: 'Full-stack software engineer',
      expectedObject: 'Multi-monitor IDE code terminals',
      expectedEnvironment: 'Modern open-plan software development office workspace',
    },
    {
      domainName: 'future-jobs',
      title: 'The Future of Work: High-Growth Careers and Essential Skills for the Next Decade',
      content: 'The Future of Work: High-Growth Careers and Essential Skills for the Next Decade',
      expectedDomain: 'future-jobs',
      expectedOccupation: 'Software engineer',
      expectedObject: 'Multi-monitor code workstations',
      expectedEnvironment: 'Modern collaborative multi-industry innovation workspace',
    },
  ];

  domainsTestCases.forEach((tc, idx) => {
    test(`${idx + 1}. Domain Audit: ${tc.domainName}`, () => {
      const extraction = SemanticSubjectIntelligence.extract(tc.content);
      assert.strictEqual(extraction.domain, tc.expectedDomain);
      assert.strictEqual(extraction.occupations.includes(tc.expectedOccupation), true);
      assert.strictEqual(extraction.physicalObjects.includes(tc.expectedObject), true);
      assert.strictEqual(extraction.environment, tc.expectedEnvironment);

      // Verify pipeline flow: Brief -> Concept -> Composition -> Prompt -> Validation -> Quality Audit
      const brief = FinalPostAnalyzer.analyze({ postContent: tc.content, platform: 'LinkedIn' });
      assert.strictEqual(brief.semanticSubject?.domain, tc.expectedDomain);

      const conceptRes = VisualConceptGenerator.generateConcepts(brief);
      assert.strictEqual(conceptRes.candidates.length >= 3, true);
      assert.strictEqual(conceptRes.selectedConcept.status, 'selected');

      const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
      assert.strictEqual(compRes.candidates.length >= 3, true);

      const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);
      assert.strictEqual(masterPrompt.promptText.startsWith('Inside '), true);
      assert.strictEqual(masterPrompt.promptText.includes(tc.expectedOccupation), true);

      const validation = SemanticPromptValidator.validate(masterPrompt, brief.semanticSubject);
      assert.strictEqual(validation.valid, true);

      const mockAsset = {
        id: `ast_${idx}`,
        url: 'https://example.com/image.png',
        width: 1080,
        height: 1080,
        aspectRatio: '1.91:1',
        altText: tc.expectedOccupation,
      };

      const audit = GeneratedImageQualityAuditor.auditGeneratedImage(
        mockAsset as any,
        brief,
        conceptRes.selectedConcept,
        compRes.selectedComposition,
        masterPrompt
      );

      assert.strictEqual(audit.pass, true);
      assert.strictEqual(audit.semanticFidelity !== undefined, true);
      assert.strictEqual(audit.semanticFidelity!.overallSemanticFidelity >= 85, true);
    });
  });

  test('14. Mandatory Future-Jobs article test satisfies strict entity grounding', () => {
    const futureJobsArticle = 'The Future of Work: High-Growth Careers and Essential Skills for the Next Decade';
    const brief = FinalPostAnalyzer.analyze({ postContent: futureJobsArticle, platform: 'LinkedIn' });
    const semantic = brief.semanticSubject!;

    assert.strictEqual(semantic.domain, 'future-jobs');
    assert.strictEqual(semantic.occupations.includes('Software engineer'), true);
    assert.strictEqual(semantic.occupations.includes('AI engineer'), true);
    assert.strictEqual(semantic.occupations.includes('Cybersecurity analyst'), true);
    assert.strictEqual(semantic.occupations.includes('Healthcare professional using AI diagnostics'), true);
    assert.strictEqual(semantic.occupations.includes('Robotics engineer'), true);

    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
    const prompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);

    assert.strictEqual(prompt.promptText.includes('Software engineer'), true);
    assert.strictEqual(prompt.promptText.includes('Cybersecurity analyst'), true);
    assert.strictEqual(prompt.promptText.includes('abstract floating circles'), false);
    assert.strictEqual(prompt.promptText.includes('meaningless glowing blue holograms'), false);
  });

  test('15. Semantic repair fixes defective abstract prompts non-destructively', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: 'Quarterly financial report shows 45% growth', platform: 'LinkedIn' });
    const conceptRes = VisualConceptGenerator.generateConcepts(brief);
    const compRes = CompositionPlanner.planComposition(brief, conceptRes.selectedConcept);
    const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, conceptRes.selectedConcept, compRes.selectedComposition);

    const defectivePrompt = {
      ...masterPrompt,
      promptText: `${masterPrompt.promptText} featuring a glowing blue hologram and floating abstract circle`,
    };

    const repair = PromptRepairEngine.repairPrompt(defectivePrompt);
    assert.strictEqual(repair.repaired, true);
    assert.strictEqual(repair.repairedPrompt.promptText.includes('glowing blue hologram'), false);
  });
});
