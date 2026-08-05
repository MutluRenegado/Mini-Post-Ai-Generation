'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { ModulePlaceholderView } from '../shared/ModulePlaceholderView';

export function AutomationStudioView({ onBack }: { onBack: () => void }) {
  return (
    <ModulePlaceholderView
      title="Automation & Campaign Workflows"
      description="Automated posting schedules, weekly post generation sequences, campaign automation rules, and auto-publishing triggers."
      icon={Cpu}
      phaseInfo="FOUNDATION EXTENSION MODULE"
      onBack={onBack}
    />
  );
}
