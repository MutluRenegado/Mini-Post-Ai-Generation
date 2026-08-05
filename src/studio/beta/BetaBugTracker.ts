export interface BetaBugIssue {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'verified';
  module: string;
  stepsToReproduce: string;
  resolution?: string;
  verifiedBy: string;
  updatedAt: string;
}

export class BetaBugTracker {
  private static issues: BetaBugIssue[] = [
    {
      id: 'BUG_5101',
      title: 'X/Twitter prompt exceeded 280 chars in heavy emoji mode',
      severity: 'high',
      status: 'verified',
      module: 'PlatformPromptBuilder',
      stepsToReproduce: 'Select Twitter (X) with Funny tone and heavy emoji policy',
      resolution: 'Enforced hard string truncation at 280 chars via OutputValidator.clampText',
      verifiedBy: 'Beta QA Suite',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'BUG_5102',
      title: 'Circuit breaker reset timeout state sync under high load',
      severity: 'medium',
      status: 'verified',
      module: 'CircuitBreaker',
      stepsToReproduce: 'Trigger 5 artificial provider failures in rapid succession',
      resolution: 'Added automatic timestamp check in canExecute() method',
      verifiedBy: 'Reliability Test Suite',
      updatedAt: new Date().toISOString(),
    },
  ];

  static getIssues(): BetaBugIssue[] {
    return [...this.issues];
  }

  static reportIssue(issue: Omit<BetaBugIssue, 'id' | 'updatedAt'>): BetaBugIssue {
    const newIssue: BetaBugIssue = {
      ...issue,
      id: `BUG_${Date.now().toString().slice(-4)}`,
      updatedAt: new Date().toISOString(),
    };
    this.issues.push(newIssue);
    return newIssue;
  }

  static resolveIssue(id: string, resolution: string): boolean {
    const issue = this.issues.find((i) => i.id === id);
    if (issue) {
      issue.status = 'verified';
      issue.resolution = resolution;
      issue.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
}
