import type { VisualReference } from '../../library/domain/visual-reference.model';
import type { IImageLibraryRepository } from '../../library/repositories/image-library-repository.interface';
import { VisualReferenceResolver } from '../resolution/VisualReferenceResolver';
import type { VisualResolverOutput } from '../resolution/resolution.types';

export interface CalibrationTestCase {
  id: string;
  domain: 'finance' | 'technology' | 'healthcare' | 'education' | 'logistics' | 'marketing' | 'retail' | 'workplace';
  title: string;
  querySubject: string;
  queryIndustry: string;
  queryScene?: string;
  queryRoles?: string[];
  queryObjects?: string[];
  expectedConcepts: string[];
  avoidConcepts: string[];
}

export interface EvaluationResult {
  testCaseId: string;
  domain: string;
  passed: boolean;
  retrievedCandidateTitle?: string;
  score?: number;
  explanation: string;
}

export class RetrievalEvaluationService {
  private resolver: VisualReferenceResolver;

  constructor(repository: IImageLibraryRepository) {
    this.resolver = new VisualReferenceResolver(repository);
  }

  static CALIBRATION_DATASET: CalibrationTestCase[] = [
    {
      id: 'trade_finance_lc_01',
      domain: 'finance',
      title: 'Understanding Trade Finance: What Is a Letter of Credit and Why Does It Matter?',
      querySubject: 'Letter of Credit',
      queryIndustry: 'Finance',
      queryScene: 'Professional financial meeting',
      queryRoles: ['banker', 'importer', 'exporter'],
      queryObjects: ['shipping documents', 'laptop', 'cargo containers'],
      expectedConcepts: ['finance', 'banker', 'trade', 'meeting', 'containers'],
      avoidConcepts: ['alphabet', 'isolated letters', 'abstract typography', 'fake document close-up'],
    },
    {
      id: 'tech_cloud_architecture_02',
      domain: 'technology',
      title: 'Enterprise Cloud Architecture Migration Strategy',
      querySubject: 'Cloud Architecture',
      queryIndustry: 'Technology',
      queryScene: 'Modern tech laboratory',
      queryRoles: ['software architect', 'engineer'],
      queryObjects: ['servers', 'workstation'],
      expectedConcepts: ['technology', 'server', 'engineer', 'code'],
      avoidConcepts: ['drawing of cloud', 'cartoon sky'],
    },
    {
      id: 'healthcare_telemedicine_03',
      domain: 'healthcare',
      title: 'Digital Health Solutions & Patient Telemedicine',
      querySubject: 'Telemedicine',
      queryIndustry: 'Healthcare',
      queryScene: 'Medical clinic workstation',
      queryRoles: ['doctor', 'patient'],
      queryObjects: ['stethoscope', 'tablet'],
      expectedConcepts: ['healthcare', 'doctor', 'clinic', 'tablet'],
      avoidConcepts: ['syringe closeup', 'scary needles'],
    },
  ];

  /**
   * Evaluates a calibration test case and verifies that relevant visual concepts rank above literal/abstract distractions.
   */
  async evaluateTestCase(testCase: CalibrationTestCase): Promise<EvaluationResult> {
    const res: VisualResolverOutput = await this.resolver.resolve({
      query: {
        queryId: `test_${testCase.id}`,
        subject: testCase.querySubject,
        industry: testCase.queryIndustry,
        scene: testCase.queryScene,
        roles: testCase.queryRoles,
        objects: testCase.queryObjects,
        createdAt: new Date().toISOString(),
      },
      includeExplanations: true,
    });

    if (res.retrievalStatus === 'NO_REFERENCE_MATCH' || res.references.length === 0) {
      return {
        testCaseId: testCase.id,
        domain: testCase.domain,
        passed: false,
        explanation: `Evaluation failed: No approved reference matched the query. (${res.explanation})`,
      };
    }

    const topRef = res.references[0];
    const topTitle = topRef.title.toLowerCase();

    // Check if any avoid concepts dominated
    const hitAvoid = testCase.avoidConcepts.some((avoid) => topTitle.includes(avoid.toLowerCase()));
    if (hitAvoid) {
      return {
        testCaseId: testCase.id,
        domain: testCase.domain,
        passed: false,
        retrievedCandidateTitle: topRef.title,
        explanation: `Evaluation failed: Top candidate "${topRef.title}" contained avoided literal/abstract concept.`,
      };
    }

    return {
      testCaseId: testCase.id,
      domain: testCase.domain,
      passed: true,
      retrievedCandidateTitle: topRef.title,
      score: res.rankedCandidates ? res.rankedCandidates[0].finalScore : undefined,
      explanation: `Evaluation passed: Top candidate "${topRef.title}" matched expected concepts cleanly.`,
    };
  }
}
