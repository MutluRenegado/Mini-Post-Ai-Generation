'use client';

import React from 'react';
import { useHelping } from '../context/HelpingContext';
import { HelpPlacement } from '../types/explain-item.types';

interface ExplainControlProps {
  helpId: string;
  label?: string;
  placement?: HelpPlacement;
  className?: string;
}

export function ExplainControl({
  helpId,
  label = 'Explain this item',
  className = '',
}: ExplainControlProps) {
  const { activeHelpId, openHelp, closeHelp } = useHelping();
  const isOpen = activeHelpId === helpId;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) {
      closeHelp();
    } else {
      openHelp(helpId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-controls={`explain-box-${helpId}`}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono font-black text-[11px] leading-none transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer shadow-sm hover:scale-105 shrink-0 select-none ${className}`}
    >
      E
    </button>
  );
}
