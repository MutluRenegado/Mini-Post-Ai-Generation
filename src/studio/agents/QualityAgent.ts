import { BaseAgent, AgentContext } from './BaseAgent';
import { QualityAuditor } from '@/lib/ai-text-editor/validation/QualityAuditor';
import { Logger } from '@/lib/ai-text-editor/logging/Logger';

export class QualityAgent extends BaseAgent {
  name = 'QualityAgent';
  description = 'Audits quality, readability, authority and prompt leakage (Target >= 92)';

  async execute(context: AgentContext): Promise<any> {
    const start = Date.now();
    const body = context.payload?.body || context.topic;
    const platform = context.platforms[0] || 'LinkedIn';

    Logger.info('QualityAgent', `Auditing content quality for platform: ${platform}`);
    const auditReport = QualityAuditor.audit({}, body, platform);
    Logger.info('QualityAgent', `Quality score: ${auditReport.score}/100`, { passed: auditReport.passed }, undefined, Date.now() - start);
    return auditReport;
  }
}
