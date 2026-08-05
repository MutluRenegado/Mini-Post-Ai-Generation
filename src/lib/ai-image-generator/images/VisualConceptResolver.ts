/**
 * VisualConceptResolver
 * Resolves abstract business, legal, financial, or technical concepts into concrete, real-world visual scenes.
 * Specifically prevents literal text/letter rendering (e.g. "Letter of Credit" becoming a giant letter 'L' or 'C').
 */

export interface VisualSceneResolution {
  centralSubject: string;
  realWorldScenario: string;
  setting: string;
  peopleOrRoles: string[];
  keyObjects: string[];
  prohibitedElements: string[];
  avoidTextArtifacts: boolean;
}

export class VisualConceptResolver {
  /**
   * Resolves abstract topics and text content into concrete real-world visual scenes.
   */
  static resolveConcept(text: string, title?: string): VisualSceneResolution {
    const combined = `${title || ''} ${text}`.toLowerCase();

    // Regression Case: Letter of Credit & Trade Finance
    if (
      combined.includes('letter of credit') ||
      combined.includes('incoterm') ||
      combined.includes('trade finance') ||
      combined.includes('export shipment')
    ) {
      return {
        centralSubject: 'International commercial trade agreement and shipping documentation review',
        realWorldScenario: 'An international buyer, exporter, and trade finance banking specialist in a daylight-filled executive meeting room reviewing trade agreements, with ocean container ships and port cranes visible through the panoramic window',
        setting: 'Sunlit modern port authority or trade bank executive office overlooking maritime container terminal',
        peopleOrRoles: ['International Buyer', 'Exporter', 'Trade Finance Specialist'],
        keyObjects: ['Trade agreement document', 'Cargo container manifest', 'Tablet displaying global logistics map', 'Port container vessels outside window'],
        prohibitedElements: [
          'isolated letter L or C',
          'large floating alphabet letters',
          'gibberish text on paper',
          'abstract banking graphics',
          'watermark',
          'logo',
        ],
        avoidTextArtifacts: true,
      };
    }

    // Zero-Trust & Cybersecurity
    if (
      combined.includes('zero-trust') ||
      combined.includes('cybersecurity') ||
      combined.includes('vulnerability')
    ) {
      return {
        centralSubject: 'Enterprise cloud security architecture monitoring',
        realWorldScenario: 'Lead cybersecurity architects reviewing live network topology and zero-trust security status in a bright, modern security operations lab',
        setting: 'Modern daylit cybersecurity operations center with high-contrast network topology monitors',
        peopleOrRoles: ['Lead Security Architect', 'Cloud Infrastructure Specialist'],
        keyObjects: ['Network topology display', 'Encrypted cloud microservice architecture diagram', 'Security compliance tablet'],
        prohibitedElements: ['floating holograms', 'digital matrix green rain', 'padlocks floating in air', 'random letters', 'text overlay'],
        avoidTextArtifacts: true,
      };
    }

    // Capital Allocation & CFO Finance
    if (
      combined.includes('capital allocation') ||
      combined.includes('cfo') ||
      combined.includes('cash flow') ||
      combined.includes('investment portfolio')
    ) {
      return {
        centralSubject: 'Executive financial strategy and portfolio capital allocation planning',
        realWorldScenario: 'Chief Financial Officer and institutional investment board analyzing portfolio growth metrics and asset allocation models',
        setting: 'High-floor sunlit financial district corporate suite with city skyline view',
        peopleOrRoles: ['Chief Financial Officer', 'Institutional Portfolio Manager'],
        keyObjects: ['Capital allocation chart tablet', 'Portfolio performance summary', 'Executive meeting tablet'],
        prohibitedElements: ['dollar signs floating in air', 'gold coins falling', 'abstract stock chart arrows', 'readable text'],
        avoidTextArtifacts: true,
      };
    }

    // Default Concrete Scene Resolution
    return {
      centralSubject: 'Executive leadership team collaborating on strategic growth roadmap',
      realWorldScenario: 'Diverse business leaders in a daylight-filled architectural conference space discussing strategic priorities',
      setting: 'Modern architectural executive boardroom with natural sunlight',
      peopleOrRoles: ['Chief Executive Officer', 'Strategy Director', 'Lead Operations Specialist'],
      keyObjects: ['Strategic roadmap tablet', 'Performance analytics summary', 'Digital planning board'],
      prohibitedElements: ['isolated letters', 'readable text', 'watermarks', 'logos', 'gibberish typography'],
      avoidTextArtifacts: true,
    };
  }
}
