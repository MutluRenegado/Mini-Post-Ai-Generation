export interface PolicyRule {
  id: string;
  name: string;
  type: 'security' | 'brand' | 'compliance' | 'publishing';
  enforcement: 'strict_block' | 'approval_required' | 'warn_only';
  status: 'active' | 'disabled';
}

export class EnterprisePolicyEngine {
  private static policies: PolicyRule[] = [
    {
      id: 'pol_1001',
      name: 'Prompt Injection Defense Policy',
      type: 'security',
      enforcement: 'strict_block',
      status: 'active',
    },
    {
      id: 'pol_1002',
      name: 'Human Approval for Enterprise Publishing',
      type: 'publishing',
      enforcement: 'approval_required',
      status: 'active',
    },
  ];

  static listPolicies(): PolicyRule[] {
    return [...this.policies];
  }

  static evaluateContent(text: string): { compliant: boolean; triggeredPolicies: string[] } {
    const triggered: string[] = [];
    if (text.toLowerCase().includes('ignore all previous instructions')) {
      triggered.push('pol_1001');
    }
    return {
      compliant: triggered.length === 0,
      triggeredPolicies: triggered,
    };
  }
}
