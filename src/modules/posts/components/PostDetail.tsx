'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post, PostStatus } from '../types/post.types';
import { PlatformPreviewCard } from './PlatformPreviewCard';
import { toggleLockPostAction, updatePostStatusAction, deletePostAction } from '../actions/lock-actions';
import { useAuth } from '@/modules/auth/context/AuthContext';
import {
  ArrowLeft,
  Globe,
  Layers,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  Info,
  Calendar,
  UserCheck,
} from 'lucide-react';

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post: initialPost }: PostDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post>(initialPost);

  const [activeTab, setActiveTab] = useState<'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok'>('facebook');

  // Confirmation Modal state for locking
  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Status transitions
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isLocked = post.status === 'locked';

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedLockDate = post.lockedAt
    ? new Date(post.lockedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const hasAdaptations = post.adaptations && Object.keys(post.adaptations).length > 0;

  const handleToggleLock = () => {
    if (!isLocked) {
      // Opening confirmation modal first
      setShowLockModal(true);
    } else {
      // Direct unlock action
      executeToggleLock();
    }
  };

  const executeToggleLock = () => {
    setShowLockModal(false);
    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await toggleLockPostAction(post.id, user?.email || user?.uid || 'anonymous');
      if (res.success && res.data) {
        setPost(res.data.post);
        setFeedbackMsg({
          type: 'success',
          text: res.data.isLocked
            ? '🔒 Post is now locked and protected from edits or deletion.'
            : '🔓 Post is unlocked. Editing and deletion are now enabled.',
        });
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Failed to update lock status.',
        });
      }

      setTimeout(() => setFeedbackMsg(null), 5000);
    });
  };

  const handleStatusChange = (newStatus: PostStatus) => {
    if (newStatus === 'locked') {
      setShowLockModal(true);
      return;
    }

    if (isLocked) {
      setFeedbackMsg({
        type: 'error',
        text: 'This post is locked. Click Unlock first to change status.',
      });
      return;
    }

    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await updatePostStatusAction(post.id, newStatus, user?.email || user?.uid);
      if (res.success && res.data) {
        setPost(res.data);
        setFeedbackMsg({
          type: 'success',
          text: `Status updated to ${newStatus.toUpperCase()}`,
        });
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Failed to update status.',
        });
      }
      setTimeout(() => setFeedbackMsg(null), 4000);
    });
  };

  const handleDeletePost = () => {
    if (isLocked) {
      setFeedbackMsg({
        type: 'error',
        text: 'This post is locked and cannot be deleted. Unlock it first.',
      });
      return;
    }
    setShowDeleteModal(true);
  };

  const executeDelete = () => {
    setShowDeleteModal(false);
    startTransition(async () => {
      setFeedbackMsg(null);
      const res = await deletePostAction(post.id, user?.email || user?.uid);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Failed to delete post.',
        });
      }
    });
  };

  return (
    <article className="w-full space-y-8 relative">
      {/* Lock Confirmation Modal */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12151E] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-white">Lock this post?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Locked posts cannot be edited or deleted until they are unlocked.
              </p>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300/90 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Backend mutation guards will reject any deletion, AI regeneration, or editing requests.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLockModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeToggleLock}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                {isPending ? 'Locking...' : 'Yes, Lock Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12151E] border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-white">Soft Delete Post?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This post will be moved to soft-deleted archive. You can restore it later if needed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/20"
              >
                {isPending ? 'Deleting...' : 'Soft Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* READ-ONLY LOCKED BANNER */}
      {isLocked && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <span>READ-ONLY MODE ACTIVE</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 font-mono">
                  PROTECTED
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                This post is locked. Backend guards prevent accidental editing or deletion.
              </p>
              {formattedLockDate && (
                <div className="text-[11px] font-mono text-amber-400/90 mt-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Locked on {formattedLockDate}
                  {post.lockedBy && (
                    <>
                      <span>•</span>
                      <UserCheck className="w-3 h-3" /> By {post.lockedBy}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleLock}
            disabled={isPending}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 self-end sm:self-auto shrink-0"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Post to Edit</span>
          </button>
        </div>
      )}

      {/* Post Content Header */}
      <div className={`bg-slate-900/80 border backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl ${
        isLocked ? 'border-amber-500/30' : 'border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Multi-Platform Studio
          </Link>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <span className="text-[10px] text-slate-500 font-mono px-2">Status:</span>
              <button
                type="button"
                onClick={() => handleStatusChange('draft')}
                disabled={isLocked || isPending}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  post.status === 'draft' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('in_progress')}
                disabled={isLocked || isPending}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  post.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                disabled={isLocked || isPending}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  post.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Completed
              </button>
            </div>

            {/* Lock / Unlock Toggle Button */}
            <button
              type="button"
              onClick={handleToggleLock}
              disabled={isPending}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md ${
                isLocked
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isLocked ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Post</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Lock Post</span>
                </>
              )}
            </button>

            {/* Delete Post Button */}
            <button
              type="button"
              onClick={handleDeletePost}
              disabled={isLocked || isPending}
              title={isLocked ? 'Cannot delete a locked post. Unlock it first.' : 'Soft Delete Post'}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isLocked
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Globe className="w-3.5 h-3.5" />
            {post.userEmail || 'Creator Studio'}
          </span>
          {isLocked ? (
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> LOCKED
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
              Status: {post.status?.toUpperCase() || 'DRAFT'}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-slate-400 border-b border-slate-800 pb-6 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-md">
            {(post.userEmail?.[0] || 'C').toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-300">
              {post.userEmail ? post.userEmail.split('@')[0] : 'Creator Studio'}
            </div>
            <time dateTime={post.createdAt} className="text-slate-500">
              {formattedDate}
            </time>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
          {post.content}
        </div>
      </div>

      {/* Adapted Platform Variants */}
      {hasAdaptations && (
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Multi-Platform Adapted Formats</h3>
              <p className="text-xs text-slate-400">Switch tabs to preview and copy platform-ready posts</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {post.adaptations?.facebook && (
              <button
                onClick={() => setActiveTab('facebook')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'facebook'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                🔵 Facebook
              </button>
            )}
            {post.adaptations?.instagram && (
              <button
                onClick={() => setActiveTab('instagram')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'instagram'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                📸 Instagram
              </button>
            )}
            {post.adaptations?.linkedin && (
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'linkedin'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                💼 LinkedIn
              </button>
            )}
            {post.adaptations?.twitter && (
              <button
                onClick={() => setActiveTab('twitter')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'twitter'
                    ? 'bg-slate-100 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                𝕏 Twitter
              </button>
            )}
            {post.adaptations?.tiktok && (
              <button
                onClick={() => setActiveTab('tiktok')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'tiktok'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                🎵 TikTok
              </button>
            )}
          </div>

          <PlatformPreviewCard
            platform={activeTab}
            content={post.adaptations?.[activeTab] || ''}
            userEmail={post.userEmail}
          />
        </div>
      )}
    </article>
  );
}
