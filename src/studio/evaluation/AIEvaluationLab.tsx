import React from 'react';

export const AIEvaluationLab: React.FC = () => {
  const providers = [
    { name: 'Gemini 2.5 Flash', latency: '650ms', costPer1k: '$0.0001', qualityScore: 96, status: 'PRIMARY ACTIVE' },
    { name: 'OpenAI GPT-4o', latency: '1,100ms', costPer1k: '$0.0025', qualityScore: 95, status: 'STANDBY' },
    { name: 'Claude 3.5 Sonnet', latency: '1,250ms', costPer1k: '$0.0030', qualityScore: 97, status: 'STANDBY' },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <h2 className="text-xl font-bold text-white mb-1">🧪 AI Evaluation Lab & Multi-LLM Benchmark</h2>
      <p className="text-xs text-slate-400 mb-6">Compare latency, cost, and output quality across LLM providers</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((p, idx) => (
          <div key={idx} className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">{p.name}</h3>
              <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded font-semibold text-[10px]">
                {p.status}
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div>Latency: <strong className="text-emerald-400">{p.latency}</strong></div>
              <div>Cost / 1k tokens: <strong className="text-cyan-400">{p.costPer1k}</strong></div>
              <div>Quality Score: <strong className="text-emerald-400">{p.qualityScore}/100</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
