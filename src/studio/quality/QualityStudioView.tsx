'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ModulePlaceholderView } from '../shared/ModulePlaceholderView';

export function QualityStudioView({ onBack }: { onBack: () => void }) {
  return (
    <ModulePlaceholderView
      title="Quality & Standards Audit Engine"
      description="Real-time grammar, Flesch readability, hook strength, CTA impact, emoji ratio, brand voice alignment, and character limit auditor."
      icon={ShieldCheck}
      phaseInfo="PHASE 3 MODULE"
      onBack={onBack}
    />
  );
}
