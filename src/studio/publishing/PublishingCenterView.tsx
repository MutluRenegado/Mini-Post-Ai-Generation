import React from 'react';

export const PublishingCenterView: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚀 Multi-Platform Publishing Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review, schedule, and dispatch posts to LinkedIn, X, Instagram, Facebook & TikTok</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Drafts</span>
          <span className="text-2xl font-bold text-white">4</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">In Review</span>
          <span className="text-2xl font-bold text-yellow-400">2</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Scheduled</span>
          <span className="text-2xl font-bold text-cyan-400">6</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1">Published</span>
          <span className="text-2xl font-bold text-emerald-400">128</span>
        </div>
      </div>
    </div>
  );
};
