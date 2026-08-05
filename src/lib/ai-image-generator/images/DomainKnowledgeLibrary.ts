import { DomainCategory } from './image.types';

export interface DomainRule {
  domain: DomainCategory;
  name: string;
  preferredPrimarySubjects: string[];
  preferredVisibleActions: string[];
  preferredSupportingObjects: string[];
  preferredEnvironments: string[];
  prohibitedMainSubjects: string[];
  communicationGoals: Record<string, { goal: string; subject: string; action: string; supporting: string[]; environment: string }>;
}

export class DomainKnowledgeLibrary {
  private static RULES: Record<DomainCategory, DomainRule> = {
    international_trade: {
      domain: 'international_trade',
      name: 'International Trade & Trade Finance',
      preferredPrimarySubjects: [
        'Finance & Trade Strategy Executives',
        'CFO & Global Supply Chain Leaders',
        'Cross-Border Trade Risk Analysts',
        'International Commercial Contract Negotiators',
      ],
      preferredVisibleActions: [
        'comparing international payment terms, letter of credit contracts, and currency risk exposure matrices over a sunlit meeting table',
        'reviewing trade finance structures, payment risk profiles, and cross-border bank guarantees on interactive digital displays',
        'evaluating commercial risk vs cash-flow velocity with global shipment schedule documents and financial trade agreements',
      ],
      preferredSupportingObjects: [
        'letter of credit contract documents',
        'trade risk assessment matrices',
        'global payment terms strategy guide',
        'currency exposure financial tablet display',
        'incoterms responsibility charts',
        'international bank guarantee files',
      ],
      preferredEnvironments: [
        'Sunlit modern architectural corporate office with a subtle distant view of a commercial port and cargo ships outside the glass window',
        'Bright contemporary trade finance executive boardroom with high-contrast architectural lighting and subtle global trade map graphics',
      ],
      prohibitedMainSubjects: [
        'warehouse corridor',
        'empty storage hall',
        'empty logistics warehouse',
        'random shipping containers dominating frame',
        'empty cargo bay',
        'unmanned forklift hall',
      ],
      communicationGoals: {
        payment_terms: {
          goal: 'Minimize financial risk and optimize cash flow in international transactions',
          subject: 'CFO & International Trade Finance Directors',
          action: 'analyzing global payment terms, letter of credit risk exposure, and commercial contracts spread across a sunlit desk',
          supporting: ['letter of credit agreements', 'cash flow risk charts', 'trade finance tablet display', 'bank guarantee documents'],
          environment: 'Bright architectural executive office with subtle distant commercial shipping port background',
        },
        incoterms: {
          goal: 'Explain buyer and seller shipping risk transfer boundaries',
          subject: 'Global Logistics Counsel & Trade Operations Leaders',
          action: 'reviewing Incoterms risk allocation diagrams and shipping responsibility boundaries on a modern tablet display',
          supporting: ['incoterms chart', 'shipping route map', 'customs declaration document', 'trade contract'],
          environment: 'Sunlit modern corporate conference space with architectural glass and global trade route visuals',
        },
      },
    },

    finance: {
      domain: 'finance',
      name: 'Corporate Finance & Banking',
      preferredPrimarySubjects: [
        'Executive CFO & Financial Strategy Team',
        'Corporate Banking & Risk Directors',
        'Portfolio Managers & Capital Allocators',
      ],
      preferredVisibleActions: [
        'analyzing capital allocation, cash-flow trajectory, and market risk models on high-contrast financial displays',
        'evaluating portfolio performance, balance sheet projections, and investment yield reports around a daylight glass desk',
      ],
      preferredSupportingObjects: [
        'financial portfolio report binder',
        'soaring growth trend charts',
        'cash flow risk models',
        'market analysis tablet displays',
      ],
      preferredEnvironments: [
        'Sunlit modern executive office with floor-to-ceiling glass and bright high-contrast architectural accents',
      ],
      prohibitedMainSubjects: ['empty office', 'random stock ticker wall', 'dark trading pit'],
      communicationGoals: {
        risk_management: {
          goal: 'Mitigate financial exposure and protect capital reserves',
          subject: 'Chief Risk Officer & Senior Finance Committee',
          action: 'evaluating capital risk models and portfolio stress test scenarios on interactive financial displays',
          supporting: ['risk matrix reports', 'stress test graphs', 'capital allocation binders'],
          environment: 'Bright modern executive boardroom with daylight and sleek architectural features',
        },
      },
    },

    technology: {
      domain: 'technology',
      name: 'Technology, AI & Software Engineering',
      preferredPrimarySubjects: [
        'Lead Software Architect & AI Engineering Team',
        'Product Engineering Leaders & Technical Founders',
      ],
      preferredVisibleActions: [
        'collaborating on high-contrast system architecture diagrams, neural network flowcharts, and scalable infrastructure plans',
        'reviewing AI model benchmarks and code architecture on sleek high-resolution displays in natural sunlight',
      ],
      preferredSupportingObjects: [
        'system architecture flowcharts',
        'neural network topology diagrams',
        'tablet displaying AI performance benchmarks',
      ],
      preferredEnvironments: [
        'Bright, modern open-plan technology studio with clean architectural surfaces and vibrant daylight',
      ],
      prohibitedMainSubjects: ['empty server room', 'dark blue control room', 'floating green matrix code wall', 'empty computer monitors'],
      communicationGoals: {
        ai_automation: {
          goal: 'Accelerate engineering throughput and build intelligent automated systems',
          subject: 'AI Engineering Leads & Software Architects',
          action: 'analyzing automated pipeline flowcharts and neural model training metrics on a sunlit workstation',
          supporting: ['model architecture diagram', 'automation workflow tablet', 'clean code schema notes'],
          environment: 'Sunlit modern engineering studio with collaborative whiteboards and high-contrast accents',
        },
      },
    },

    marketing: {
      domain: 'marketing',
      name: 'Marketing & Brand Strategy',
      preferredPrimarySubjects: [
        'Creative Director & Brand Campaign Strategists',
        'Growth Marketing Team & Content Directors',
      ],
      preferredVisibleActions: [
        'organizing vibrant brand campaign visual moodboards, customer persona research cards, and distribution metrics',
        'evaluating omni-channel engagement analytics and creative assets on a large white collaborative desk',
      ],
      preferredSupportingObjects: [
        'brand campaign moodboards',
        'color swatch palettes',
        'audience engagement charts',
        'content calendar board',
      ],
      preferredEnvironments: [
        'Dynamic sunlit creative design studio with vibrant color accents and architectural daylight',
      ],
      prohibitedMainSubjects: ['generic lone laptop on desk', 'empty desk', 'stock hand pressing phone screen'],
      communicationGoals: {
        brand_growth: {
          goal: 'Build brand authority and drive customer acquisition',
          subject: 'Brand Strategy & Growth Marketing Team',
          action: 'reviewing campaign performance dashboards and creative brand identity mockups on a daylight table',
          supporting: ['brand identity guidelines', 'growth chart tablet', 'creative visual campaign assets'],
          environment: 'Sunlit creative agency studio with vibrant color accents and collaborative workspace',
        },
      },
    },

    healthcare: {
      domain: 'healthcare',
      name: 'Healthcare & Medical Science',
      preferredPrimarySubjects: [
        'Clinical Directors & Medical Research Team',
        'Healthcare Leaders & Patient Care Specialists',
      ],
      preferredVisibleActions: [
        'analyzing clinical treatment protocols, patient care metrics, and diagnostic data in a sunlit medical workspace',
        'reviewing medical research findings and healthcare innovation strategies on high-resolution clinical displays',
      ],
      preferredSupportingObjects: [
        'clinical diagnostic tablet display',
        'patient care protocol files',
        'medical research charts',
      ],
      preferredEnvironments: [
        'Bright, pristine, daylight-filled modern medical research center with architectural glass',
      ],
      prohibitedMainSubjects: ['empty hospital hallway', 'random lone microscope', 'dark laboratory'],
      communicationGoals: {
        clinical_excellence: {
          goal: 'Improve patient care outcomes through clinical innovation',
          subject: 'Clinical Directors & Care Specialists',
          action: 'discussing patient treatment data and clinical protocol updates over a bright diagnostic tablet',
          supporting: ['diagnostic charts', 'clinical protocol tablets', 'care quality reports'],
          environment: 'Sunlit modern medical center conference room with clean architectural daylight',
        },
      },
    },

    education: {
      domain: 'education',
      name: 'Education & Professional Development',
      preferredPrimarySubjects: ['Academic Instructors & Engaged Professional Learners'],
      preferredVisibleActions: [
        'collaborating on research project findings, interactive learning diagrams, and skill development roadmaps',
      ],
      preferredSupportingObjects: ['research findings notes', 'interactive learning tablets', 'skill matrix boards'],
      preferredEnvironments: ['Bright modern educational auditorium or sunlit seminar studio'],
      prohibitedMainSubjects: ['empty classroom', 'empty chalkboard'],
      communicationGoals: {
        learning_growth: {
          goal: 'Master key skills and foster continuous professional development',
          subject: 'Master Educators & Professional Trainees',
          action: 'discussing strategy framework diagrams and research case studies in a sunlit seminar hall',
          supporting: ['framework diagrams', 'research binder', 'interactive tablet display'],
          environment: 'Sunlit modern educational auditorium with clean natural light',
        },
      },
    },

    manufacturing: {
      domain: 'manufacturing',
      name: 'Manufacturing & Industrial Engineering',
      preferredPrimarySubjects: ['Industrial Engineering Team & Plant Operations Managers'],
      preferredVisibleActions: [
        'reviewing precision production schematics, quality control metrics, and automated assembly workflows on digital tablets',
      ],
      preferredSupportingObjects: ['production flow schematics', 'quality control tablet charts', 'industrial component prototypes'],
      preferredEnvironments: ['Bright, modern, clean-tech advanced manufacturing facility with natural skylight'],
      prohibitedMainSubjects: ['empty warehouse', 'rusty factory floor', 'empty assembly line'],
      communicationGoals: {
        quality_control: {
          goal: 'Ensure zero-defect production and operational excellence',
          subject: 'Plant Operations Managers & Precision Engineers',
          action: 'inspecting high-precision component schematics and quality compliance charts on a bright digital tablet',
          supporting: ['precision schematics', 'quality assurance report', 'component prototype'],
          environment: 'Sunlit modern clean-tech advanced manufacturing workspace',
        },
      },
    },

    business: {
      domain: 'business',
      name: 'General Business & Executive Leadership',
      preferredPrimarySubjects: ['Executive Leadership Team & Management Consultants'],
      preferredVisibleActions: [
        'collaborating around a sleek daylight conference table reviewing strategic roadmap documents and growth trajectory charts',
      ],
      preferredSupportingObjects: ['strategic growth roadmap', 'performance KPI charts', 'executive tablet displays'],
      preferredEnvironments: ['Sunlit modern architectural corporate suite with clean daylight'],
      prohibitedMainSubjects: ['empty office', 'empty conference table', 'generic handshake'],
      communicationGoals: {
        strategy: {
          goal: 'Drive organizational growth and strategic execution',
          subject: 'Executive Directors & Strategy Team',
          action: 'evaluating quarterly execution milestones and competitive market positioning charts on a sunlit desk',
          supporting: ['strategy planning board', 'KPI performance tablet', 'executive report binder'],
          environment: 'Sunlit modern corporate executive suite with architectural glass',
        },
      },
    },
  };

  /**
   * Detects the matching domain category from text content.
   */
  static detectDomain(topic: string, content: string = ''): DomainCategory {
    const textLower = (topic + ' ' + content).toLowerCase();

    if (
      textLower.includes('trade') ||
      textLower.includes('payment terms') ||
      textLower.includes('incoterms') ||
      textLower.includes('letter of credit') ||
      textLower.includes('cross-border') ||
      textLower.includes('export') ||
      textLower.includes('import') ||
      textLower.includes('customs')
    ) {
      return 'international_trade';
    }

    if (
      textLower.includes('finance') ||
      textLower.includes('cfo') ||
      textLower.includes('banking') ||
      textLower.includes('risk management') ||
      textLower.includes('capital') ||
      textLower.includes('investment') ||
      textLower.includes('cash flow')
    ) {
      return 'finance';
    }

    if (
      textLower.includes('ai') ||
      textLower.includes('code') ||
      textLower.includes('software') ||
      textLower.includes('developer') ||
      textLower.includes('engineer') ||
      textLower.includes('automation')
    ) {
      return 'technology';
    }

    if (
      textLower.includes('marketing') ||
      textLower.includes('brand') ||
      textLower.includes('campaign') ||
      textLower.includes('social media') ||
      textLower.includes('audience')
    ) {
      return 'marketing';
    }

    if (
      textLower.includes('health') ||
      textLower.includes('medical') ||
      textLower.includes('patient') ||
      textLower.includes('clinical') ||
      textLower.includes('doctor')
    ) {
      return 'healthcare';
    }

    if (
      textLower.includes('education') ||
      textLower.includes('learn') ||
      textLower.includes('student') ||
      textLower.includes('teacher') ||
      textLower.includes('school')
    ) {
      return 'education';
    }

    if (
      textLower.includes('manufactur') ||
      textLower.includes('factory') ||
      textLower.includes('industrial') ||
      textLower.includes('plant') ||
      textLower.includes('assembly')
    ) {
      return 'manufacturing';
    }

    return 'business';
  }

  static getDomainRule(domain: DomainCategory): DomainRule {
    return this.RULES[domain] || this.RULES.business;
  }
}
