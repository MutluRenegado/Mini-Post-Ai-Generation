import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="h-8 bg-slate-800/60 rounded-xl w-3/4 mx-auto" />
        <div className="h-4 bg-slate-800/40 rounded-lg w-5/6 mx-auto" />
      </div>

      {/* Form Skeleton */}
      <div className="w-full bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="h-6 bg-slate-800/60 rounded-lg w-1/3 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800/40 rounded w-20" />
          <div className="h-10 bg-slate-950/60 border border-slate-800/60 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-800/40 rounded w-20" />
          <div className="h-28 bg-slate-950/60 border border-slate-800/60 rounded-xl" />
        </div>
        <div className="h-10 bg-indigo-600/30 rounded-xl w-36" />
      </div>

      {/* Post Cards Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-slate-800/50 rounded-lg w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-800/50 rounded-full w-20" />
                <div className="h-3 bg-slate-800/40 rounded w-24" />
              </div>
              <div className="h-6 bg-slate-800/60 rounded-lg w-4/5" />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-800/40 rounded w-full" />
                <div className="h-3.5 bg-slate-800/40 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
