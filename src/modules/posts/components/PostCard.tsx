'use client';

import React from 'react';
import Link from 'next/link';
import { Post, PostStatus } from '../types/post.types';
import { Globe, ArrowRight, Lock, CheckCircle2, Clock, Edit3 } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hasAdaptations = post.adaptations && Object.keys(post.adaptations).length > 0;
  const status: PostStatus = post.status || 'draft';

  const renderStatusBadge = () => {
    switch (status) {
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lock className="w-3 h-3" /> LOCKED
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-3 h-3" /> IN PROGRESS
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            <Edit3 className="w-3 h-3" /> DRAFT
          </span>
        );
    }
  };

  return (
    <article className={`group relative bg-slate-900/60 hover:bg-slate-900 border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/30 flex flex-col justify-between ${
      status === 'locked' ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800 hover:border-indigo-500/50'
    }`}>
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Globe className="w-3 h-3" />
            {post.userEmail ? post.userEmail.split('@')[0] : 'Creator Studio'}
          </span>
          <div className="flex items-center gap-2">
            {renderStatusBadge()}
            <time dateTime={post.createdAt} className="text-[11px] text-slate-500 font-mono">
              {formattedDate}
            </time>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2 mb-2">
          <Link href={`/posts/${post.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {post.content}
        </p>
      </div>

      <div>
        {/* Platform Adaptation Badges */}
        {hasAdaptations && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Formats:</span>
            {post.adaptations?.facebook && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                FB
              </span>
            )}
            {post.adaptations?.instagram && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold">
                IG
              </span>
            )}
            {post.adaptations?.linkedin && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                LinkedIn
              </span>
            )}
            {post.adaptations?.twitter && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                𝕏
              </span>
            )}
            {post.adaptations?.tiktok && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                TikTok
              </span>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-semibold">
          <span>{status === 'locked' ? 'View Locked Post' : 'View Multi-Platform Studio'}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
}
