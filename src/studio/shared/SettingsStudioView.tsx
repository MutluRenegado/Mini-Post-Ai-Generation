'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { ModulePlaceholderView } from './ModulePlaceholderView';

export function SettingsStudioView({ onBack }: { onBack: () => void }) {
  return (
    <ModulePlaceholderView
      title="Studio Settings & System Configuration"
      description="Manage API keys, AI model parameters, default brand profiles, team permission rules, notification webhooks, and timezone settings."
      icon={Settings}
      phaseInfo="FOUNDATION CONFIGURATION"
      onBack={onBack}
    />
  );
}
