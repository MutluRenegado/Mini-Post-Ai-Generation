import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-6">
        <span className="font-mono font-bold text-xl">404</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-3">
        Post or Page Not Found
      </h1>
      <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
        The requested post does not exist or may have been removed. Please check the URL or return to the main feed.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/25"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Post Feed</span>
      </Link>
    </div>
  );
}
