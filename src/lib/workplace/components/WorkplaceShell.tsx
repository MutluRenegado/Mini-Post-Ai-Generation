'use client';

import React from 'react';
import { WorkplaceModuleConfig } from '../types/workplace.types';
import { WorkspaceProvider } from '../context/WorkspaceContext';
import { StudioAssistantProvider } from '@/studio/assistant/StudioAssistantContext';
import { WorkplaceLayout } from './WorkplaceLayout';

interface WorkplaceShellProps {
  initialModules?: WorkplaceModuleConfig[];
  defaultModuleId?: string;
  onReturnToLauncher?: () => void;
  brandTitle?: string;
}

export function WorkplaceShell({
  initialModules = [],
  defaultModuleId = '',
  onReturnToLauncher,
  brandTitle,
}: WorkplaceShellProps) {
  return (
    <WorkspaceProvider initialModules={initialModules} defaultModuleId={defaultModuleId}>
      <StudioAssistantProvider>
        <WorkplaceLayout onReturnToLauncher={onReturnToLauncher} brandTitle={brandTitle} />
      </StudioAssistantProvider>
    </WorkspaceProvider>
  );
}

