'use client';

import React, { useState, useTransition } from 'react';
import { createPostAction } from '../actions/create-post.action';

export function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ title?: string[]; content?: string[] }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const result = await createPostAction({ title, content });

      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setServerError(result.error ?? 'Failed to create post.');
      } else {
        setTitle('');
        setContent('');
        setSuccessMsg('Post created successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    });
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl shadow-indigo-950/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Create a New Post</h2>
          <p className="text-xs text-slate-400">Share your thoughts with the world</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-fadeIn">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {serverError && !Object.keys(fieldErrors).length && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3 animate-fadeIn">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="post-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Post Title <span className="text-indigo-400">*</span>
          </label>
          <input
            id="post-title"
            type="text"
            placeholder="What's on your mind? (min. 3 chars)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) {
                setFieldErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            disabled={isPending}
            className={`w-full px-4 py-3 bg-slate-950/70 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 ${
              fieldErrors.title ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
            }`}
          />
          {fieldErrors.title?.map((err, idx) => (
            <p key={idx} className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <span>•</span> {err}
            </p>
          ))}
        </div>

        <div>
          <label htmlFor="post-content" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Content <span className="text-indigo-400">*</span>
          </label>
          <textarea
            id="post-content"
            rows={4}
            placeholder="Write your story here..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (fieldErrors.content) {
                setFieldErrors((prev) => ({ ...prev, content: undefined }));
              }
            }}
            disabled={isPending}
            className={`w-full px-4 py-3 bg-slate-950/70 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 ${
              fieldErrors.content ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500/80'
            }`}
          />
          {fieldErrors.content?.map((err, idx) => (
            <p key={idx} className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <span>•</span> {err}
            </p>
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <span>Publish Post</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
