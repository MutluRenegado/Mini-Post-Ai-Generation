'use client';

import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

export function WorkspaceTabs() {
  const { modules, activeModule, openModule } = useWorkspace();
  const list = Object.values(modules);

  if (list.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-[#090C13] border-b border-[#1A1F2C] overflow-x-auto scrollbar-none">
      {list.map((m) => {
        const Icon = m.icon;
        const isActive = activeModule?.id === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => openModule(m.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded-t-lg text-xs font-semibold border-t border-x transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-[#07090E] border-[#1C2234] text-cyan-300'
                : 'bg-[#0A0D15] border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{m.name}</span>
          </button>
        );
      })}
    </div>
  );
}
