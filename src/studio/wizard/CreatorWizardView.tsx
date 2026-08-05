'use client';

import React from 'react';
import { Wizard } from './components/Wizard';

interface CreatorWizardViewProps {
  onBack: () => void;
  onSelectTab?: (tab: string) => void;
}

export function CreatorWizardView({ onBack }: CreatorWizardViewProps) {
  return <Wizard onCancel={onBack} />;
}
