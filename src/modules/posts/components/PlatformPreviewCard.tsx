'use client';

import React, { useState } from 'react';
import { Copy, Check, Edit3, MessageCircle, Heart, Share2, ThumbsUp, Send, Repeat2, Bookmark, Music, Layout, Eye, Sparkles, Play } from 'lucide-react';
import { platformGeometryPresets } from '../config/geometry.config';

interface PlatformPreviewCardProps {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok';
  content: string;
  imageUrl?: string | null;
  onContentChange?: (newContent: string) => void;
  userEmail?: string;
}

function formatWithMandatoryTemplate(rawText: string): string {
  if (!rawText || rawText.trim().length === 0) return 'No post content generated yet.';
  if (
    rawText.includes('[MINI POST') ||
    rawText.includes('[MINI POST APP') ||
    rawText.includes('[EDITORIAL') ||
    rawText.includes('[APEX') ||
    rawText.includes('[GROWTH') ||
    rawText.includes('[MASTERCLASS') ||
    rawText.includes('🚀 [TECH') ||
    rawText.includes('🔥 [')
  ) {
    return rawText;
  }
  return `🌌 [MINI POST APP EXECUTIVE INTEL] • HIGH IMPACT REPORT\n\n${rawText}\n\n✨ Architected for visionary founders. Save & share with your leadership network.`;
}

export function PlatformPreviewCard({
  platform,
  content,
  imageUrl,
  onContentChange,
  userEmail = 'Creator Studio',
}: PlatformPreviewCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState<string | null>(null);

  const rawText = editedText !== null ? editedText : content;
  const text = formatWithMandatoryTemplate(rawText);
  const geometry = platformGeometryPresets[platform];

  const displayImage = imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80";

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditedText(val);
    onContentChange?.(val);
  };

  const authorName = userEmail.split('@')[0] || 'creatorstudio';

  // --- FACEBOOK (16:9 Landscape / Link Preview) MOCKUP ---
  if (platform === 'facebook') {
    return (
      <div className="w-full bg-slate-900 border border-blue-900/40 rounded-2xl p-5 shadow-xl transition-all space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-600/30">
              f
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                {authorName}
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  FB Feed ({geometry.aspectRatio})
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">Just now • 🌐 Public</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy FB Post'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isEditing ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={6}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
          />
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">📘 [HEADING / HOOK]</p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{text}</p>
            </div>

            {/* 16:9 Landscape Link/Media Card Preview */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-end p-4">
              <img
                src={displayImage}
                alt="16:9 Facebook Card Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-blue-400">minipost.app • 16:9 Landscape Link Preview</span>
                <h5 className="text-xs font-bold text-white truncate">Executive Strategy & Multi-Platform Publishing Suite</h5>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-around text-slate-400 text-xs font-semibold">
          <button type="button" className="flex items-center gap-2 hover:text-blue-400 py-1.5 px-3 rounded-lg hover:bg-slate-800/50">
            <ThumbsUp className="w-4 h-4" /> Like
          </button>
          <button type="button" className="flex items-center gap-2 hover:text-blue-400 py-1.5 px-3 rounded-lg hover:bg-slate-800/50">
            <MessageCircle className="w-4 h-4" /> Comment
          </button>
          <button type="button" className="flex items-center gap-2 hover:text-blue-400 py-1.5 px-3 rounded-lg hover:bg-slate-800/50">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    );
  }

  // --- INSTAGRAM (1:1 Square Carousel / 4:5 Feed) MOCKUP ---
  if (platform === 'instagram') {
    return (
      <div className="w-full max-w-xl mx-auto bg-slate-900 border border-pink-900/40 rounded-2xl p-5 shadow-xl transition-all space-y-4">
        {/* IG Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-xs">
                IG
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">@{authorName.toLowerCase()}</h4>
              <p className="text-[10px] text-pink-400 font-semibold">1:1 Square Carousel Post</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy IG Post'}</span>
            </button>
          </div>
        </div>

        {/* 1:1 Square Visual Asset Frame */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-black group shadow-2xl">
          <img
            src={displayImage}
            alt="Instagram 1:1 Square Visual"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-pink-300 text-[10px] font-bold border border-pink-500/30">
            1/5 Carousel ➡️
          </div>
        </div>

        {/* IG Action Icons */}
        <div className="flex items-center justify-between text-slate-300 py-1">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 hover:text-rose-500 cursor-pointer" />
            <MessageCircle className="w-6 h-6 hover:text-pink-400 cursor-pointer" />
            <Send className="w-6 h-6 hover:text-purple-400 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 hover:text-amber-400 cursor-pointer" />
        </div>

        {/* Caption Body */}
        {isEditing ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={6}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-pink-500 font-mono leading-relaxed"
          />
        ) : (
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <p className="text-xs text-slate-300">
              <span className="font-extrabold text-white mr-2">@{authorName.toLowerCase()}</span>
              {text}
            </p>
          </div>
        )}
      </div>
    );
  }

  // --- LINKEDIN (1.91:1 Professional Landscape) MOCKUP ---
  if (platform === 'linkedin') {
    return (
      <div className="w-full bg-slate-900 border border-sky-900/40 rounded-2xl p-5 shadow-xl transition-all space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-700 flex items-center justify-center text-white font-bold text-base shadow-md shadow-sky-600/30">
              in
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                {authorName}
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                  1.91:1 Professional Card
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">Executive Advisor & Founder • Published insights • 2m ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy LinkedIn Article'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isEditing ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={6}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 font-mono leading-relaxed"
          />
        ) : (
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{text}</p>
          </div>
        )}

        {/* Action Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-around text-slate-400 text-xs font-semibold">
          <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-slate-800/50">
            <ThumbsUp className="w-4 h-4" /> Like
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-slate-800/50">
            <MessageCircle className="w-4 h-4" /> Comment
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-slate-800/50">
            <Repeat2 className="w-4 h-4" /> Repost
          </button>
          <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-slate-800/50">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    );
  }

  // --- TWITTER / X (16:9 In-Stream Preview Card) MOCKUP ---
  if (platform === 'twitter') {
    const charCount = text.length;
    const isOverLimit = charCount > 280;

    return (
      <div className="w-full bg-slate-900 border border-slate-700/60 rounded-2xl p-5 shadow-xl transition-all space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
              𝕏
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                {authorName}
                <span className="text-[11px] text-slate-400 font-normal">@{authorName.toLowerCase()} • 1m</span>
              </h4>
              <p className="text-[10px] text-slate-400">16:9 In-Stream Micro-Card (Strictly &lt;= 280 Chars)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                isOverLimit ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {charCount}/280
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-white text-slate-950 shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy X Post'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isEditing ? (
          <textarea
            value={text}
            onChange={handleTextChange}
            rows={5}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-slate-400 font-mono leading-relaxed"
          />
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">{text}</p>
            </div>

            {/* 16:9 In-Stream Card */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
              <img
                src={displayImage}
                alt="X 16:9 Card"
                className="w-full h-full object-cover opacity-60"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                🖼️ [16:9 Media Card Preview]
              </span>
            </div>
          </div>
        )}

        {/* Metrics Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs font-mono">
          <span className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
            <MessageCircle className="w-4 h-4 text-sky-400" /> 24
          </span>
          <span className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
            <Repeat2 className="w-4 h-4 text-emerald-400" /> 12
          </span>
          <span className="flex items-center gap-1.5 hover:text-rose-400 cursor-pointer">
            <Heart className="w-4 h-4 text-rose-500" /> 142
          </span>
          <span className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer">
            <Eye className="w-4 h-4 text-purple-400" /> 1.2K
          </span>
        </div>
      </div>
    );
  }

  // --- TIKTOK (9:16 Vertical Full-Screen Video) MOCKUP ---
  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900 border border-teal-900/40 rounded-2xl p-5 shadow-xl transition-all space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-400 to-rose-500 flex items-center justify-center text-slate-950 font-black text-sm">
            🎵
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">@{authorName.toLowerCase()}</h4>
            <p className="text-[10px] text-teal-400 font-semibold">9:16 Vertical Video</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied ? 'bg-emerald-500 text-white' : 'bg-teal-500 text-slate-950 shadow-md font-bold'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>
        </div>
      </div>

      {/* 9:16 Vertical Video Screen Frame with Text Overlay */}
      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl flex flex-col justify-between p-4">
        {/* Background Video — loops silently like a real Reel/TikTok */}
        <video
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/80 text-[10px] font-mono text-teal-300 border border-teal-500/30 flex items-center gap-1 animate-pulse">
            <Play className="w-3 h-3 fill-teal-300" /> 9:16 Video Reel
          </span>
        </div>

        {/* Right Floating Actions */}
        <div className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-4 text-white">
          <div className="flex flex-col items-center">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500/30" />
            <span className="text-[10px] font-mono">14.2K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-7 h-7 text-teal-400" />
            <span className="text-[10px] font-mono">890</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="w-7 h-7 text-amber-400 fill-amber-400/30" />
            <span className="text-[10px] font-mono">3.4K</span>
          </div>
          <div className="flex flex-col items-center">
            <Send className="w-7 h-7 text-white" />
            <span className="text-[10px] font-mono">Share</span>
          </div>
        </div>

        {/* Bottom Text Overlay */}
        <div className="relative z-10 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 max-w-[82%]">
          <p className="text-xs font-bold text-teal-300 mb-1">@{authorName.toLowerCase()}</p>
          <p className="text-xs text-white line-clamp-3 leading-relaxed font-sans">{text}</p>
          <p className="text-[10px] text-teal-400 font-mono mt-1.5 flex items-center gap-1">
            <Music className="w-3 h-3 animate-spin" /> Original Sound - @{authorName.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
