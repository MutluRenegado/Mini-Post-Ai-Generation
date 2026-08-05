'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Root Global Error Boundary]:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 antialiased">
        <div className="w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-100 mb-3">Critical Application Error</h1>
          <p className="text-sm text-slate-400 mb-6">
            A fatal root-level crash was prevented by the global error boundary.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg"
          >
            Restart Application State
          </button>
        </div>
      </body>
    </html>
  );
}
