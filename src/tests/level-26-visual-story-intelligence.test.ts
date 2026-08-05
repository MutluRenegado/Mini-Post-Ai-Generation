import assert from 'assert';
import { test, describe } from 'node:test';
import { VisualStoryEngine, StoryBuilder, NarrativePlanner, StoryValidator, StoryPriorityPlanner } from '../lib/ai-image-generator/images/VisualStoryEngine';
import { FinalPostAnalyzer } from '../lib/ai-image-generator/images/finalPostAnalyzer';
import { SemanticSubjectIntelligence } from '../lib/ai-image-generator/images/semanticSubjectIntelligence';

describe('Level 26: Visual Story Intelligence & Dynamic Validation Test Suite (10 Mandatory Negative/Degraded Cases + Multi-Domain Tests)', () => {
  const validArticleText = 'Full-stack software engineers and AI developers deploying high-performance neural network models at multi-monitor workstation setups in a sunlit tech hub.';

  // --- 10 MANDATORY DYNAMIC VALIDATION & NEGATIVE TEST CASES ---

  test('Case 1: Complete valid visual story receives passing score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const report = StoryValidator.validateStory(brief.visualStory!, brief.semanticSubject!);

    assert.strictEqual(report.isValid, true);
    assert.strictEqual(report.validationScore >= 80, true);
    assert.strictEqual(report.deductions.length, 0);
  });

  test('Case 2: Missing hero subject produces critical deduction and fails validation', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      who: [],
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.isValid, false);
    assert.strictEqual(report.validationScore <= 80, true);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Hero Subject Fidelity' && d.pointsDeducted === 20), true);
  });

  test('Case 3: Missing visible action reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      actions: [],
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Visible Action Coverage' && d.pointsDeducted === 15), true);
  });

  test('Case 4: Missing environment reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      context: '',
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Environment Relevance' && d.pointsDeducted === 15), true);
  });

  test('Case 5: Missing required object reduces score', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      requiredVisualEvidence: [],
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Required Objects Grounding' && d.pointsDeducted === 15), true);
  });

  test('Case 6: Prohibited abstract imagery incurs penalty of 25 points per item', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      heroStory: `${brief.visualStory!.heroStory} featuring a glowing blue hologram and floating abstract circle`,
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.isValid, false);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Prohibited Abstract Imagery' && d.pointsDeducted === 25), true);
  });

  test('Case 7: Unrelated occupation incurs penalty of 20 points', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      heroStory: `${brief.visualStory!.heroStory} with an astronaut and deep-sea diver`,
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Unrelated Occupation Penalty' && d.pointsDeducted === 20), true);
  });

  test('Case 8: Mixed-domain article with one domain omitted loses 15 coverage points', () => {
    const mixedArticleText = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedArticleText, platform: 'LinkedIn' });

    // Omit secondary domain (cybersecurity) from story text
    const defectiveStory = {
      ...brief.visualStory!,
      heroStory: 'Radiologist reviewing AI diagnostic MRI scans in clinical radiology suite.',
      supportingStory: 'Healthcare professional assisting radiologist on medical scans.',
      who: [
        { role: 'Radiologist', relationship: 'Primary focal protagonist', visualRole: 'hero' as const, expression: 'Focused' },
        { role: 'Healthcare Professional', relationship: 'Assisting radiologist', visualRole: 'supporting' as const, expression: 'Attentive' },
      ],
      requiredVisualEvidence: ['Radiologist', 'Diagnostic scans', 'Radiology suite'],
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Mixed-Domain Coverage' && d.pointsDeducted === 15), true);
  });

  test('Case 9: Empty or minimal article fails sanitization/analysis validation', () => {
    assert.throws(
      () => FinalPostAnalyzer.analyze({ postContent: '', platform: 'LinkedIn' }),
      /FINALIZED_POST_REQUIRED/
    );
  });

  test('Case 10: Conflicting semantic evidence incurs penalty of 20 points', () => {
    const brief = FinalPostAnalyzer.analyze({ postContent: validArticleText, platform: 'LinkedIn' });
    const defectiveStory = {
      ...brief.visualStory!,
      heroStory: `${brief.visualStory!.heroStory} on an outdoor solar farm inside a closed dark basement`,
    };

    const report = StoryValidator.validateStory(defectiveStory, brief.semanticSubject!);
    assert.strictEqual(report.deductions.some((d) => d.criterion === 'Internal Semantic Contradiction' && d.pointsDeducted === 20), true);
  });

  // --- MULTI-DOMAIN INTEGRATION TEST ---

  test('Genuine Healthcare AI + Cloud Security mixed-domain article extracts and synthesizes both domains coherently', () => {
    const mixedArticle = 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.';
    const brief = FinalPostAnalyzer.analyze({ postContent: mixedArticle, platform: 'LinkedIn' });
    const semantic = brief.semanticSubject!;
    const story = brief.visualStory!;

    assert.strictEqual(semantic.isMixedDomain, true);
    assert.strictEqual(semantic.domain, 'healthcare');
    assert.strictEqual(semantic.secondaryDomain, 'cybersecurity');

    // Both occupations present
    assert.strictEqual(semantic.occupations.includes('Radiologist'), true);
    assert.strictEqual(semantic.occupations.includes('Cloud security engineer'), true);

    // Objects from both domains present
    assert.strictEqual(semantic.physicalObjects.includes('AI diagnostic workstation screens'), true);
    assert.strictEqual(semantic.physicalObjects.includes('SOC threat telemetry video wall'), true);

    // Story includes both hero and supporting cross-domain roles
    assert.strictEqual(story.who[0].role, 'Radiologist');
    assert.strictEqual(['Cybersecurity analyst', 'Cloud security engineer'].includes(story.who[1].role), true);

    // Required visual evidence mandates representation of both domains
    assert.strictEqual(story.requiredVisualEvidence.some((e) => e.toLowerCase().includes('cybersecurity') || e.toLowerCase().includes('cloud security')), true);

    // Validation report confirms 100/100 pass for complete mixed-domain story
    const report = StoryValidator.validateStory(story, semantic);
    assert.strictEqual(report.isValid, true);
    assert.strictEqual(report.validationScore, 100);
  });
});
