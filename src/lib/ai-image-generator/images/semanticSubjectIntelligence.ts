import crypto from 'crypto';
import { SemanticSubjectExtraction } from './semantic-subject.types';
import { SemanticSubjectExtractionSchema } from './semantic-subject.schema';

interface DomainSpec {
  domain: string;
  primarySubject: string;
  occupations: string[];
  physicalObjects: string[];
  environment: string;
  location: string;
  visibleActions: string[];
  secondarySubjects: string[];
  visualKeywords: string[];
  elementsThatMustAppear: string[];
  elementsThatMustNeverAppear: string[];
  matchKeywords: string[];
}

export class SemanticSubjectIntelligence {
  private static readonly defaultProhibitedAbstracts = [
    'abstract floating circles',
    'meaningless glowing blue holograms',
    'random futuristic interfaces',
    'unreadable generated matrix text',
    'floating cyber icons in empty space',
  ];

  private static readonly domainSpecs: DomainSpec[] = [
    {
      domain: 'future-jobs',
      primarySubject: 'Multi-disciplinary technical professionals collaborating in a high-tech modern workplace',
      occupations: [
        'Software engineer',
        'AI engineer',
        'Cybersecurity analyst',
        'Data scientist',
        'Healthcare professional using AI diagnostics',
        'Robotics engineer',
        'Renewable energy technician',
        'Advanced manufacturing specialist',
        'Educator using digital learning tools',
      ],
      physicalObjects: [
        'Multi-monitor code workstations',
        'Robotics equipment',
        'Photovoltaic energy telemetry screens',
        'AI diagnostic monitors',
        'Encrypted cyber threat dashboards',
        'Interactive digital learning tablets',
      ],
      environment: 'Modern collaborative multi-industry innovation workspace',
      location: 'High-tech collaborative innovation hub',
      visibleActions: [
        'Programming AI algorithms',
        'Auditing cloud security telemetry',
        'Reviewing AI radiology diagnostics',
        'Calibrating robotic assembly equipment',
        'Inspecting renewable energy grid metrics',
      ],
      secondarySubjects: ['High-performance computing workstations', 'Robotics assembly gear', 'Diagnostic displays'],
      visualKeywords: ['software engineers', 'AI engineers', 'cybersecurity analysts', 'data scientists', 'collaborative workplace'],
      elementsThatMustAppear: [
        'Realistic professionals in recognizable technical occupations',
        'Profession-specific tools and multi-monitor workstations',
        'Modern collaborative workplace setting',
      ],
      elementsThatMustNeverAppear: [
        ...SemanticSubjectIntelligence.defaultProhibitedAbstracts,
        'unrelated executive-board scene',
        'meaningless abstract central object',
        'generic hologram as primary subject',
      ],
      matchKeywords: ['future of work', 'high-growth careers', 'essential skills for the next decade', 'emerging careers', 'future jobs'],
    },
    {
      domain: 'international-trade',
      primarySubject: 'International trade finance professionals reviewing payment terms, letters of credit, and commercial risk agreements',
      occupations: ['Trade finance specialist', 'Export logistics manager', 'Customs compliance officer', 'Global trade director'],
      physicalObjects: ['Letter of credit agreement documents', 'Shipping manifests', 'Container port route maps', 'Commercial invoices'],
      environment: 'Modern trade finance executive office overlooking global shipping port container terminal',
      location: 'Global trade logistics control hub',
      visibleActions: ['Analyzing payment terms and letter of credit clauses', 'Verifying shipping manifests', 'Reviewing export risk agreements'],
      secondarySubjects: ['Container port backdrop', 'Trade contract papers', 'Global shipping logistics displays'],
      visualKeywords: ['trade finance specialist', 'letter of credit', 'container shipping', 'payment terms', 'export logistics'],
      elementsThatMustAppear: ['Trade finance professionals', 'Shipping port or logistics center background', 'Trade contracts and documentation'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'glowing globe with floating magic arrows', 'floating cargo boxes in hyperspace'],
      matchKeywords: ['international trade', 'trade finance', 'letter of credit', 'letters of credit', 'payment terms', 'incoterms', 'exporter', 'importer', 'bill of lading', 'customs compliance'],
    },
    {
      domain: 'healthcare',
      primarySubject: 'Healthcare professionals and radiologists reviewing AI-assisted clinical imaging and patient diagnostics',
      occupations: ['Radiologist', 'Healthcare professional using AI', 'Clinical researcher', 'Specialist physician'],
      physicalObjects: ['AI diagnostic workstation screens', 'High-resolution radiology imaging tablet', 'Stethoscope', 'Patient monitoring displays'],
      environment: 'Bright modern clinical radiology and diagnostic suite with daylight',
      location: 'Advanced medical imaging center',
      visibleActions: ['Examining high-resolution diagnostic scans', 'Discussing clinical treatment options', 'Reviewing AI diagnostic telemetry'],
      secondarySubjects: ['Diagnostic screens', 'Clinical workstation', 'Medical laboratory backdrop'],
      visualKeywords: ['radiologist', 'healthcare professional', 'AI diagnostics', 'clinical imaging', 'medical suite'],
      elementsThatMustAppear: ['Medical professionals in scrubs/coats', 'Diagnostic screen displays', 'Clean medical facility setting'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'glowing DNA holograms', 'magic floating pills'],
      matchKeywords: ['healthcare', 'radiology', 'radiologist', 'clinical', 'patient', 'surgeon', 'doctor', 'medical imaging', 'ai diagnostics', 'medical data', 'hipaa'],
    },
    {
      domain: 'finance',
      primarySubject: 'Financial analysts and portfolio managers analyzing real-time market risk metrics and financial performance graphs',
      occupations: ['Financial analyst', 'Portfolio manager', 'Investment risk advisor', 'Compliance director'],
      physicalObjects: ['Multi-monitor financial chart displays', 'Bloomberg data terminal', 'Portfolio risk spreadsheets', 'Financial report documents'],
      environment: 'Sunlit high-tech financial firm office with cityscape view',
      location: 'Financial analysis & trading hub',
      visibleActions: ['Evaluating live financial chart trends', 'Presenting quarterly market growth metrics', 'Reviewing portfolio risk models'],
      secondarySubjects: ['Financial charts on dual screens', 'Executive workstation', 'Market telemetry'],
      visualKeywords: ['financial analyst', 'portfolio manager', 'market charts', 'financial reporting', 'trading floor'],
      elementsThatMustAppear: ['Financial analysts', 'Financial chart monitors', 'Professional corporate environment'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating gold coins', 'fantasy money trees', 'glowing stock cubes'],
      matchKeywords: ['finance', 'financial', 'portfolio', 'stock market', 'revenue growth', 'banking', 'investment', 'risk management'],
    },
    {
      domain: 'ai',
      primarySubject: 'AI engineers and data scientists developing neural network architectures at multi-screen workstations',
      occupations: ['AI engineer', 'Machine learning researcher', 'Data scientist', 'Neural network architect'],
      physicalObjects: ['Multi-monitor code IDE terminals', 'Neural network training dashboards', 'GPU server racks', 'Algorithm telemetry tablets'],
      environment: 'Modern sunlit AI research laboratory workspace',
      location: 'AI development studio',
      visibleActions: ['Training machine learning models', 'Debugging neural network code', 'Inspecting algorithm accuracy telemetry'],
      secondarySubjects: ['Code terminals', 'Server infrastructure', 'Model evaluation dashboards'],
      visualKeywords: ['AI engineer', 'data scientist', 'neural network dashboard', 'multi-monitor workspace', 'code terminal'],
      elementsThatMustAppear: ['AI engineers at multi-monitor code setups', 'Visible neural network training dashboards', 'Tech lab setting'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'glowing robot terminator heads', 'raining matrix text', 'floating brain holograms'],
      matchKeywords: ['artificial intelligence', 'machine learning', 'neural network', 'deep learning', 'ai model', 'data science', 'llm'],
    },
    {
      domain: 'education',
      primarySubject: 'University professors and students interacting with digital whiteboards and collaborative educational tablets',
      occupations: ['University professor', 'Instructional technologist', 'STEM educator', 'Specialized student'],
      physicalObjects: ['Interactive digital whiteboards', 'Educational tablets', 'Collaborative student desks', 'Digital courseware laptops'],
      environment: 'Bright modern university collaborative learning lab classroom',
      location: 'Digital education center',
      visibleActions: ['Demonstrating interactive lesson modules', 'Guiding students through practical experiments', 'Facilitating collaborative group discussion'],
      secondarySubjects: ['Interactive whiteboards', 'Collaborative learning tables', 'Digital textbooks'],
      visualKeywords: ['university professor', 'students', 'digital whiteboard', 'collaborative classroom', 'interactive learning'],
      elementsThatMustAppear: ['Educators and students', 'Interactive digital learning tools', 'Modern classroom environment'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating glowing books in space', 'fantasy wizard hats'],
      matchKeywords: ['education', 'learning', 'university', 'classroom', 'student', 'professor', 'edtech', 'stem education'],
    },
    {
      domain: 'cybersecurity',
      primarySubject: 'Cybersecurity analysts in a Security Operations Center monitoring live network threat telemetry video wall displays',
      occupations: ['Cybersecurity analyst', 'Cloud security engineer', 'SOC threat intelligence specialist', 'Network security engineer'],
      physicalObjects: ['SOC threat telemetry video wall', 'Encrypted network topology monitors', 'Security event log screens', 'Diagnostic tablets'],
      environment: 'Modern Security Operations Center (SOC) hub with high-contrast monitoring displays',
      location: 'Enterprise security operations center',
      visibleActions: ['Analyzing live network intrusion alerts', 'Auditing cloud security telemetry', 'Configuring zero-trust security firewalls'],
      secondarySubjects: ['SOC video wall screens', 'Network security topology', 'Encrypted data streams'],
      visualKeywords: ['cybersecurity analyst', 'cloud security engineer', 'SOC video wall', 'threat detection', 'zero trust', 'security operations'],
      elementsThatMustAppear: ['Cybersecurity analysts', 'SOC screen video wall dashboards', 'Professional security command center'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'hooded cartoon hackers', 'raining green matrix text'],
      matchKeywords: ['cybersecurity', 'cloud security', 'threat detection', 'zero trust', 'zero-trust', 'firewall', 'vulnerability', 'soc', 'network security', 'encrypted network', 'security engineer'],
    },
    {
      domain: 'renewable-energy',
      primarySubject: 'Renewable energy technicians inspecting solar photovoltaic panel arrays and wind turbine power grid telemetry',
      occupations: ['Renewable energy technician', 'Solar installation engineer', 'Wind turbine specialist', 'Clean grid manager'],
      physicalObjects: ['Photovoltaic solar panels', 'Wind turbine towers', 'Energy grid power meters', 'Safety helmets and diagnostic tablets'],
      environment: 'Sunny outdoor photovoltaic solar farm with wind turbines under clear blue sky',
      location: 'Utility-scale renewable energy facility',
      visibleActions: ['Inspecting solar panel power output', 'Calibrating wind turbine telemetry', 'Reviewing grid storage capacity'],
      secondarySubjects: ['Photovoltaic solar panels', 'Wind turbines', 'Power inverter station'],
      visualKeywords: ['renewable energy technician', 'solar panels', 'wind turbines', 'clean grid', 'photovoltaic farm'],
      elementsThatMustAppear: ['Renewable energy technicians with helmets', 'Solar arrays or wind turbines', 'Diagnostic monitoring equipment'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating green leaves with magic lightning', 'abstract green energy balls'],
      matchKeywords: ['renewable energy', 'solar', 'wind turbine', 'photovoltaic', 'clean energy', 'power grid', 'clean grid'],
    },
    {
      domain: 'manufacturing',
      primarySubject: 'Industrial automation engineers and technicians programming robotic assembly arms on a high-precision factory floor',
      occupations: ['Industrial automation engineer', 'Robotics assembly technician', 'Quality assurance inspector', 'Plant operations manager'],
      physicalObjects: ['Robotic assembly arms', 'CNC precision machinery', 'Quality inspection tablets', 'Industrial safety helmets'],
      environment: 'Clean modern automated high-precision manufacturing plant floor',
      location: 'Advanced industrial manufacturing facility',
      visibleActions: ['Programming robotic assembly arms', 'Inspecting precision manufactured components', 'Monitoring automated assembly throughput'],
      secondarySubjects: ['Robotic assembly arms', 'Precision CNC tools', 'Quality inspection station'],
      visualKeywords: ['industrial engineer', 'robotic arm', 'advanced manufacturing', 'factory floor', 'quality control'],
      elementsThatMustAppear: ['Industrial engineers', 'Precision manufacturing equipment and robotic arms', 'Clean factory environment'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'steampunk gears', 'dark Victorian factory smokestacks'],
      matchKeywords: ['manufacturing', 'industrial automation', 'robotic arm', 'assembly line', 'quality control', 'cnc', 'factory'],
    },
    {
      domain: 'tourism',
      primarySubject: 'Travel experience concierges and guides welcoming guests at a scenic resort overlooking natural scenery',
      occupations: ['Travel experience concierge', 'Eco-tourism guide', 'Hospitality operations manager', 'Resort director'],
      physicalObjects: ['Digital booking tablets', 'Travel itinerary guides', 'Welcome lounge seating', 'Local heritage maps'],
      environment: 'Sunlit eco-resort pavilion overlooking pristine natural coastal scenery',
      location: 'Scenic luxury eco-resort',
      visibleActions: ['Guiding visitors through heritage tours', 'Demonstrating eco-resort amenities', 'Reviewing guest travel itineraries'],
      secondarySubjects: ['Eco-resort pavilion', 'Scenic backdrop', 'Welcome reception area'],
      visualKeywords: ['travel concierge', 'eco tourism', 'scenic resort', 'hospitality', 'destination guide'],
      elementsThatMustAppear: ['Hospitality concierges', 'Scenic resort setting', 'Guest service area'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating suitcases in outer space', 'cartoon passport stamps'],
      matchKeywords: ['tourism', 'travel', 'resort', 'hospitality', 'hotel', 'destination', 'eco-tourism', 'vacation'],
    },
    {
      domain: 'law',
      primarySubject: 'Corporate attorneys and legal compliance officers reviewing contract agreements in a conference room',
      occupations: ['Corporate attorney', 'Legal compliance officer', 'Contract specialist', 'Litigation partner'],
      physicalObjects: ['Legal contract briefs', 'Law library reference volumes', 'Digital tablet contract review software', 'Legal documentation'],
      environment: 'Prestigious law firm conference room with mahogany table and classic law library backdrop',
      location: 'Corporate legal conference suite',
      visibleActions: ['Examining contract terms and compliance clauses', 'Advising corporate clients', 'Reviewing legal agreement documentation'],
      secondarySubjects: ['Contract documents', 'Law library books', 'Executive conference table'],
      visualKeywords: ['corporate attorney', 'legal compliance', 'contract review', 'law firm', 'legal conference room'],
      elementsThatMustAppear: ['Legal professionals', 'Contract documentation and briefs', 'Law office/conference room setting'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating glowing scales of justice in outer space', 'cartoon judge gavels with lightning'],
      matchKeywords: ['law', 'legal', 'attorney', 'lawyer', 'contract', 'compliance', 'litigation', 'legal brief'],
    },
    {
      domain: 'marketing',
      primarySubject: 'Digital marketing strategists and creative directors evaluating multi-channel campaign analytics displays',
      occupations: ['Digital marketing strategist', 'Brand creative director', 'Campaign analytics manager', 'Growth director'],
      physicalObjects: ['Campaign analytics screens', 'Visual brand mood boards', 'Ad wireframe tablets', 'Audience engagement displays'],
      environment: 'Dynamic sunlit creative marketing agency studio with collaborative planning boards',
      location: 'Creative marketing studio',
      visibleActions: ['Evaluating campaign ROI analytics', 'Reviewing brand mood board concepts', 'Mapping out multi-channel content strategy'],
      secondarySubjects: ['Campaign analytics displays', 'Creative mood boards', 'Design tablets'],
      visualKeywords: ['marketing strategist', 'creative director', 'campaign analytics', 'brand mood board', 'marketing studio'],
      elementsThatMustAppear: ['Marketing strategists', 'Campaign analytics displays', 'Creative studio setting'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating glowing megaphones in hyperspace', 'abstract dollar sign sparkles'],
      matchKeywords: ['marketing', 'campaign', 'brand strategy', 'digital strategy', 'ad spend', 'target audience', 'growth marketing'],
    },
    {
      domain: 'software-engineering',
      primarySubject: 'Full-stack software engineers collaborating on cloud software architecture at multi-monitor code setups',
      occupations: ['Full-stack software engineer', 'Cloud architect', 'DevOps engineer', 'Backend systems engineer'],
      physicalObjects: ['Multi-monitor IDE code terminals', 'Cloud architecture telemetry dashboards', 'Code review screens', 'Git repository displays'],
      environment: 'Modern open-plan software development office workspace',
      location: 'Software development engineering studio',
      visibleActions: ['Writing clean software code', 'Reviewing pull request diffs', 'Deploying cloud microservices'],
      secondarySubjects: ['Multi-monitor IDE setups', 'Cloud architecture diagrams', 'Code terminals'],
      visualKeywords: ['software engineer', 'cloud architect', 'IDE code terminal', 'multi-monitor setup', 'software office'],
      elementsThatMustAppear: ['Software engineers at multi-monitor code setups', 'IDE displays', 'Tech workspace setting'],
      elementsThatMustNeverAppear: [...SemanticSubjectIntelligence.defaultProhibitedAbstracts, 'floating 3D binary spheres', 'abstract cyber tunnels'],
      matchKeywords: ['software engineering', 'software engineer', 'developer', 'cloud automation', 'coding', 'full stack', 'pull request', 'github', 'ide'],
    },
  ];

  public static extract(postContent: string, briefId?: string): SemanticSubjectExtraction {
    const textLower = (postContent || '').toLowerCase();

    // 1. Evaluate all domain matches based on keyword hits
    const matchedDomains: { spec: DomainSpec; hits: number; evidence: string[] }[] = [];

    for (const spec of SemanticSubjectIntelligence.domainSpecs) {
      const hits: string[] = [];
      for (const kw of spec.matchKeywords) {
        if (textLower.includes(kw)) {
          hits.push(kw);
        }
      }
      if (hits.length > 0) {
        matchedDomains.push({ spec, hits: hits.length, evidence: hits });
      }
    }

    // Sort matched domains by hit count descending
    matchedDomains.sort((a, b) => b.hits - a.hits);

    let primarySpec: DomainSpec;
    let secondarySpec: DomainSpec | undefined = undefined;

    if (matchedDomains.length > 0) {
      primarySpec = matchedDomains[0].spec;
      if (matchedDomains.length > 1 && matchedDomains[1].hits >= 1) {
        // Ensure secondary spec is distinct from primary
        if (matchedDomains[1].spec.domain !== primarySpec.domain) {
          secondarySpec = matchedDomains[1].spec;
        }
      }
    } else {
      // General professional fallback
      primarySpec = {
        domain: 'general-professional',
        primarySubject: 'Business professionals collaborating in a sunlit modern workplace',
        occupations: ['Operations Specialist', 'Project Manager', 'Domain Director'],
        physicalObjects: ['Digital workstation screens', 'Analytical reports', 'Collaborative tablets'],
        environment: 'Sunlit modern corporate executive workspace',
        location: 'Corporate operations office',
        visibleActions: ['Reviewing operational strategy', 'Analyzing key performance metrics'],
        secondarySubjects: ['Executive workspace', 'Analytical displays'],
        visualKeywords: ['professionals', 'collaboration', 'modern office', 'business operations'],
        elementsThatMustAppear: ['Business professionals', 'Workstation displays', 'Modern office setting'],
        elementsThatMustNeverAppear: SemanticSubjectIntelligence.defaultProhibitedAbstracts,
        matchKeywords: [],
      };
    }

    const sourceEvidence: string[] = [];
    sourceEvidence.push(`Primary Domain (${primarySpec.domain}): matched keywords [${matchedDomains[0]?.evidence.join(', ') || 'fallback'}]`);

    let domain = primarySpec.domain;
    let secondaryDomain: string | undefined = undefined;
    let isMixedDomain = false;
    let domainRelationships: string[] | undefined = undefined;

    let primarySubject = primarySpec.primarySubject;
    let occupations = [...primarySpec.occupations];
    let physicalObjects = [...primarySpec.physicalObjects];
    let environment = primarySpec.environment;
    let location = primarySpec.location;
    let visibleActions = [...primarySpec.visibleActions];
    let secondarySubjects = [...primarySpec.secondarySubjects];
    let visualKeywords = [...primarySpec.visualKeywords];
    let elementsThatMustAppear = [...primarySpec.elementsThatMustAppear];
    let elementsThatMustNeverAppear = [...primarySpec.elementsThatMustNeverAppear];

    // Handle genuine Multi-Domain synthesis when secondarySpec is present
    if (secondarySpec) {
      secondaryDomain = secondarySpec.domain;
      isMixedDomain = true;
      sourceEvidence.push(`Secondary Domain (${secondarySpec.domain}): matched keywords [${matchedDomains[1].evidence.join(', ')}]`);

      domainRelationships = [
        `Cross-domain collaboration bridging ${primarySpec.domain.toUpperCase()} (${primarySpec.occupations[0]}) and ${secondarySpec.domain.toUpperCase()} (${secondarySpec.occupations[0]}) inside ${primarySpec.environment}`,
      ];

      // Merge occupations from secondary domain cleanly without duplicates
      for (const occ of secondarySpec.occupations) {
        if (!occupations.includes(occ)) {
          occupations.push(occ);
        }
      }

      // Merge physical objects from secondary domain
      for (const obj of secondarySpec.physicalObjects) {
        if (!physicalObjects.includes(obj)) {
          physicalObjects.push(obj);
        }
      }

      // Merge visible actions from secondary domain
      for (const act of secondarySpec.visibleActions) {
        if (!visibleActions.includes(act)) {
          visibleActions.push(act);
        }
      }

      // Merge elements that must appear
      for (const elem of secondarySpec.elementsThatMustAppear) {
        if (!elementsThatMustAppear.includes(elem)) {
          elementsThatMustAppear.push(elem);
        }
      }

      primarySubject = `${primarySpec.occupations[0]} and ${secondarySpec.occupations[0]} collaborating on ${primarySpec.domain} & ${secondarySpec.domain} operations`;
    }

    const fpInput = `${postContent.toLowerCase()}||${domain}||${secondaryDomain || 'none'}`;
    const fingerprint = crypto.createHash('sha256').update(fpInput).digest('hex');
    const extractionId = `ssi_${fingerprint.slice(0, 12)}`;

    const confidenceByElement: Record<string, number> = {
      primarySubject: 0.95,
      occupations: isMixedDomain ? 0.96 : 0.92,
      physicalObjects: 0.90,
      environment: 0.94,
      visibleActions: 0.92,
      domain: 0.96,
      mixedDomainCoverage: isMixedDomain ? 0.98 : 1.0,
    };

    const extraction: SemanticSubjectExtraction = {
      id: extractionId,
      briefId,

      domain,
      secondaryDomain,
      isMixedDomain,
      domainRelationships,

      primarySubject,
      secondarySubjects,

      occupations,
      physicalObjects,
      environment,
      location,
      visibleActions,

      timePeriod: 'Present Day / Contemporary High-Tech Era',
      audience: 'Professional industry leaders and specialists',
      mood: 'Focused, collaborative, authentic, and modern',
      emotionalEffect: 'Inspiring trust, clarity, authority, and innovation',

      visualKeywords,
      visualMetaphors: ['Concrete professional representation of technical operations'],

      elementsThatMustAppear,
      elementsThatMustNeverAppear,

      confidenceByElement,
      sourceEvidence,

      deterministicFingerprint: fingerprint,
    };

    SemanticSubjectExtractionSchema.parse(extraction);

    return extraction;
  }
}
