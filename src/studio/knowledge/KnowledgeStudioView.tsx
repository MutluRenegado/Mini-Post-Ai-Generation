import React from 'react';

export const KnowledgeStudioView: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🧠 Persistent Knowledge Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage brand guidelines, product definitions, FAQs, and domain knowledge</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow transition-all">
          + Add Knowledge Block
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <h3 className="font-bold text-cyan-400 text-sm mb-2">Domain Definitions & Standards</h3>
          <p className="text-xs text-slate-300">Customs Clearance, Incoterms 2020, Duty Calculations, Supply Chain Resiliency</p>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <h3 className="font-bold text-cyan-400 text-sm mb-2">Verified RAG Benchmarks</h3>
          <p className="text-xs text-slate-300">70% automation rate in enterprise supply chain, 35% processing latency reduction</p>
        </div>
      </div>
    </div>
  );
};
