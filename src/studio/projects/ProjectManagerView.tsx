import React, { useState } from 'react';

export interface ProjectItem {
  id: string;
  name: string;
  postsCount: number;
  lastUpdated: string;
}

export const ProjectManagerView: React.FC = () => {
  const [projects] = useState<ProjectItem[]>([
    { id: 'p1', name: 'Q3 Logistics Campaign', postsCount: 14, lastUpdated: 'Today' },
    { id: 'p2', name: 'AI Product Launch', postsCount: 8, lastUpdated: 'Yesterday' },
    { id: 'p3', name: 'Brand Awareness 2026', postsCount: 22, lastUpdated: '3 days ago' },
  ]);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📁 Project Management Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">Organize posts, templates, knowledge, and brand kits per project</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow transition-all">
          + Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {projects.map((p) => (
          <div key={p.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500 transition-all cursor-pointer">
            <h3 className="font-bold text-white text-sm mb-1">{p.name}</h3>
            <div className="text-xs text-slate-400 font-mono flex justify-between pt-2 border-t border-slate-900">
              <span>{p.postsCount} Posts</span>
              <span>{p.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
