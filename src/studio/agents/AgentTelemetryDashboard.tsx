import React from 'react';

export const AgentTelemetryDashboard: React.FC = () => {
  const agents = [
    { name: 'TopicAgent', status: 'HEALTHY', latency: '45ms', successRate: '100%', executions: 124 },
    { name: 'ResearchAgent', status: 'HEALTHY', latency: '85ms', successRate: '99.2%', executions: 124 },
    { name: 'KnowledgeAgent', status: 'HEALTHY', latency: '95ms', successRate: '100%', executions: 124 },
    { name: 'WriterAgent', status: 'HEALTHY', latency: '650ms', successRate: '98.5%', executions: 124 },
    { name: 'ImageAgent', status: 'HEALTHY', latency: '120ms', successRate: '100%', executions: 124 },
    { name: 'SEOAgent', status: 'HEALTHY', latency: '40ms', successRate: '100%', executions: 124 },
    { name: 'QualityAgent', status: 'HEALTHY', latency: '90ms', successRate: '97.8%', executions: 124 },
    { name: 'BrandAgent', status: 'HEALTHY', latency: '30ms', successRate: '100%', executions: 124 },
    { name: 'ExportAgent', status: 'HEALTHY', latency: '25ms', successRate: '100%', executions: 124 },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl font-sans">
      <h2 className="text-xl font-bold text-white mb-1">🤖 AI Autonomous Agents Telemetry</h2>
      <p className="text-xs text-slate-400 mb-6">Real-time status and performance of all 9 registered studio agents</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent, idx) => (
          <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">{agent.name}</span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold text-[10px]">
                {agent.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-2 border-t border-slate-900">
              <div>Avg Latency: <strong className="text-slate-200">{agent.latency}</strong></div>
              <div>Success Rate: <strong className="text-emerald-400">{agent.successRate}</strong></div>
              <div>Executions: <strong className="text-cyan-400">{agent.executions}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
