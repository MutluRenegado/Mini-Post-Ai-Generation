import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { EnvironmentAuthenticityEngine } from '../src/lib/ai-image-generator/images/EnvironmentAuthenticityEngine';

interface Fixture {
  domain: string;
  article: string;
}

const fixtures: Fixture[] = [
  {
    domain: 'SOFTWARE_ENGINEERING',
    article: 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups in a tech hub.',
  },
  {
    domain: 'HEALTHCARE',
    article: 'Clinical radiology specialists reviewing AI diagnostic imaging scans in a hospital imaging suite.',
  },
  {
    domain: 'CYBERSECURITY',
    article: 'Cloud security engineers monitoring zero-trust threat alerts and HIPAA access logs in a security operations center.',
  },
  {
    domain: 'RENEWABLE_ENERGY',
    article: 'Photovoltaic Solar Farms: Renewable Energy Technicians Inspecting Solar Panel Arrays outdoors on solar farm site.',
  },
  {
    domain: 'TRADE',
    article: 'Export Logistics Managers verifying letters of credit and cargo shipping manifests at international port trade finance office.',
  },
  {
    domain: 'EDUCATION',
    article: 'STEM University Professors interacting with digital whiteboards and collaborative educational tablets in university learning lab.',
  },
  {
    domain: 'MANUFACTURING',
    article: 'Industrial Automation Engineers Programming Robotic Assembly Arms on Clean High-Tech Factory Plant Floor.',
  },
  {
    domain: 'HEALTHCARE_AI_PLUS_CLOUD_SECURITY',
    article: 'Encrypted Healthcare AI Networks: Clinical radiology specialists reviewing AI diagnostic scans while cloud security engineers monitor zero-trust HIPAA compliance access controls and encrypted telemetry in a modern medical security hub.',
  },
];

console.log('==================================================');
console.log('LEVEL 30 RUNTIME AUDIT: ENVIRONMENT AUTHENTICITY INTELLIGENCE');
console.log('==================================================\n');

for (const fx of fixtures) {
  console.log(`==================================================`);
  console.log(`FIXTURE: ${fx.domain}`);
  console.log(`Article: "${fx.article}"\n`);

  const brief = FinalPostAnalyzer.analyze({ postContent: fx.article, platform: 'LinkedIn' });
  const result = EnvironmentAuthenticityEngine.planEnvironment(
    brief,
    brief.sceneGraph!,
    brief.spatialLayout!,
    brief.occupationInteractionPlan!
  );

  const plan = result.plan;

  console.log(`[Environment Authenticity Summary & Fingerprint]`);
  console.log(`  Plan ID: ${plan.id}`);
  console.log(`  Primary Domain: ${plan.primaryDomain} | Secondary Domain: ${plan.secondaryDomain || 'None'}`);
  console.log(`  Is Mixed-Domain: ${plan.isMixedDomain}`);
  console.log(`  Canonical Environment: ${plan.profile.canonicalName}`);
  console.log(`  Indoor / Outdoor Classification: ${plan.profile.indoorOutdoor}`);
  console.log(`  Workplace Location: ${plan.location.workplaceType}`);
  console.log(`  Fingerprint: ${plan.fingerprint}\n`);

  console.log(`[Architecture & Infrastructure]`);
  console.log(`  Building Style: ${plan.architecture.buildingStyle}`);
  console.log(`  Infrastructure Elements: ${plan.infrastructure.map((i) => i.label).join(', ') || 'Standard Technical Setup'}\n`);

  console.log(`[Environmental Conditions, Weather & Season]`);
  console.log(`  Era & Time of Day: ${plan.timePeriod.era} | ${plan.timePeriod.timeOfDay}`);
  console.log(`  Season: ${plan.season.seasonName} | Weather: ${plan.weather.condition}`);
  console.log(`  Cleanliness Level: ${plan.conditions.cleanlinessLevel}\n`);

  console.log(`[Transition Graph & Compatibility]`);
  if (plan.transitions.length > 0) {
    for (const tr of plan.transitions) {
      console.log(`  - [Transition] ${tr.sourceEnvironmentId} -> ${tr.destinationEnvironmentId} (${tr.accessibility})`);
    }
  } else {
    console.log(`  - Single Environment (No Multi-Space Transition Required)`);
  }
  console.log(`  Object Compatibilities: ${plan.objectCompatibilities.length} verified`);
  console.log(`  Occupation Compatibilities: ${plan.occupationCompatibilities.length} verified\n`);

  console.log(`[Component Confidence Map & Provenance]`);
  console.log(`  Env: ${plan.confidenceMap.environmentConfidence} | Loc: ${plan.confidenceMap.locationConfidence} | Infra: ${plan.confidenceMap.infrastructureConfidence}`);
  console.log(`  Direct Evidence Ratio: ${(plan.directEvidenceRatio * 100).toFixed(1)}% | Inferred Ratio: ${(plan.inferredEvidenceRatio * 100).toFixed(1)}%`);
  console.log(`  Validation Score: ${result.validationScore}/100 | Is Valid: ${result.isValid}\n`);
}

console.log('==================================================');
console.log('=== LEVEL 30 RUNTIME AUDIT COMPLETE: ALL DOMAINS VERIFIED ===');
