'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { ModulePlaceholderView } from '../shared/ModulePlaceholderView';

export function PromptManagerView({ onBack }: { onBack: () => void }) {
  return (
    <ModulePlaceholderView
      title="AI Prompt Template Manager"
      description="Repository for decoupling AI system prompts from code, featuring prompt versioning, quality scoring, live sandbox testing, and execution logs."
      icon={Terminal}
      phaseInfo="PHASE 5 MODULE"
      onBack={onBack}
    />
  );
}
