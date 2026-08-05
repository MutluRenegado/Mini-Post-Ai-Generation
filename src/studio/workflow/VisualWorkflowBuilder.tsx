import React, { useState } from 'react';

export interface WorkflowNode {
  id: string;
  name: string;
  agent: string;
  type: 'agent' | 'condition' | 'approval' | 'publishing';
  position: number;
}

export const VisualWorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: 'n1', name: 'Topic Analysis', agent: 'TopicAgent', type: 'agent', position: 1 },
    { id: 'n2', name: 'Fact Retrieval (RAG)', agent: 'ResearchAgent', type: 'agent', position: 2 },
    { id: 'n3', name: 'Knowledge Build', agent: 'KnowledgeAgent', type: 'agent', position: 3 },
    { id: 'n4', name: 'Content Generation', agent: 'WriterAgent', type: 'agent', position: 4 },
    { id: 'n5', name: 'Cinematic Visuals', agent: 'ImageAgent', type: 'agent', position: 5 },
    { id: 'n6', name: 'Quality Audit (Score >= 92)', agent: 'QualityAgent', type: 'condition', position: 6 },
    { id: 'n7', name: 'Human Review & Approval', agent: 'ApprovalEngine', type: 'approval', position: 7 },
    { id: 'n8', name: 'Multi-Platform Dispatch', agent: 'Publisher', type: 'publishing', position: 8 },
  ]);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⚡ StudioOS Visual Workflow Builder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Drag, configure and link autonomous studio nodes</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow-md transition-all">
          Save Workflow Blueprint
        </button>
      </div>

      {/* Visual Canvas Nodes Flow */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 w-48 shadow-lg hover:border-cyan-500 transition-all cursor-pointer">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                <span>STEP #{node.position}</span>
                <span className="uppercase text-cyan-400 font-bold">{node.type}</span>
              </div>
              <h4 className="font-bold text-white text-sm">{node.name}</h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">{node.agent}</p>
            </div>
            {index < nodes.length - 1 && (
              <span className="text-cyan-500 font-bold text-xl">➔</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
