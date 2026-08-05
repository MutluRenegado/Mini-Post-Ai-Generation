'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Post, PostStatus } from '../types/post.types';
import { postsRepository } from '../db/posts.repository';
import {
  toggleLockPostAction,
  deletePostAction,
  bulkDeletePostsAction,
} from '../actions/lock-actions';
import { useAuth } from '@/modules/auth/context/AuthContext';
import {
  Layers,
  CheckCircle2,
  Clock,
  Edit3,
  Lock,
  Unlock,
  Trash2,
  Eye,
  AlertCircle,
  Info,
} from 'lucide-react';

export function PostHistoryTable() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Toast / notification state
  const [notification, setNotification] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsRepository.getAllPosts();
      setPosts(data || []);
    } catch (err) {
      console.error('[PostHistoryTable] Error loading posts:', err);
    } font: {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(posts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleLock = (post: Post) => {
    startTransition(async () => {
      const res = await toggleLockPostAction(post.id, user?.email || user?.uid);
      if (res.success && res.data) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? res.data!.post : p))
        );
        setNotification({
          type: 'success',
          text: res.data.isLocked
            ? `🔒 "${post.title.slice(0, 30)}..." is now locked and protected.`
            : `🔓 "${post.title.slice(0, 30)}..." is now unlocked.`,
        });
      } else {
        setNotification({
          type: 'error',
          text: res.error || 'Failed to toggle lock status.',
        });
      }
      setTimeout(() => setNotification(null), 5000);
    });
  };

  const handleDeleteOne = (post: Post) => {
    if (post.status === 'locked') {
      setNotification({
        type: 'error',
        text: 'This post is locked and cannot be deleted. Unlock it first.',
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    startTransition(async () => {
      const res = await deletePostAction(post.id, user?.email || user?.uid);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setSelectedIds((prev) => prev.filter((i) => i !== post.id));
        setNotification({
          type: 'success',
          text: 'Post deleted successfully.',
        });
      } else {
        setNotification({
          type: 'error',
          text: res.error || 'Failed to delete post.',
        });
      }
      setTimeout(() => setNotification(null), 4000);
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      const res = await bulkDeletePostsAction(selectedIds, user?.email || user?.uid);
      if (res.success && res.data) {
        const { deletedCount, skippedLockedCount, skippedLockedTitles } = res.data;
        
        await loadPosts();
        setSelectedIds([]);

        let summaryMsg = `${deletedCount} post${deletedCount === 1 ? '' : 's'} deleted.`;
        if (skippedLockedCount > 0) {
          summaryMsg += ` ${skippedLockedCount} locked post${skippedLockedCount === 1 ? '' : 's'} skipped to prevent false deletion.`;
        }

        setNotification({
          type: skippedLockedCount > 0 ? 'info' : 'success',
          text: summaryMsg,
        });
      } else {
        setNotification({
          type: 'error',
          text: res.error || 'Failed to execute bulk delete.',
        });
      }
      setTimeout(() => setNotification(null), 6000);
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
        Loading post history and workflow status...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white">No Generated Posts Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Use the Multi-Platform Studio above to generate and adapt your first post across Facebook, Instagram, LinkedIn, X, and TikTok.
        </p>
      </div>
    );
  }

  const renderStatusBadge = (status: PostStatus = 'draft') => {
    switch (status) {
      case 'locked':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold inline-flex items-center gap-1">
            <Lock className="w-3 h-3" /> LOCKED
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> IN PROGRESS
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold inline-flex items-center gap-1">
            <Edit3 className="w-3 h-3" /> DRAFT
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : notification.type === 'info'
              ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
              : 'bg-red-950/50 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{notification.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#181C2B] border border-[#262C3D] rounded-2xl p-3 px-4 flex items-center justify-between text-xs animate-fadeIn">
          <div className="text-slate-300 font-semibold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span>Items Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isPending}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Soft Delete</span>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#1E2330]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#181C2B] text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-[#1E2330]">
            <tr>
              <th className="py-3 px-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === posts.length && posts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="py-3 px-4">Post Title & Content</th>
              <th className="py-3 px-4">Platforms</th>
              <th className="py-3 px-4">Workflow Status</th>
              <th className="py-3 px-4">Lock Protection</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2330] bg-[#10131C]">
            {posts.map((post) => {
              const isLocked = post.status === 'locked';
              const isSelected = selectedIds.includes(post.id);
              const hasAdaptations = post.adaptations && Object.keys(post.adaptations).length > 0;

              return (
                <tr
                  key={post.id}
                  className={`transition-all ${
                    isLocked ? 'bg-amber-950/5 hover:bg-amber-950/10' : 'hover:bg-[#181C2B]/50'
                  } ${isSelected ? 'bg-indigo-950/20' : ''}`}
                >
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(post.id)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-bold text-white hover:text-indigo-300 transition-colors line-clamp-1"
                      >
                        {post.title || 'Untitled Post'}
                      </Link>
                    </div>
                    <div className="text-slate-400 line-clamp-1 text-[11px] leading-relaxed mt-0.5">
                      {post.content}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {hasAdaptations ? (
                        <>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">FB</span>
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px]">IG</span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">LI</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px]">X</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px]">TikTok</span>
                        </>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Master Only</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {renderStatusBadge(post.status)}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleLock(post)}
                      disabled={isPending}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition-all border ${
                        isLocked
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                      title={isLocked ? 'Click to Unlock' : 'Click to Lock'}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Locked</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 text-slate-500" />
                          <span>Unlocked</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        title="View Post Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteOne(post)}
                        disabled={isLocked || isPending}
                        title={isLocked ? 'Cannot delete locked post. Unlock first.' : 'Delete Post'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLocked
                            ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
