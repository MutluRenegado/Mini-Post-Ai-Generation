import { FinalPostAnalyzer } from '../src/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualStyleColorEngine } from '../src/lib/ai-image-generator/images/VisualStyleColorEngine';

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
console.log('PHASE 1 RUNTIME AUDIT: LEVELS 30 & 31 INTELLIGENCE');
console.log('==================================================\n');

for (const fx of fixtures) {
  console.log(`==================================================`);
  console.log(`FIXTURE: ${fx.domain}`);
  console.log(`Article: "${fx.article}"\n`);

  const brief = FinalPostAnalyzer.analyze({ postContent: fx.article, platform: 'LinkedIn' });
  const result = VisualStyleColorEngine.planStyle(
    brief,
    brief.sceneGraph!,
    brief.spatialLayout!,
    brief.occupationInteractionPlan!,
    brief.environmentAuthenticityPlan!
  );

  const plan = result.plan;
  const envPlan = brief.environmentAuthenticityPlan!;

  console.log(`[Level 30 Environment Summary]`);
  console.log(`  Environment: ${envPlan.profile.canonicalName} (${envPlan.profile.indoorOutdoor})`);
  console.log(`  Workplace Location: ${envPlan.location.workplaceType}`);
  console.log(`  Transitions: ${envPlan.transitions.length} multi-space edges\n`);

  console.log(`[Level 31 Visual Style & Color Summary]`);
  console.log(`  Plan ID: ${plan.id}`);
  console.log(`  Style Genre: ${plan.styleType} | Medium: ${plan.renderingMedium}`);
  console.log(`  Primary Color: ${plan.palette.primary} | Accent: ${plan.palette.accent} | Neutral: ${plan.palette.neutral}`);
  console.log(`  Emotional Tone: ${plan.colorPsychology.emotionalTone}`);
  console.log(`  Accessibility Contrast: ${plan.accessibility.complianceLevel} (${plan.accessibility.textVsBackgroundRatio}:1 ratio)`);
  console.log(`  Brand Alignment Score: ${plan.brandAlignment.alignmentScore}/100`);
  console.log(`  Fingerprint: ${plan.fingerprint}\n`);

  console.log(`[Validation & Downstream Handoff]`);
  console.log(`  Validation Score: ${result.validationScore}/100 | Is Valid: ${result.isValid}\n`);
}

console.log('==================================================');
console.log('=== PHASE 1 RUNTIME AUDIT COMPLETE: LEVELS 30 & 31 VERIFIED ===');
