'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error defensively
    console.error('[App Error Boundary]:', error);
  }, [error]);

  return (
    <div className="w-full bg-slate-900/80 border border-rose-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl shadow-rose-950/20 my-8">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-5">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-100 mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-400 mb-6">
        An unexpected error occurred while processing this page. The system caught this crash safely.
      </p>

      {error.message && (
        <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-rose-300/90 text-left overflow-x-auto">
          {error.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-md"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition-colors duration-200"
        >
          Return to Feed
        </Link>
      </div>
    </div>
  );
}
