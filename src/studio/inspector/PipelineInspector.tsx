import React, { useState } from 'react';

export interface PipelineStageStep {
  name: string;
  durationMs: number;
  tokensUsed: number;
  score: number;
  details: string;
  outputPreview: string;
}

export interface PipelineInspectorProps {
  requestId?: string;
  topic?: string;
  stages?: PipelineStageStep[];
  provider?: string;
  totalTimeMs?: number;
}

export const PipelineInspector: React.FC<PipelineInspectorProps> = ({
  requestId = 'req_demo_101',
  topic = 'Customs Clearance Strategy',
  provider = 'gemini-3.6-flash',
  totalTimeMs = 1240,
  stages = [
    { name: 'User Request', durationMs: 15, tokensUsed: 40, score: 100, details: 'Input sanitization & contract intake', outputPreview: topic },
    { name: 'Topic Intelligence', durationMs: 45, tokensUsed: 120, score: 98, details: 'Industry & Search intent classification', outputPreview: 'Category: Educational, Industry: Logistics' },
    { name: 'Knowledge Base', durationMs: 85, tokensUsed: 350, score: 96, details: 'RAG fact retrieval & definitions build', outputPreview: 'Retrieved 4 domain facts & 3 stats' },
    { name: 'Reasoning Engine', durationMs: 60, tokensUsed: 210, score: 95, details: 'Multi-step intent reasoning & forbidden words filter', outputPreview: '5-step execution plan generated' },
    { name: 'Content Blueprint', durationMs: 75, tokensUsed: 290, score: 97, details: 'Hooks, outlines & image concepts per platform', outputPreview: 'Blueprint for LinkedIn, X, Instagram' },
    { name: 'Master Prompt', durationMs: 30, tokensUsed: 450, score: 100, details: 'Context-rich prompt assembly', outputPreview: 'Unified multi-platform prompt' },
    { name: 'LLM Response', durationMs: 650, tokensUsed: 1850, score: 94, details: `Generated via ${provider}`, outputPreview: 'JSON platform outputs received' },
    { name: 'Quality Audit', durationMs: 90, tokensUsed: 0, score: 95, details: 'Scored 9 dimensions (Pass score >= 92)', outputPreview: 'Pass: 95/100 (0 prompt leakage)' },
    { name: 'Optimization', durationMs: 40, tokensUsed: 0, score: 96, details: 'SEO, Readability & Hashtag rules applied', outputPreview: 'Final publication-ready package' },
  ],
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-2xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            🔍 StudioOS Pipeline Inspector
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">ID: {requestId} | Topic: "{topic}"</p>
        </div>
        <div className="flex gap-3 text-xs font-mono">
          <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Provider: <strong className="text-cyan-300">{provider}</strong></span>
          <span className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">Latency: <strong className="text-emerald-400">{totalTimeMs}ms</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Stage Timeline list */}
        <div className="space-y-2 col-span-1">
          {stages.map((stage, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                activeStage === idx
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md'
                  : 'bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold">{stage.name}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                {stage.durationMs}ms
              </span>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Inspector */}
        <div className="col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-cyan-300">
              Stage #{activeStage + 1}: {stages[activeStage].name}
            </h3>
            <div className="flex gap-2">
              <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-800">Tokens: {stages[activeStage].tokensUsed}</span>
              <span className="bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded border border-emerald-800">Score: {stages[activeStage].score}/100</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider block mb-1">Execution Details</span>
            <p className="text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">{stages[activeStage].details}</p>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider block mb-1">Output Artifact Preview</span>
            <pre className="text-emerald-400 bg-slate-900 p-3 rounded border border-slate-800 whitespace-pre-wrap overflow-x-auto max-h-48 text-[11px]">
              {stages[activeStage].outputPreview}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
