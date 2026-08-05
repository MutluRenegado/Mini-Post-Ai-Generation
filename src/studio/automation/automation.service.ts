import { AutomationRule } from '../types/studio.types';

export class AutomationManagerService {
  static getAutomationRules(): AutomationRule[] {
    return [
      {
        id: 'rule_weekly_digest',
        name: 'Weekly Tech Digest Auto-Gen',
        triggerType: 'schedule',
        cronExpression: '0 9 * * MON',
        targetPlatforms: ['linkedin', 'twitter'],
        status: 'active',
        lastRunAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        nextRunAt: new Date(Date.now() + 86400000 * 4).toISOString(),
      },
    ];
  }
}
