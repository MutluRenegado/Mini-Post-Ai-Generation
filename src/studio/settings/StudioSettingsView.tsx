import React, { useState } from 'react';

export const StudioSettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'providers' | 'brand' | 'publishing' | 'security'>('providers');

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <h2 className="text-xl font-bold text-white mb-1">⚙️ StudioOS Centralized Settings Center</h2>
      <p className="text-xs text-slate-400 mb-6">Manage AI providers, brand profiles, publishing connections, and security settings</p>

      <div className="flex gap-2 border-b border-slate-800 pb-2 mb-6">
        {(['providers', 'brand', 'publishing', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
              activeTab === tab ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
        {activeTab === 'providers' && (
          <div className="space-y-3">
            <h3 className="font-bold text-cyan-400 text-sm">AI Provider Configuration</h3>
            <div>Primary Model: <strong className="text-emerald-400">Gemini 2.5 Flash</strong></div>
            <div>Fallback Models: <strong>GPT-4o, Claude 3.5 Sonnet</strong></div>
            <div>Quality Threshold: <strong>92 / 100</strong></div>
          </div>
        )}
        {activeTab === 'brand' && (
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 text-sm">Active Brand Profile</h3>
            <div>Brand Name: <strong>Mini Post App</strong></div>
            <div>Default Voice Tone: <strong>Professional & Engaging</strong></div>
          </div>
        )}
        {activeTab === 'publishing' && (
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 text-sm">Social Platform Connections</h3>
            <div>Connected Platforms: <strong>LinkedIn, X (Twitter), Instagram, Facebook, TikTok</strong></div>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="space-y-2">
            <h3 className="font-bold text-cyan-400 text-sm">Security & Rate Limiting</h3>
            <div>Prompt Injection Protection: <strong className="text-emerald-400">ACTIVE</strong></div>
            <div>Max Rate Limit: <strong>60 requests/min</strong></div>
          </div>
        )}
      </div>
    </div>
  );
};
