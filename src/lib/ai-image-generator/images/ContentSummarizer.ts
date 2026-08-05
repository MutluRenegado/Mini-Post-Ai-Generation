import { ContentVisualSummary } from './image.types';
import { Logger } from '../logging/Logger';

export interface SummarizeInput {
  finalText: string;
  textStatus?: 'draft' | 'validated' | 'approved';
  platform?: string;
  postType?: string;
  industry?: string;
}

export class ContentSummarizer {
  /**
   * Summarizes ONLY final approved post text into a structured visual summary.
   * Throws an error if finalText is empty, missing, or not approved.
   * Guarantees 100% fresh state isolation on every invocation.
   */
  static summarize(input: SummarizeInput): ContentVisualSummary {
    const status = input.textStatus || 'approved';
    const text = (input.finalText || '').trim();

    if (!text || status !== 'approved') {
      Logger.error('ContentSummarizer', 'summarization_rejected', {
        reason: !text ? 'EMPTY_FINAL_TEXT' : 'TEXT_NOT_APPROVED',
        status,
      });
      throw new Error(
        `IMAGE_PIPELINE_ERROR: Cannot summarize text for image generation. Text status must be "approved" and finalText must be non-empty (received status="${status}", textLength=${text.length}).`
      );
    }

    Logger.info('ContentSummarizer', 'summarizing_final_text', {
      textLength: text.length,
      platform: input.platform || 'generic',
    });

    return this.extractSummaryFromFinalText(text, input.platform, input.industry);
  }

  private static extractSummaryFromFinalText(
    text: string,
    platform?: string,
    industryOverride?: string
  ): ContentVisualSummary {
    const textLower = text.toLowerCase();

    // Specific Domain Detection (ordered by specificity to prevent generic overrides)
    let domain = 'business';
    let mainSubject = 'Professional business team reviewing strategic decisions and operations in a modern workspace';
    let environment = 'Sunlit architectural modern executive office suite';
    let location = 'Corporate strategy headquarters';
    let relevantPeople = ['Senior executive', 'Business strategy specialist'];
    let relevantObjects = ['Strategic decision framework', 'Business analytics display', 'Executive summary notes'];

    if (
      textLower.includes('e-commerce') ||
      textLower.includes('checkout') ||
      textLower.includes('refund policy') ||
      textLower.includes('buyer protection') ||
      textLower.includes('customer trust') ||
      textLower.includes('online shopper') ||
      textLower.includes('ssl security')
    ) {
      domain = 'e-commerce';
      mainSubject = 'Online shopper completing a secure payment transaction with visible SSL buyer protection badges and transparent refund terms';
      environment = 'Modern sunlit e-commerce checkout interface on a sleek digital device with clean purchasing environment';
      location = 'Digital commerce customer experience hub';
      relevantPeople = ['Online customer', 'Responsive e-commerce support specialist'];
      relevantObjects = ['Secure checkout interface', 'SSL security badge', 'Buyer protection seal', 'Digital receipt', 'Order confirmation analytics'];
    } else if (
      textLower.includes('offshore wind') ||
      textLower.includes('solar grid') ||
      textLower.includes('renewable energy') ||
      textLower.includes('photovoltaic') ||
      textLower.includes('wind farm') ||
      textLower.includes('clean energy') ||
      (textLower.includes('energy') && textLower.includes('investment'))
    ) {
      domain = 'renewable-energy';
      mainSubject = 'Utility-scale offshore wind turbines and solar photovoltaic grid infrastructure with institutional investment planning';
      environment = 'Vast sunny clean energy utility installation with offshore wind turbines and solar panel arrays under clear sky';
      location = 'Utility-scale renewable energy station';
      relevantPeople = ['Clean energy project director', 'Utility infrastructure engineer'];
      relevantObjects = ['Offshore wind turbines', 'Solar panel array grid', 'Utility power inverter substation', 'Renewable asset portfolio analytics tablet'];
    } else if (
      textLower.includes('zero-trust') ||
      textLower.includes('cybersecurity') ||
      textLower.includes('vulnerability scanning') ||
      textLower.includes('vulnerability patch') ||
      textLower.includes('firewall') ||
      textLower.includes('multi-factor authentication') ||
      textLower.includes('cloud security')
    ) {
      domain = 'cybersecurity';
      mainSubject = 'Cloud cybersecurity architecture with zero-trust network monitoring and automated vulnerability scanning dashboard';
      environment = 'Modern well-lit cybersecurity operations space with high-contrast network security analytics displays';
      location = 'Enterprise cyber defense security operations center';
      relevantPeople = ['Cybersecurity engineer', 'Cloud security architect'];
      relevantObjects = ['Zero-trust network topology diagram', 'Vulnerability patch status dashboard', 'Encrypted cloud microservice architecture tablet', 'Multi-factor security protocol display'];
    } else if (
      textLower.includes('international trade') ||
      textLower.includes('payment terms') ||
      textLower.includes('trade finance') ||
      textLower.includes('letter of credit') ||
      textLower.includes('documentary collection') ||
      textLower.includes('advance payment') ||
      textLower.includes('open account') ||
      textLower.includes('open-account') ||
      textLower.includes('trade credit') ||
      textLower.includes('incoterm') ||
      textLower.includes('cargo ship') ||
      textLower.includes('container port') ||
      textLower.includes('freight inspection') ||
      textLower.includes('shipping manifest') ||
      textLower.includes('export shipment') ||
      textLower.includes('exporter') ||
      textLower.includes('importer') ||
      textLower.includes('commercial risk')
    ) {
      domain = 'international-trade';
      mainSubject = 'International trade finance professionals and exporter/importer reviewing payment terms, letters of credit, and commercial risk documentation';
      environment = 'Modern daylight trade finance office with container port views and international contract displays';
      location = 'International trade finance operations center';
      relevantPeople = ['International trade finance director', 'Commercial exporter and importer', 'Trade risk analyst'];
      relevantObjects = ['Letter of credit trade contract', 'Documentary collection agreement', 'Advance payment and open account terms documentation', 'International trade risk matrix', 'Commercial invoice and bill of lading'];
    } else if (
      textLower.includes('cfo') ||
      textLower.includes('capital allocation') ||
      textLower.includes('cash flow') ||
      textLower.includes('investment portfolio') ||
      textLower.includes('yield guarantee') ||
      textLower.includes('banking')
    ) {
      domain = 'finance';
      mainSubject = 'Executive CFO and institutional portfolio managers analyzing capital allocation yields and cash flow models';
      environment = 'Sunlit financial district corporate suite with panoramic daylight exposure';
      location = 'Financial district asset management suite';
      relevantPeople = ['Executive CFO', 'Institutional investment manager'];
      relevantObjects = ['Capital allocation yield matrix', 'Investment portfolio dashboard', 'Cash flow forecast report'];
    } else if (
      textLower.includes('patient care') ||
      textLower.includes('clinical guideline') ||
      textLower.includes('hospital') ||
      textLower.includes('medical doctor') ||
      textLower.includes('diagnostic')
    ) {
      domain = 'healthcare';
      mainSubject = 'Medical directors and clinical specialists reviewing patient care guidelines and healthcare outcome metrics';
      environment = 'Clean, daylight-filled modern medical research facility office';
      location = 'Modern clinical research center';
      relevantPeople = ['Medical director', 'Senior clinical specialist'];
      relevantObjects = ['Clinical care guidelines', 'Patient diagnostic summary tablet', 'Healthcare outcome metrics report'];
    } else if (
      textLower.includes('software code') ||
      textLower.includes('developer workstation') ||
      textLower.includes('cloud microservices') ||
      textLower.includes('code scanning') ||
      textLower.includes('software architect')
    ) {
      domain = 'software-engineering';
      mainSubject = 'Software engineering architects inspecting microservice code pipelines and cloud system architecture';
      environment = 'Sunlit modern software engineering lab with dual-monitor developer workstations';
      location = 'Modern software engineering R&D center';
      relevantPeople = ['Principal software architect', 'Lead platform engineer'];
      relevantObjects = ['Cloud microservice architecture diagram', 'System latency dashboard', 'Code deployment pipeline monitor'];
    } else if (
      textLower.includes('leadership') ||
      textLower.includes('executive vision') ||
      textLower.includes('organizational agility')
    ) {
      domain = 'leadership';
      mainSubject = 'Executive leadership board reviewing strategic vision, team performance, and corporate alignment';
      environment = 'Daylit architectural executive boardroom with glass walls and strategic planning displays';
      location = 'Corporate executive headquarters';
      relevantPeople = ['Chief executive officer', 'Senior strategic leadership board'];
      relevantObjects = ['Strategic planning framework', 'Executive dashboard', 'Performance alignment notes'];
    }

    const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
    const coreMessage = sentences[0] || text.slice(0, 150);

    return {
      mainSubject,
      coreMessage,
      relevantPeople: [...relevantPeople],
      relevantObjects: [...relevantObjects],
      environment,
      location,
      timeOrLighting: 'Natural bright studio daylight with soft balanced fill lighting',
      mood: 'Confident, authoritative, vibrant, and strategic',
      audience: 'Professional decision makers, leaders, and modern creators',
      industry: industryOverride || domain,
      visualPriorities: [
        'Clear focal subject matching specific article domain',
        'Bright daylight illumination with vibrant high-contrast color accents',
        'Instant visual comprehension of article core message',
      ],
      prohibitedElements: [
        'dark empty office',
        'low-light control room',
        'generic corporate stock photo clichés',
        'desaturated grey palette',
        'meaningless computer monitors',
        'floating holograms',
        'unrelated random objects',
        'watermarks or logos',
        'distorted anatomy or awkward smiles',
      ],
    };
  }
}
