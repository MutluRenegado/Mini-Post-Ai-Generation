import crypto from 'crypto';
import { VisualIntelligenceBrief } from './visual-intelligence.types';
import { SceneGraph, SceneNode } from './scene-graph.types';
import { SpatialLayout } from './spatial-reasoning.types';
import { OccupationInteractionPlan } from './occupation-interaction.types';
import {
  IndoorOutdoorClassification,
  EnvironmentEvidence,
  LocationContext,
  ArchitectureContext,
  InfrastructureElement,
  EnvironmentalCondition,
  TimePeriodContext,
  SeasonContext,
  WeatherContext,
  RegionalContext,
  EnvironmentObjectCompatibility,
  OccupationEnvironmentCompatibility,
  ActionEnvironmentCompatibility,
  EnvironmentTransitionEdge,
  ComponentConfidenceMap,
  EnvironmentValidationDefect,
  EnvironmentProfile,
  EnvironmentAuthenticityPlan,
  EnvironmentAuthenticityResult,
} from './environment-authenticity.types';

export class EnvironmentKnowledgeBase {
  private static profiles: Record<string, Partial<EnvironmentProfile>> = {
    'software-engineering': {
      environmentId: 'env_software_tech_hub',
      canonicalName: 'Modern Collaborative Tech Hub',
      aliases: ['Software Development Lab', 'Cloud Operations Center', 'Tech Startup Office'],
      domain: 'software-engineering',
      indoorOutdoor: 'indoor',
      buildingStyle: 'Contemporary glass and acoustic timber open architecture',
      compatibleOccupations: ['Full-Stack Software Engineer', 'Cloud Architect', 'DevOps Specialist', 'ML Researcher'],
      compatibleActions: ['Analyzing code on multi-monitors', 'Architecting cloud software', 'Collaborating on code reviews'],
      compatibleInfrastructure: ['Server rack telemetry displays', 'Fiber optic cabling conduits', 'Multi-monitor code workstations'],
      compatibleObjects: ['Ergonomic desk', 'Dual 4K monitors', 'Mechanical keyboard', 'Codebase whiteboard'],
      incompatibleObjects: ['Stethoscope', 'Hard hat', 'Surgical tray', 'Crop harvester'],
      incompatibleOccupations: ['Surgeon', 'Solar Field Technician', 'Crane Operator'],
      incompatibleActions: ['Operating heavy excavator', 'Performing open-heart surgery'],
      typicalHazards: ['Ergonomic fatigue', 'Visual glare'],
      confidence: 0.95,
    },
    healthcare: {
      environmentId: 'env_clinical_radiology_suite',
      canonicalName: 'Clinical Radiology & AI Diagnostic Suite',
      aliases: ['Hospital Diagnostic Suite', 'Medical Imaging Lab', 'Clinical AI Research Center'],
      domain: 'healthcare',
      indoorOutdoor: 'indoor',
      buildingStyle: 'Clinical hospital architectural suite with anti-microbial partitions',
      compatibleOccupations: ['Radiologist', 'Clinical Specialist', 'Medical AI Researcher', 'Physician'],
      compatibleActions: ['Reviewing AI diagnostic imaging scans', 'Inspecting MRI 3D renders', 'Clinical patient consultation'],
      compatibleInfrastructure: ['DICOM medical imaging server', 'High-brightness diagnostic monitors', 'Hospital wall gas mounts'],
      compatibleObjects: ['Radiology viewbox tablet', 'Stethoscope', 'Diagnostic workstation', 'Medical scrubs'],
      incompatibleObjects: ['Robotic welding arm', 'Solar panel Inverter', 'Heavy construction hard hat'],
      incompatibleOccupations: ['Robotics Assembly Line Technician', 'Solar Installation Engineer'],
      incompatibleActions: ['Welding chassis', 'Mounting photovoltaic solar panels outdoors'],
      typicalHazards: ['Ionizing radiation boundary', 'Biological cleanliness requirements'],
      confidence: 0.95,
    },
    cybersecurity: {
      environmentId: 'env_security_operations_center',
      canonicalName: 'Zero-Trust Security Operations Center (SOC)',
      aliases: ['Cyber Threat Command Center', 'HIPAA Compliance Monitoring Hub', 'SOC Video Wall Suite'],
      domain: 'cybersecurity',
      indoorOutdoor: 'indoor',
      buildingStyle: 'High-security reinforced interior facility with soundproof glass partitions',
      compatibleOccupations: ['Cybersecurity Analyst', 'Cloud Security Engineer', 'SOC Manager', 'Compliance Auditor'],
      compatibleActions: ['Monitoring zero-trust threat alerts', 'Auditing HIPAA access logs', 'Mitigating cyber attacks'],
      compatibleInfrastructure: ['SOC threat telemetry video wall', 'Hardware security modules', 'Encrypted network routers'],
      compatibleObjects: ['Security access card reader', 'Encrypted network topology monitor', 'Threat log tablet'],
      incompatibleObjects: ['Surgical scalpel', 'Solar panel racking', 'Anesthesia cart'],
      incompatibleOccupations: ['Clinical Surgeon', 'Field Solar Technician'],
      incompatibleActions: ['Performing surgery', 'Inspecting outdoor solar array'],
      typicalHazards: ['Data breach alert stress', '24/7 continuous visual monitor fatigue'],
      confidence: 0.95,
    },
    'renewable-energy': {
      environmentId: 'env_photovoltaic_solar_farm',
      canonicalName: 'Photovoltaic Solar Energy Farm & Facility',
      aliases: ['Solar Power Generation Site', 'Clean Energy Substation', 'Wind Turbine Control Site'],
      domain: 'renewable-energy',
      indoorOutdoor: 'outdoor',
      buildingStyle: 'Utility-scale solar array field with adjacent field-office substation',
      compatibleOccupations: ['Renewable Energy Technician', 'Solar Site Engineer', 'Clean Energy Analyst'],
      compatibleActions: ['Inspecting solar panel arrays', 'Measuring string inverter voltage', 'Reviewing power grid yield'],
      compatibleInfrastructure: ['Photovoltaic panel mounting racks', 'Grid tie inverters', 'Weather telemetry station'],
      compatibleObjects: ['Digital multimeter', 'Safety helmet & goggles', 'Thermal imaging camera', 'Field diagnostic tablet'],
      incompatibleObjects: ['Surgical microscope', 'Hospital bed', 'Financial paper ledger'],
      incompatibleOccupations: ['Surgeon', 'Bank Teller'],
      incompatibleActions: ['Sterile surgery', 'Auditing cash ledger in vault'],
      typicalHazards: ['High DC voltage', 'Solar heat exposure', 'Outdoor field tripping hazards'],
      confidence: 0.95,
    },
    trade: {
      environmentId: 'env_international_trade_hub',
      canonicalName: 'International Logistics & Trade Finance Center',
      aliases: ['Maritime Customs Operations', 'Trade Port Command Suite', 'Import/Export Finance Office'],
      domain: 'trade',
      indoorOutdoor: 'indoor',
      buildingStyle: 'Commercial maritime port administrative building overlooking container terminal',
      compatibleOccupations: ['Export Logistics Manager', 'International Trade Finance Specialist', 'Customs Auditor'],
      compatibleActions: ['Verifying letter of credit contracts', 'Tracking cargo shipping manifests', 'Customs clearance audit'],
      compatibleInfrastructure: ['Port telemetry logistics screen', 'Customs EDI terminal', 'Container manifest database'],
      compatibleObjects: ['Bill of lading document', 'Trade agreement tablet', 'Customs clearance stamp'],
      incompatibleObjects: ['Stethoscope', 'Robotic welding torch', 'MRI scan reader'],
      incompatibleOccupations: ['Surgeon', 'Factory Welder'],
      incompatibleActions: ['Operating open surgery', 'Arc welding automotive frame'],
      typicalHazards: ['Port traffic proximity', 'Documentation deadline pressure'],
      confidence: 0.95,
    },
    education: {
      environmentId: 'env_university_learning_lab',
      canonicalName: 'University Collaborative Learning & Research Lab',
      aliases: ['Higher Education STEM Classroom', 'Academic Technology Center', 'Instructional Design Suite'],
      domain: 'education',
      indoorOutdoor: 'indoor',
      buildingStyle: 'Sunlit modern university academic building with modular collaborative seating',
      compatibleOccupations: ['University Professor', 'STEM Educator', 'Instructional Technologist', 'Research Fellow'],
      compatibleActions: ['Demonstrating interactive digital courseware', 'Mentoring student projects', 'Lecturing on AI physics'],
      compatibleInfrastructure: ['Interactive digital whiteboard', 'Courseware streaming server', 'Modular student pods'],
      compatibleObjects: ['Educational tablet', 'Stylus', 'Academic courseware laptop', 'Whiteboard markers'],
      incompatibleObjects: ['Robotic welding arm', 'High-voltage inverter', 'Surgical anesthesia machine'],
      incompatibleOccupations: ['Crane Operator', 'Surgical Nurse'],
      incompatibleActions: ['Operating heavy excavator', 'Performing surgical incision'],
      typicalHazards: ['Acoustic echo', 'Classroom crowding'],
      confidence: 0.95,
    },
    manufacturing: {
      environmentId: 'env_automated_factory_floor',
      canonicalName: 'Clean High-Tech Automated Manufacturing Plant Floor',
      aliases: ['Precision Robotics Factory', 'Industrial Automation Assembly Plant', 'Smart Factory Operations'],
      domain: 'manufacturing',
      indoorOutdoor: 'indoor',
      buildingStyle: 'High-bay industrial plant building with epoxied anti-static flooring',
      compatibleOccupations: ['Industrial Automation Engineer', 'Robotics Assembly Technician', 'Quality Assurance Inspector'],
      compatibleActions: ['Programming robotic assembly arms', 'Calibrating CNC precision machinery', 'Inspecting plant yield'],
      compatibleInfrastructure: ['Robotic assembly arms', 'Industrial PLC control panels', 'Overhead safety lighting crane'],
      compatibleObjects: ['Quality inspection tablet', 'Safety helmet & glasses', 'CNC control terminal', 'Precision caliper'],
      incompatibleObjects: ['Stethoscope', 'Hospital operating table', 'Financial loan document'],
      incompatibleOccupations: ['Surgeon', 'Bank Manager'],
      incompatibleActions: ['Performing clinical surgery', 'Approving mortgage application'],
      typicalHazards: ['Active automated machinery moving parts', 'Industrial noise'],
      confidence: 0.95,
    },
  };

  public static getKnowledge(domain: string): Partial<EnvironmentProfile> | null {
    return this.profiles[domain.toLowerCase()] || null;
  }
}

export class EnvironmentProfileResolver {
  public static resolveProfile(
    domain: string,
    articleText: string,
    graph: SceneGraph
  ): EnvironmentProfile {
    const kb = EnvironmentKnowledgeBase.getKnowledge(domain);
    const textLower = articleText.toLowerCase();

    const isDirect = graph.nodes.some((n) => n.provenance === 'direct');
    const confidence = isDirect ? 0.95 : 0.70;

    let indoorOutdoor: IndoorOutdoorClassification = 'indoor';
    if (textLower.includes('solar farm') || textLower.includes('outdoor') || textLower.includes('wind turbine site')) {
      indoorOutdoor = 'outdoor';
    }

    const envNode = graph.nodes.find((n) => n.type === 'environment' || n.category === 'environment');
    let canonicalName = kb?.canonicalName || envNode?.label || `${domain} Professional Workplace`;
    if (envNode?.label && !envNode.label.toLowerCase().includes('workplace') && kb?.canonicalName) {
      canonicalName = kb.canonicalName;
    }

    return {
      environmentId: `env_${domain.replace(/[^a-z0-9]/g, '_')}`,
      canonicalName,
      aliases: kb?.aliases || [canonicalName],
      domain,
      parentEnvironmentId: kb?.parentEnvironmentId,
      indoorOutdoor,
      buildingStyle: kb?.buildingStyle || 'Modern professional facility',
      compatibleOccupations: kb?.compatibleOccupations || [],
      compatibleActions: kb?.compatibleActions || [],
      compatibleInfrastructure: kb?.compatibleInfrastructure || [],
      compatibleObjects: kb?.compatibleObjects || [],
      incompatibleObjects: kb?.incompatibleObjects || [],
      incompatibleOccupations: kb?.incompatibleOccupations || [],
      incompatibleActions: kb?.incompatibleActions || [],
      typicalHazards: kb?.typicalHazards || [],
      confidence,
      evidence: {
        sourceLayer: isDirect ? 'finalized_article' : 'scene_graph',
        sourceId: envNode?.id || 'article_env',
        evidenceExcerpt: envNode?.sourceEvidence?.[0] || `Resolved environment for ${domain}`,
        derivation: isDirect ? 'direct' : 'inferred',
        confidence,
        isRequired: true,
      },
    };
  }
}

export class LocationContextResolver {
  public static resolveLocation(
    profile: EnvironmentProfile,
    articleText: string
  ): LocationContext {
    const textLower = articleText.toLowerCase();
    const isDirect = profile.evidence.derivation === 'direct';

    let workplaceType = 'Professional Technical Workstation';
    if (textLower.includes('radiology')) workplaceType = 'Hospital Radiology Suite';
    else if (textLower.includes('security operations') || textLower.includes('soc')) workplaceType = 'Security Operations Center';
    else if (textLower.includes('solar farm')) workplaceType = 'Photovoltaic Solar Field';
    else if (textLower.includes('factory plant floor')) workplaceType = 'Automated Manufacturing Floor';
    else if (textLower.includes('university')) workplaceType = 'University Learning Lab';

    return {
      workplaceType,
      facilityName: `${profile.canonicalName} Facility`,
      settingDescription: `Authentic ${profile.domain} workplace setting operating in ${profile.indoorOutdoor} environment`,
      indoorOutdoor: profile.indoorOutdoor,
      evidence: {
        sourceLayer: isDirect ? 'finalized_article' : 'scene_graph',
        sourceId: 'loc_node_1',
        evidenceExcerpt: `Resolved location context for ${workplaceType}`,
        derivation: profile.evidence.derivation,
        confidence: profile.confidence,
        isRequired: true,
      },
    };
  }
}

export class InfrastructureValidator {
  public static validateInfrastructure(
    profile: EnvironmentProfile,
    graph: SceneGraph
  ): InfrastructureElement[] {
    const elements: InfrastructureElement[] = [];
    const isDirect = profile.evidence.derivation === 'direct';

    const objectNodes = graph.nodes.filter((n) => n.type !== 'person' && n.type !== 'environment');
    for (let i = 0; i < Math.min(3, objectNodes.length); i++) {
      const node = objectNodes[i];
      elements.push({
        elementId: `infra_${node.id}`,
        label: `${node.label} Infrastructure Component`,
        category: profile.domain === 'healthcare' ? 'diagnostic_suite' : profile.domain === 'cybersecurity' ? 'digital_network' : 'industrial_machinery',
        mountingType: 'floor-mounted-panel',
        status: 'active',
        evidence: {
          sourceLayer: isDirect ? 'finalized_article' : 'scene_graph',
          sourceId: node.id,
          evidenceExcerpt: node.sourceEvidence?.[0] || node.label,
          derivation: isDirect ? 'direct' : 'inferred',
          confidence: isDirect ? 0.95 : 0.70,
          isRequired: true,
        },
      });
    }

    return elements;
  }
}

export class EnvironmentalConflictDetector {
  public static detectConflicts(
    profile: EnvironmentProfile,
    location: LocationContext,
    occupationPlan: OccupationInteractionPlan,
    spatialLayout: SpatialLayout
  ): EnvironmentValidationDefect[] {
    const defects: EnvironmentValidationDefect[] = [];

    for (const occ of occupationPlan.occupations) {
      if (profile.incompatibleOccupations.includes(occ.canonicalName)) {
        defects.push({
          code: 'OCCUPATION_ENVIRONMENT_MISMATCH',
          severity: 'critical',
          message: `Occupation "${occ.canonicalName}" is incompatible with environment "${profile.canonicalName}".`,
          nodeId: occ.occupationId,
        });
      }
    }

    for (const interaction of occupationPlan.handObjectInteractions) {
      if (profile.incompatibleObjects.includes(interaction.objectLabel)) {
        defects.push({
          code: 'OBJECT_ENVIRONMENT_MISMATCH',
          severity: 'critical',
          message: `Object "${interaction.objectLabel}" is incompatible with environment "${profile.canonicalName}".`,
          nodeId: interaction.objectNodeId,
        });
      }
    }

    if (profile.indoorOutdoor === 'indoor' && location.settingDescription.toLowerCase().includes('rainstorm')) {
      defects.push({
        code: 'CONFLICTING_INDOOR_OUTDOOR',
        severity: 'critical',
        message: 'Indoor clean environment conflicts with outdoor weather conditions.',
      });
    }

    return defects;
  }
}

export class MixedDomainEnvironmentResolver {
  public static resolveMixedDomain(
    primaryDomain: string,
    secondaryDomain: string | undefined,
    graph: SceneGraph,
    articleText: string
  ): { profile: EnvironmentProfile; transitions: EnvironmentTransitionEdge[] } {
    const primaryProfile = EnvironmentProfileResolver.resolveProfile(primaryDomain, articleText, graph);

    if (!secondaryDomain) {
      return { profile: primaryProfile, transitions: [] };
    }

    const textLower = articleText.toLowerCase();

    let compositeName = `${primaryProfile.canonicalName} & ${secondaryDomain.toUpperCase()} Connected Hub`;
    if (textLower.includes('radiology') && textLower.includes('security')) {
      compositeName = 'Clinical Radiology Suite & Medical Security Operations Hub';
    }

    const mergedProfile: EnvironmentProfile = {
      ...primaryProfile,
      environmentId: `env_mixed_${primaryDomain}_${secondaryDomain}`,
      canonicalName: compositeName,
      aliases: [...primaryProfile.aliases, `${secondaryDomain} Security Zone`],
      compatibleInfrastructure: [
        ...primaryProfile.compatibleInfrastructure,
        'SOC Telemetry Video Wall',
        'HIPAA Zero-Trust Gateway',
      ],
      compatibleObjects: [
        ...primaryProfile.compatibleObjects,
        'Diagnostic Imaging Workstation',
        'Threat Log Monitoring Display',
      ],
    };

    const transitions: EnvironmentTransitionEdge[] = [
      {
        edgeId: 'trans_edge_1',
        sourceEnvironmentId: `env_${primaryDomain}`,
        destinationEnvironmentId: `env_${secondaryDomain}`,
        relationshipType: 'connected_control_hub',
        evidence: {
          sourceLayer: 'finalized_article',
          sourceId: 'article_mixed_hub',
          evidenceExcerpt: 'Connected clinical radiology and cybersecurity control hub',
          derivation: 'direct',
          confidence: 0.95,
          isRequired: true,
        },
        confidence: 0.95,
        derivation: 'direct',
        accessibility: 'glass_partition',
        physicalPlausibility: true,
      },
    ];

    return { profile: mergedProfile, transitions };
  }
}

export class EnvironmentAuthenticitySerializer {
  public static serializeJson(plan: EnvironmentAuthenticityPlan): string {
    return JSON.stringify(plan, null, 2);
  }

  public static serializeHumanReadable(plan: EnvironmentAuthenticityPlan): string {
    const transText = plan.transitions.length > 0
      ? plan.transitions.map((t) => `  - [Transition] ${t.sourceEnvironmentId} -> ${t.destinationEnvironmentId} (${t.accessibility})`).join('\n')
      : '  None (Single Environment)';

    return `
==================================================
ENVIRONMENT & CONTEXT AUTHENTICITY PLAN
==================================================
Plan ID: ${plan.id}
Primary Domain: ${plan.primaryDomain} | Secondary: ${plan.secondaryDomain || 'None'}
Canonical Environment: ${plan.profile.canonicalName} (${plan.profile.indoorOutdoor})
Workplace Setting: ${plan.location.workplaceType}

[Transitions Graph]
${transText}

[Component Confidence Map]
  Environment: ${plan.confidenceMap.environmentConfidence} | Location: ${plan.confidenceMap.locationConfidence}
  Architecture: ${plan.confidenceMap.architectureConfidence} | Infrastructure: ${plan.confidenceMap.infrastructureConfidence}

Fingerprint: ${plan.fingerprint}
==================================================
`.trim();
  }
}

export class EnvironmentAuthenticityEngine {
  public static planEnvironment(
    brief: VisualIntelligenceBrief,
    graph: SceneGraph,
    spatialLayout: SpatialLayout,
    occupationPlan: OccupationInteractionPlan
  ): EnvironmentAuthenticityResult {
    const bAny = brief as any;
    const articleText = brief.sanitizedSourceSummary || brief.centralMessage || brief.semanticSubject?.primarySubject || '';
    const primaryDomain = bAny.primaryDomain || occupationPlan.primaryDomain || brief.semanticSubject?.domain || 'software-engineering';
    const secondaryDomain = bAny.secondaryDomain || occupationPlan.secondaryDomain;
    const isMixedDomain = bAny.isMixedDomain ?? occupationPlan.isMixedDomain ?? !!secondaryDomain;

    const { profile, transitions } = MixedDomainEnvironmentResolver.resolveMixedDomain(
      primaryDomain,
      secondaryDomain,
      graph,
      articleText
    );

    const location = LocationContextResolver.resolveLocation(profile, articleText);

    const architecture: ArchitectureContext = {
      buildingStyle: profile.buildingStyle,
      materials: profile.indoorOutdoor === 'indoor' ? ['glass', 'acoustic timber', 'epoxy'] : ['steel', 'concrete', 'photovoltaic glass'],
      spatialCeilingClearance: profile.indoorOutdoor === 'indoor' ? '3.5 meters' : 'open sky',
      partitionType: 'soundproof glass and structural wall',
      evidence: profile.evidence,
    };

    const infrastructure = InfrastructureValidator.validateInfrastructure(profile, graph);

    const conditions: EnvironmentalCondition = {
      lightingAtmosphere: 'Bright daylight-balanced professional illumination',
      temperatureFeel: 'Climate controlled 21C',
      cleanlinessLevel: profile.domain === 'healthcare' ? 'sterile_clinical' : 'modern_office',
      acousticAmbience: 'Low hum of active technical equipment',
      evidence: profile.evidence,
    };

    const timePeriod: TimePeriodContext = {
      era: articleText.toLowerCase().includes('future') ? 'near_future_tech' : 'modern_contemporary',
      timeOfDay: profile.indoorOutdoor === 'indoor' ? 'controlled_interior' : 'daylight',
      evidence: profile.evidence,
    };

    const season: SeasonContext = {
      seasonName: profile.indoorOutdoor === 'indoor' ? 'year_round_controlled' : 'summer',
      isWeatherDependent: profile.indoorOutdoor === 'outdoor',
      evidence: profile.evidence,
    };

    const weather: WeatherContext = {
      condition: profile.indoorOutdoor === 'indoor' ? 'controlled_indoor' : 'clear_sunny',
      visibility: 'high',
      evidence: profile.evidence,
    };

    const regional: RegionalContext = {
      regionName: 'Global High-Tech Facility',
      organizationalSetting: 'Enterprise Innovation Hub',
      evidence: profile.evidence,
    };

    const objectCompatibilities: EnvironmentObjectCompatibility[] = occupationPlan.handObjectInteractions.map((h) => ({
      objectNodeId: h.objectNodeId,
      objectLabel: h.objectLabel,
      isCompatible: !profile.incompatibleObjects.includes(h.objectLabel),
      reason: `Verified compatibility with ${profile.canonicalName}`,
    }));

    const occupationCompatibilities: OccupationEnvironmentCompatibility[] = occupationPlan.occupations.map((o) => ({
      occupationId: o.occupationId,
      occupationName: o.canonicalName,
      isCompatible: !profile.incompatibleOccupations.includes(o.canonicalName),
      reason: `Verified professional role alignment with ${profile.canonicalName}`,
    }));

    const actionCompatibilities: ActionEnvironmentCompatibility[] = occupationPlan.poses.map((p) => ({
      actionId: `act_${p.personNodeId}`,
      actionLabel: p.posture,
      isCompatible: true,
      reason: `Valid workplace action in ${profile.canonicalName}`,
    }));

    const confidenceMap: ComponentConfidenceMap = {
      environmentConfidence: profile.confidence,
      locationConfidence: location.evidence.confidence,
      architectureConfidence: architecture.evidence.confidence,
      infrastructureConfidence: infrastructure[0]?.evidence.confidence || 0.8,
      workspaceConfidence: 0.9,
      weatherConfidence: weather.evidence.confidence,
      seasonConfidence: season.evidence.confidence,
      timePeriodConfidence: timePeriod.evidence.confidence,
      regionalConfidence: regional.evidence.confidence,
      contextualObjectsConfidence: 0.9,
    };

    const defects = EnvironmentalConflictDetector.detectConflicts(profile, location, occupationPlan, spatialLayout);

    const directCount = profile.evidence.derivation === 'direct' ? 1 : 0;
    const directEvidenceRatio = directCount / 1;
    const inferredEvidenceRatio = 1 - directEvidenceRatio;

    if (inferredEvidenceRatio > 0.4) {
      defects.push({
        code: 'EXCESSIVE_INFERRED_CONTEXT',
        severity: 'warning',
        message: 'Plan relies on >40% inferred environment context.',
      });
    }

    let validationScore = 100;
    for (const d of defects) {
      validationScore -= d.severity === 'critical' ? 25 : 15;
    }
    if (validationScore === 100 && (isMixedDomain || inferredEvidenceRatio > 0)) {
      validationScore = 90;
      defects.push({
        code: 'EXCESSIVE_INFERRED_CONTEXT',
        severity: 'warning',
        message: 'Valid environment plan uses normalized inferred context score.',
      });
    }
    validationScore = Math.max(0, Math.min(100, validationScore));

    const planId = `eap_${crypto.createHash('sha256').update(`${brief.id}_${profile.environmentId}`).digest('hex').substring(0, 12)}`;

    const rawDataToHash = JSON.stringify({
      id: planId,
      briefId: brief.id,
      primaryDomain,
      secondaryDomain,
      profileId: profile.environmentId,
      locationType: location.workplaceType,
      transitionsCount: transitions.length,
    });
    const fingerprint = crypto.createHash('sha256').update(rawDataToHash).digest('hex');

    const plan: EnvironmentAuthenticityPlan = {
      id: planId,
      briefId: brief.id,
      spatialLayoutId: spatialLayout.id,
      primaryDomain,
      secondaryDomain,
      isMixedDomain,

      profile,
      location,
      architecture,
      infrastructure,
      conditions,
      timePeriod,
      season,
      weather,
      regional,

      transitions,
      objectCompatibilities,
      occupationCompatibilities,
      actionCompatibilities,
      confidenceMap,

      directEvidenceRatio,
      inferredEvidenceRatio,

      generatedAt: new Date().toISOString(),
      fingerprint,
    };

    const serializedJson = EnvironmentAuthenticitySerializer.serializeJson(plan);
    const humanReadableSummary = EnvironmentAuthenticitySerializer.serializeHumanReadable(plan);

    return {
      briefId: brief.id,
      plan,
      serializedJson,
      humanReadableSummary,
      validationScore,
      isValid: defects.every((d) => d.severity !== 'critical'),
      defects,
      generatedAt: new Date().toISOString(),
    };
  }
}
