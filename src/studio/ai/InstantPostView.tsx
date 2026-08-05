'use client';

import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Copy,
  Check,
  Send,
  ArrowLeft,
  Share2,
  Sliders,
  CheckCircle2,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { PlatformVariation } from './ai-content.service';
import { StudioOrchestratorService, InstantPostApiPayload } from '../orchestrator/orchestrator.service';
import { StudioClientService } from '@/lib/services/studioClientService';
import { useStudioAssistant } from '../assistant/StudioAssistantContext';

interface InstantPostViewProps {
  onBack?: () => void;
}

const PLATFORMS_LIST = [
  'Facebook',
  'Twitter (X)',
  'LinkedIn',
  'Instagram Feed',
  'Instagram Story',
  'YouTube',
  'TikTok',
  'Google Business',
  'Bluesky',
  'Threads',
  'Telegram',
];

const GOALS = [
  'Promote Product',
  'Promote Service',
  'Blog Article',
  'Event',
  'Announcement',
  'Discount',
  'Brand Awareness',
  'Educational',
  'Testimonial',
  'Quote',
];

const TONES = [
  'Professional',
  'Friendly',
  'Corporate',
  'Luxury',
  'Casual',
  'Educational',
  'Funny',
];

export function InstantPostView({ onBack }: InstantPostViewProps) {
  const assistant = useStudioAssistant();

  // Input states
  const [rawIdea, setRawIdea] = useState('');
  const [goal, setGoal] = useState('Brand Awareness');
  const [targetAudience, setTargetAudience] = useState('Tech Founders & Content Creators');
  const [platforms, setPlatforms] = useState<string[]>(['LinkedIn', 'Twitter (X)', 'Instagram Feed', 'TikTok']);
  const [tone, setTone] = useState('Professional');

  // Output states
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [variations, setVariations] = useState<PlatformVariation[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, boolean>>({});
  const [recreatingPlatform, setRecreatingPlatform] = useState<string | null>(null);

  const handleRecreateImage = async (platform: string, originalPrompt: string, sourceUrl: string, idx: number) => {
    if (recreatingPlatform) return;
    setRecreatingPlatform(platform);
    assistant.addNotification({
      id: `recreate_img_${platform}`,
      type: 'progress',
      title: 'Image Generation Progress',
      message: `Recreating visual asset for ${platform}...`,
      source: 'Image Kernel',
      progress: 50,
    });
    try {
      const isVertical = platform.toLowerCase().includes('story') || platform.toLowerCase().includes('tiktok') || platform.toLowerCase().includes('reel');
      const res = await StudioClientService.recreateImage({
        operation: 'recreate',
        postTopic: rawIdea || 'Social Media Visual',
        originalImagePrompt: originalPrompt,
        platform,
        sourceImageUrl: sourceUrl,
        aspectRatio: isVertical ? '9:16' : '1:1',
      });

      if (res.success && res.data?.imageUrl && variations) {
        const updated = [...variations];
        updated[idx] = {
          ...updated[idx],
          media_asset: {
            ...updated[idx].media_asset,
            url: res.data.imageUrl,
            prompt: res.data.imagePrompt || originalPrompt,
          },
        };
        setVariations(updated);
        assistant.addNotification({
          id: `recreate_img_${platform}`,
          type: 'success',
          title: 'Image Generation Completed',
          message: `Visual asset for ${platform} recreated successfully!`,
          source: 'Image Kernel',
          progress: 100,
        });
      } else {
        assistant.addNotification({
          id: `recreate_img_${platform}`,
          type: 'error',
          title: 'Image Generation Failed',
          message: 'Failed to recreate image asset.',
          source: 'Image Kernel',
        });
      }
    } catch (err: any) {
      console.error('[RecreateImage] Error:', err);
      assistant.addNotification({
        id: `recreate_img_${platform}`,
        type: 'error',
        title: 'Image Generation Failed',
        message: err?.message || 'Error occurred during image recreation.',
        source: 'Image Kernel',
      });
    } finally {
      setRecreatingPlatform(null);
    }
  };

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter((x) => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawIdea.trim()) {
      assistant.addNotification({
        type: 'warning',
        title: 'Validation Warning',
        message: 'Please enter a topic or raw idea before generating.',
        source: 'Instant Post Creator',
      });
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setVariations(null);

    assistant.addNotification({
      id: 'instant_gen_progress',
      type: 'progress',
      title: 'Content Generation Started',
      message: 'Generating multi-platform copy and media assets concurrently...',
      source: 'Instant Post Creator',
      progress: 45,
    });

    const apiPayload: InstantPostApiPayload = {
      goal,
      audience: targetAudience,
      tone,
      platforms,
      raw_idea: rawIdea,
    };

    try {
      const res = await StudioOrchestratorService.executeInstantAIPipeline(apiPayload);
      if (res.success && res.variations && res.variations.length > 0) {
        setVariations(res.variations);
        assistant.addNotification({
          id: 'instant_gen_progress',
          type: 'success',
          title: 'Content Generation Completed',
          message: `Successfully generated content for ${res.variations.length} target platforms!`,
          source: 'Instant Post Creator',
          progress: 100,
        });
      } else {
        const errStr = res.error || 'Generation failed to produce platform variations.';
        setErrorMsg(errStr);
        assistant.addNotification({
          id: 'instant_gen_progress',
          type: 'error',
          title: 'Content Generation Failed',
          message: errStr,
          source: 'Instant Post Creator',
        });
      }
    } catch (err: any) {
      console.error('Instant generation error', err);
      const errStr = err?.message || 'Unexpected generation error occurred.';
      setErrorMsg(errStr);
      assistant.addNotification({
        id: 'instant_gen_progress',
        type: 'error',
        title: 'Content Generation Failed',
        message: errStr,
        source: 'Instant Post Creator',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (item: PlatformVariation, index: number) => {
    const textToCopy = `${item.title}\n\n${item.body}\n\n${item.cta}\n\n${item.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDispatchPlatform = async (item: PlatformVariation) => {
    assistant.addNotification({
      id: `dispatch_${item.platform}`,
      type: 'progress',
      title: 'Publishing Started',
      message: `Submitting post request to dispatch workflow for ${item.platform}...`,
      source: 'Publishing Dispatch',
      progress: 50,
    });

    try {
      await StudioOrchestratorService.submitPostRequest({
        workflowId: `instant_wf_${Date.now()}`,
        topic: rawIdea,
        title: item.title,
        description: item.body,
        callToAction: item.cta,
        platforms: [item.platform],
        templateId: 'tmpl_quote_dark',
        brandId: 'brand_default',
        audience: {
          targetAudience,
          industry: 'Technology',
          language: 'English',
          tone,
        },
        imageSettings: {
          source: item.media_asset.type === 'video' ? 'ai_generated' : 'ai_generated',
          prompt: item.media_asset.prompt,
          imageUrl: item.media_asset.url,
        },
        schedule: {
          publishMode: 'now',
        },
        metadata: {
          goal,
          createdAt: new Date().toISOString(),
          clientVersion: '2.0.0',
        },
      });

      setDispatchedMap((prev) => ({ ...prev, [item.platform]: true }));
      assistant.addNotification({
        id: `dispatch_${item.platform}`,
        type: 'success',
        title: 'Publishing Completed',
        message: `Post dispatched and queued for ${item.platform}!`,
        source: 'Publishing Dispatch',
        progress: 100,
      });
    } catch (err: any) {
      assistant.addNotification({
        id: `dispatch_${item.platform}`,
        type: 'error',
        title: 'Publishing Failed',
        message: err?.message || `Failed to dispatch post for ${item.platform}.`,
        source: 'Publishing Dispatch',
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1180px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" /> FAST POST EXPRESS / INSTANT CREATOR
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight pt-1">Instant Post & Media Creator</h1>
          <p className="text-xs text-slate-400">
            Concurrently generates high-converting text copy and platform-tailored media assets (images or video prompts) simultaneously.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setRawIdea(''); setVariations(null); setIsGenerating(false); }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
        </div>
      </div>

      {/* Input Form Panel */}
      <form onSubmit={handleGenerate} className="bg-[#0F131E] border border-slate-800 p-6 rounded-3xl space-y-6 shadow-lg">
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-mono text-rose-300 flex items-center gap-2">
            <span className="font-bold">Generation Failed:</span> {errorMsg}
          </div>
        )}
        {/* Raw Idea Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> What&apos;s your raw idea or topic? <span className="text-rose-400">*</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">CONCURRENT MULTI-MODAL ENGINE</span>
          </label>
          <textarea
            rows={3}
            required
            value={rawIdea}
            onChange={(e) => setRawIdea(e.target.value)}
            placeholder="e.g. Launching an AI post creation studio that automatically renders text, images, and videos for 8 platforms with 1 click."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none transition-colors"
          />
        </div>

        {/* Goal, Audience, Tone row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Selected Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Founders & Marketers"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Selected Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Platforms Selection */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Target Platforms ({platforms.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS_LIST.map((p) => {
              const isSelected = platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isGenerating || !rawIdea.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-950/50 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sliders className="w-4 h-4 animate-spin text-cyan-300" /> Generating Text & Media Assets Concurrently...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" /> Generate Platform Content Instantly
              </>
            )}
          </button>
        </div>
      </form>

      {/* Output Grid: Platform Variations & Media Assets */}
      {variations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Generated Platform Content & Media Assets ({variations.length})
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
              CONCURRENT MULTI-MODAL PAYLOAD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variations.map((item, idx) => {
              const isDispatched = !!dispatchedMap[item.platform];
              const isCopied = copiedIndex === idx;
              const isVideo = item.media_asset.type === 'video';

              return (
                <div
                  key={item.platform}
                  className="bg-[#0F131E] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Platform Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                          {item.platform}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        {isVideo ? (
                          <>
                            <VideoIcon className="w-3 h-3 text-purple-400" /> VIDEO ASSET
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3 text-cyan-400" /> IMAGE ASSET
                          </>
                        )}
                      </span>
                    </div>

                    {/* Media Asset Preview Card */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 group bg-slate-950 aspect-[16/9] flex items-center justify-center">
                      {item.media_asset.url ? (
                        <img
                          src={item.media_asset.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          onLoad={() => {
                            if (process.env.NODE_ENV === 'development') {
                              console.log(`[ImageDiagnostic] Successfully loaded image for ${item.platform}:`, item.media_asset.url);
                            }
                          }}
                          onError={(e) => {
                            if (process.env.NODE_ENV === 'development') {
                              console.error(`[ImageDiagnostic] Failed to load image for ${item.platform}:`, item.media_asset.url);
                            }
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}

                      {/* Recreate Button Overlay */}
                      {!isVideo && (
                        <button
                          type="button"
                          onClick={() => handleRecreateImage(item.platform, item.media_asset.prompt, item.media_asset.url, idx)}
                          disabled={recreatingPlatform === item.platform}
                          className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black/90 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-xs disabled:opacity-50 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${recreatingPlatform === item.platform ? 'animate-spin text-cyan-400' : ''}`} />
                          <span>{recreatingPlatform === item.platform ? 'Recreating...' : 'Recreate Visual'}</span>
                        </button>
                      )}

                      {/* Video Play Overlay */}
                      {isVideo ? (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 ring-4 ring-purple-500/30">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-purple-300 bg-black/60 px-2 py-0.5 rounded border border-purple-500/30">
                            AI VIDEO SCRIPT PROMPT
                          </span>
                          <p className="text-[11px] text-slate-200 line-clamp-2 italic px-2">
                            &quot;{item.media_asset.prompt}&quot;
                          </p>
                        </div>
                      ) : (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 space-y-1 pointer-events-none">
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300">
                            <Wand2 className="w-3 h-3" /> AI GENERATED VISUAL PROMPT
                          </div>
                          <p className="text-[10px] text-slate-300 line-clamp-1 italic">
                            {item.media_asset.prompt}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Title Payload */}
                    <div className="text-sm font-extrabold text-white leading-snug pt-1">{item.title}</div>

                    {/* Body Payload */}
                    <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                      {item.body}
                    </div>

                    {/* CTA Payload */}
                    <div className="text-xs font-bold text-cyan-300 bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-800/30">
                      {item.cta}
                    </div>

                    {/* Hashtags Payload */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.hashtags.map((h) => (
                        <span key={h} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(item, idx)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Text
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isDispatched}
                      onClick={() => handleDispatchPlatform(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        isDispatched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/40 cursor-pointer'
                      }`}
                    >
                      {isDispatched ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Dispatch to Studio
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
