'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ModulePlaceholderView } from '../shared/ModulePlaceholderView';

export function ApprovalWorkflowView({ onBack }: { onBack: () => void }) {
  return (
    <ModulePlaceholderView
      title="Approval & Lifecycle Manager"
      description="7-state post lifecycle manager: Draft → Review → Approved → Locked → Scheduled → Published → Archived with lock protection."
      icon={CheckCircle2}
      phaseInfo="PHASE 6 MODULE"
      onBack={onBack}
    />
  );
}
