import React, { useState } from 'react';

export const PromptStudioView: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState('MasterPromptBuilder v3.0');

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📝 Prompt Studio & Versioning System
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage, test, version, and rollback multi-platform AI prompts</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow transition-all">
          + Create New Prompt Version
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="space-y-3 col-span-1">
          {['MasterPromptBuilder v3.0', 'LinkedIn Executive v2.4', 'Viral X Hook Builder v1.8', 'Cinematic Image Generator v3.0'].map((p, i) => (
            <div
              key={i}
              onClick={() => setSelectedPrompt(p)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedPrompt === p
                  ? 'bg-cyan-950/60 border-cyan-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between text-xs font-mono font-bold mb-1">
                <span>{p}</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <span className="text-[11px] text-slate-400">Last updated 2h ago by StudioOS</span>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-bold text-cyan-300 text-sm">{selectedPrompt}</h3>
            <span className="text-slate-400 text-[11px]">Version ID: v3.0.4-prod</span>
          </div>
          <pre className="p-4 bg-slate-900 rounded border border-slate-800 text-emerald-400 whitespace-pre-wrap leading-relaxed">
            You are a recognized subject-matter expert, senior editor, and platform specialist...
          </pre>
        </div>
      </div>
    </div>
  );
};
