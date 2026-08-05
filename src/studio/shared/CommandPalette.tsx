import React, { useState, useEffect } from 'react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'create_post', label: '🚀 Create New Post Workflow', category: 'Actions' },
    { id: 'view_inspector', label: '🔍 Open Pipeline Inspector', category: 'Developer' },
    { id: 'open_debug', label: '🐛 Open Studio Debug Console', category: 'Developer' },
    { id: 'view_analytics', label: '📊 View Analytics Dashboard', category: 'Navigation' },
    { id: 'manage_brand', label: '🎨 Manage Brand Assets', category: 'Settings' },
    { id: 'open_knowledge', label: '🧠 Open Knowledge Studio', category: 'Navigation' },
  ].filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-sans">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <span className="text-cyan-400 font-bold text-sm">Cmd+K</span>
          <input
            type="text"
            autoFocus
            placeholder="Search commands, projects, prompts, or workflows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-sans"
          />
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {actions.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                onSelectAction(act.id);
                onClose();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 text-xs flex justify-between items-center transition-all cursor-pointer"
            >
              <span>{act.label}</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">{act.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
