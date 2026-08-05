import { DomainCategory, PostVisualBrief } from './image.types';
import { DomainKnowledgeLibrary } from './DomainKnowledgeLibrary';

export interface SemanticSceneComposition {
  domainCategory: DomainCategory;
  communicationGoal: string;
  readerIntent: string;
  primarySubject: string;
  visibleAction: string;
  supportingSubjects: string[];
  backgroundContext: string;
  visualStory: string;
  prohibitedMainSubjects: string[];
}

export class SemanticSceneSelector {
  /**
   * Evaluates post title and full content to build a precise visual composition.
   * Enforces Visual Priority Rule: Communication Goal -> Primary Subject -> Visible Action -> Supporting Objects -> Background Context.
   */
  static selectScene(topic: string, content: string = ''): SemanticSceneComposition {
    const textLower = (topic + ' ' + content).toLowerCase();
    const domainCategory = DomainKnowledgeLibrary.detectDomain(topic, content);
    const domainRule = DomainKnowledgeLibrary.getDomainRule(domainCategory);

    // 1. Check for specific high-value trade finance & risk management scenarios
    if (
      (textLower.includes('trade') || textLower.includes('incoterms') || textLower.includes('export') || textLower.includes('import')) &&
      (textLower.includes('payment') || textLower.includes('risk') || textLower.includes('cfo') || textLower.includes('finance') || textLower.includes('credit'))
    ) {
      return {
        domainCategory: 'international_trade',
        communicationGoal: 'Master cross-border financial risk management and select optimal international payment terms',
        readerIntent: 'Understand how CFOs and trade leaders balance commercial risk vs cash-flow velocity in global contracts',
        primarySubject: 'Finance Executives & International Trade Strategy Directors',
        visibleAction:
          'analyzing cross-border payment term agreements, letter of credit risk exposure charts, and trade finance contracts spread over a sunlit meeting table',
        supportingSubjects: [
          'letter of credit contract agreements',
          'trade risk assessment matrix',
          'currency exposure financial tablet display',
          'international bank guarantee files',
          'incoterms responsibility charts',
        ],
        backgroundContext:
          'Sunlit modern architectural corporate office with a subtle distant view of a commercial port and cargo vessels through floor-to-ceiling glass',
        visualStory:
          'Senior finance leaders actively collaborating around a daylight meeting table, evaluating international payment options and risk balance, with global trade shipping visible strictly as distant background context.',
        prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
      };
    }

    // 2. Startup Leadership & Sustainable Growth Strategy
    if (textLower.includes('startup') || textLower.includes('founder') || textLower.includes('product-market fit') || textLower.includes('sustainable startup')) {
      return {
        domainCategory: 'business',
        communicationGoal: 'Build a sustainable startup through product-market fit, financial runway discipline, and customer feedback',
        readerIntent: 'Learn key pillars for scaling a resilient startup leadership team',
        primarySubject: 'Diverse Startup Leadership & Strategy Team',
        visibleAction:
          'an energetic editorial scene of a diverse startup leadership team collaborating around a modern white strategy table, actively pointing to physical product roadmaps, financial runway charts, customer feedback cards, and go-to-market strategy documents in a bright daylight office space',
        supportingSubjects: [
          'product-market fit roadmaps',
          'financial runway growth charts',
          'customer feedback strategy cards',
          'go-to-market plan display',
        ],
        backgroundContext: 'Sunlit modern collaborative studio space with clean daylight and architectural white surfaces',
        visualStory:
          'An energetic startup leadership team collaborating around a white strategy table evaluating growth roadmaps and financial metrics.',
        prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
      };
    }

    // 2. International Logistics & Incoterms Responsibility
    if (textLower.includes('incoterms') || (textLower.includes('shipping') && textLower.includes('responsibility'))) {
      return {
        domainCategory: 'international_trade',
        communicationGoal: 'Clarify risk transfer boundaries and buyer-seller responsibilities in global freight',
        readerIntent: 'Identify exact transfer points for cost, risk, and insurance in international shipping contracts',
        primarySubject: 'Global Logistics Counsel & Trade Operations Directors',
        visibleAction:
          'reviewing Incoterms risk allocation diagrams, shipping responsibility charts, and customs clearance files on an interactive tablet display',
        supportingSubjects: [
          'incoterms risk transfer chart',
          'bill of lading documents',
          'customs clearance files',
          'global logistics contract binder',
        ],
        backgroundContext:
          'Bright contemporary trade operations boardroom with natural daylight and subtle architectural trade map graphics',
        visualStory:
          'Trade operations leaders reviewing Incoterms responsibility boundaries on interactive tablet displays in a bright, modern studio space.',
        prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
      };
    }

    // 3. Corporate Financial Risk & Capital Allocation
    if (domainCategory === 'finance') {
      return {
        domainCategory: 'finance',
        communicationGoal: 'Optimize capital allocation and mitigate financial market exposure',
        readerIntent: 'Learn how corporate CFOs protect balance sheets and maintain financial liquidity',
        primarySubject: 'Executive CFO & Senior Financial Analysts',
        visibleAction:
          'analyzing cash-flow trajectory projections, capital allocation models, and balance sheet risk graphs on high-contrast displays',
        supportingSubjects: [
          'financial portfolio report binder',
          'soaring growth trend charts',
          'capital risk assessment models',
          'market analysis tablet display',
        ],
        backgroundContext: 'Sunlit modern executive conference suite with architectural glass and clean natural daylight',
        visualStory:
          'A focused CFO and financial analyst evaluating capital growth models and risk portfolios around a sunlit executive desk.',
        prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
      };
    }

    // 4. AI Engineering & Software Architecture
    if (domainCategory === 'technology') {
      return {
        domainCategory: 'technology',
        communicationGoal: 'Build scalable software architecture and deploy automated AI systems',
        readerIntent: 'Discover engineering best practices for building resilient, high-throughput AI pipelines',
        primarySubject: 'Lead Software Architect & AI Engineering Team',
        visibleAction:
          'collaborating on high-contrast system architecture flowcharts, neural network data flows, and scalable infrastructure plans',
        supportingSubjects: [
          'system architecture topology diagram',
          'neural network flow chart',
          'tablet displaying AI performance benchmarks',
          'code structure schema notes',
        ],
        backgroundContext: 'Bright, modern open-plan technology studio with clean architectural surfaces and vibrant daylight',
        visualStory:
          'Engineers collaborating over a sunlit workstation, reviewing colorful system architecture flowcharts and neural model metrics.',
        prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
      };
    }

    // 5. Marketing & Brand Strategy
    if (domainCategory === 'marketing') {
      return {
        domainCategory: 'marketing',
        communicationGoal: 'Establish brand authority and execute high-converting omni-channel campaigns',
        readerIntent: 'Learn how creative directors scale audience engagement and brand equity',
        primarySubject: 'Creative Director & Growth Campaign Strategists',
        visibleAction:
          'organizing vibrant campaign visual moodboards, customer persona research cards, and distribution metrics on a daylight table',
        supportingSubjects: [
          'brand campaign moodboards',
          'color palette swatch cards',
          'audience engagement analytics chart',
          'content calendar board',
        ],
        backgroundContext: 'Dynamic sunlit creative design studio with vibrant color accents and architectural daylight',
        visualStory:
          'A creative brand team reviewing campaign visual boards and analytics charts in a bright, modern studio.',
        prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
      };
    }

    // Default Fallback: General Business Strategy
    return {
      domainCategory,
      communicationGoal: `Drive strategic execution and organizational growth for ${topic}`,
      readerIntent: `Apply strategic leadership frameworks and operational best practices for ${topic}`,
      primarySubject: `Executive Leadership Team & Industry Experts in ${topic}`,
      visibleAction: `collaborating around a sleek daylight conference table, reviewing strategic roadmap documents, KPI growth charts, and execution plans`,
      supportingSubjects: ['strategic growth roadmap', 'performance KPI charts', 'analytical tablet displays', 'strategy planning binder'],
      backgroundContext: 'Sunlit modern corporate executive suite with clean daylight and architectural glass',
      visualStory: `Focused business leaders collaborating in a sunlit executive room, analyzing strategic growth documents and performance graphs representing ${topic}.`,
      prohibitedMainSubjects: domainRule.prohibitedMainSubjects,
    };
  }
}
