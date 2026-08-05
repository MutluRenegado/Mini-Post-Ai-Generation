'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  BarChart3,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Video,
  Film,
  Send,
  Wand2,
  Palette,
  Target,
  Megaphone,
  RefreshCw,
  SlidersHorizontal,
  Image as ImageIcon,
} from 'lucide-react';
import {
  FacebookPlatformService,
  FacebookGraphTokenStatus,
  FacebookPostTypeMetric,
  FacebookTemplatePreset,
  FacebookCampaignType,
  FacebookMultiAssetBundle,
} from './facebook.service';
import { RbacAuthGuard } from '@/lib/services/rbacAuthGuard';

interface FacebookPlatformViewProps {
  onBack?: () => void;
}

export function FacebookPlatformView({ onBack }: FacebookPlatformViewProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'multiAssetStudio' | 'postTypes' | 'templates' | 'analytics' | 'postingHours'>('multiAssetStudio');
  const [topic, setTopic] = useState('Build a $50k/mo Facebook Paid & Organic Growth Funnel');
  const [campaignType, setCampaignType] = useState<FacebookCampaignType>('lead_gen');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bundle, setBundle] = useState<FacebookMultiAssetBundle | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    handleGenerateBundle();
  }, []);

  const handleGenerateBundle = async () => {
    setIsGenerating(true);
    setDispatchStatus(null);
    try {
      const generated = await FacebookPlatformService.generateMultiAssetBundle(topic, campaignType);
      setBundle(generated);
    } catch (err: any) {
      console.error('Facebook bundle generation error:', err);
      setDispatchStatus(`Generation Error: ${err?.message || 'Failed to generate Facebook multi-asset campaign.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleScheduleDispatch = async () => {
    if (!bundle) return;
    const userContext = {
      userId: 'usr_current',
      role: 'editor' as const,
      tier: 'pro' as const,
      isSubscriptionActive: true,
    };

    if (!RbacAuthGuard.canPublish(userContext)) {
      setDispatchStatus('Permission Denied: Your role does not have publish access.');
      return;
    }

    const result = await FacebookPlatformService.scheduleMultiAssetBundle(bundle);

    if (result.success) {
      setDispatchStatus(`Successfully scheduled multi-asset Facebook campaign (Story + Reel + Feed)! Log ID: ${result.dispatchId}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-slate-400 font-mono text-sm animate-pulse">
        Loading Facebook AI Creation Studio...
      </div>
    );
  }

  const tokenStatus: FacebookGraphTokenStatus = FacebookPlatformService.getTokenStatus();
  const postTypeMetrics: FacebookPostTypeMetric[] = FacebookPlatformService.getPostTypeMetrics();
  const templates: FacebookTemplatePreset[] = FacebookPlatformService.getFacebookTemplates();
  const analytics = FacebookPlatformService.getFacebookAnalytics();
  const brandPalette = FacebookPlatformService.getBrandPalette();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-slate-100 space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0F131E] border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold">
              <Share2 className="w-4 h-4 text-blue-400" /> FACEBOOK AI CREATION STUDIO
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Facebook Multi-Format AI Pipeline</h1>
          <p className="text-xs text-slate-400">Simultaneous Story (9:16) + Reel Video + Feed Post generator with Meta Graph token monitoring.</p>
        </div>

        {/* Token Status Badge & Clean Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setTopic('Customs Clearance AI Automation'); setBundle(null); }}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            🧹 Clean Studio
          </button>
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-500/40" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Meta Graph API Status</div>
              <div className="text-xs font-bold text-emerald-400">{tokenStatus.pageName} ({tokenStatus.tokenExpiresInDays}d remaining)</div>
            </div>
          </div>
        </div>
      </div>

      {/* DISPATCH STATUS NOTIFICATION */}
      {dispatchStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{dispatchStatus}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar select-none">
        {[
          { id: 'multiAssetStudio', label: 'Multi-Asset AI Studio', icon: Wand2 },
          { id: 'postTypes', label: 'Post Types & Performance', icon: LayoutGrid },
          { id: 'templates', label: 'Facebook Templates', icon: Layers },
          { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
          { id: 'postingHours', label: 'Optimal Posting Windows', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MULTI-ASSET AI STUDIO (SIMULTANEOUS STORY + REEL + FEED POST) */}
      {activeTab === 'multiAssetStudio' && (
        <div className="space-y-6">
          {/* Campaign Strategy Controls */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-400" /> 1. Facebook Campaign Strategy & Topic
                </h3>
                <p className="text-xs text-slate-400">Select campaign type to generate synchronized Story + Reel + Feed assets simultaneously.</p>
              </div>

              <button
                type="button"
                onClick={handleGenerateBundle}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span>Generate Multi-Format Assets</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Campaign Topic / Core Thesis</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Facebook Campaign Type</label>
                <select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value as FacebookCampaignType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="lead_gen">Lead Generation Ad Campaign</option>
                  <option value="carousel_link">Carousel Link Traffic Post</option>
                  <option value="community_poll">Community Engagement Poll</option>
                  <option value="event_promo">Event Broadcast & Promotion</option>
                  <option value="longform_authority">Long-Form Authority Post</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3 SIMULTANEOUS FORMAT CARDS: STORY (9:16), REEL (9:16 VIDEO), FEED (4:5) */}
          {bundle && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CARD 1: STORY (9:16) */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" /> Story (9:16)
                    </span>
                    <span className="text-[9px] font-mono text-pink-400 bg-pink-950 border border-pink-800 px-2 py-0.5 rounded font-bold">24H VERTICAL</span>
                  </div>

                  <div className="w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="text-[10px] font-mono text-slate-400">{bundle.storyAsset.caption}</div>
                    <div className="p-2 bg-pink-500 text-black text-[10px] font-mono font-bold rounded-xl text-center shadow-lg shadow-pink-500/20">
                      {bundle.storyAsset.stickerCta}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(bundle.storyAsset.stickerCta, 'story')}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'story' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Story Sticker CTA</span>
                </button>
              </div>

              {/* CARD 2: REEL VIDEO (9:16 SCENE STORYBOARD) */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-purple-400" /> Reel (9:16 Video)
                    </span>
                    <span className="text-[9px] font-mono text-purple-400 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded font-bold">30S STORYBOARD</span>
                  </div>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {bundle.reelAsset.storyboard.map((sc) => (
                      <div key={sc.sceneIndex} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                        <div className="font-mono text-purple-300 font-bold">Scene {sc.sceneIndex}: {sc.heading} ({sc.durationSeconds}s)</div>
                        <div className="text-slate-300">"{sc.voiceoverScript}"</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(bundle.reelAsset.storyboard.map((s) => s.voiceoverScript).join('\n'), 'reel')}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'reel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Reel Voiceover Script</span>
                </button>
              </div>

              {/* CARD 3: FEED POST (4:5 / 1:1) */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Standard Feed Post (4:5)
                    </span>
                    <span className="text-[9px] font-mono text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded font-bold">FEED GRAPHIC</span>
                  </div>

                  <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
                    {bundle.feedAsset.imageUrl ? (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
                        <img
                          src={bundle.feedAsset.imageUrl}
                          alt={bundle.feedAsset.headline}
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            if (process.env.NODE_ENV === 'development') {
                              console.log('[ImageDiagnostic] Successfully loaded Facebook Feed image:', bundle.feedAsset.imageUrl);
                            }
                          }}
                          onError={(e) => {
                            if (process.env.NODE_ENV === 'development') {
                              console.error('[ImageDiagnostic] Failed to load Facebook Feed image:', bundle.feedAsset.imageUrl);
                            }
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : bundle.feedAsset.imageError ? (
                      <div className="p-2.5 bg-red-950/40 border border-red-800/60 rounded-xl text-[10px] text-red-400 font-mono">
                        ⚠️ Image Generation Info: {bundle.feedAsset.imageError}
                      </div>
                    ) : null}

                    <div className="text-xs font-bold text-white">{bundle.feedAsset.headline}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-3">{bundle.feedAsset.caption}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(bundle.feedAsset.caption, 'feed')}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === 'feed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Feed Caption</span>
                </button>
              </div>
            </div>
          )}

          {/* Dispatch Action */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" /> Dispatch Multi-Format Facebook Bundle
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">Dispatches Story, Reel, and Feed post to Facebook via PublishingDispatchService.</p>
            </div>

            <button
              type="button"
              onClick={handleScheduleDispatch}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Schedule Facebook Campaign Bundle</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: POST TYPES USED & METRICS */}
      {activeTab === 'postTypes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {postTypeMetrics.map((item, idx) => (
            <div key={idx} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${item.color}`}>
                  {item.type}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{item.usageCount} Posts</span>
              </div>
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Avg Engagement Rate:</span>
                  <span className="font-bold text-white">{item.avgEngagementRate}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Avg Click-Through Rate:</span>
                  <span className="font-bold text-cyan-400">{item.avgCTR}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: FACEBOOK TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <div key={tmpl.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{tmpl.category}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-400">
                    {tmpl.aspectRatio}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{tmpl.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{tmpl.recommendedFor}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(tmpl.name, tmpl.id)}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-4"
              >
                {copiedId === tmpl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Use Template Specs</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ANALYTICS & INSIGHTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Reach</div>
              <div className="text-2xl font-black text-white">{analytics.totalReach}</div>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Impressions</div>
              <div className="text-2xl font-black text-cyan-400">{analytics.impressions}</div>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Engagement</div>
              <div className="text-2xl font-black text-emerald-400">{analytics.avgEngagementRate}</div>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Avg CTR</div>
              <div className="text-2xl font-black text-purple-400">{analytics.avgCTR}</div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Carousel Performance Insight</div>
                <div className="text-xs text-cyan-300 font-mono">{analytics.carouselVsSingleImageGain}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OPTIMAL POSTING WINDOWS */}
      {activeTab === 'postingHours' && (
        <div className="space-y-3">
          {analytics.bestPostingWindows.map((win, idx) => (
            <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{win.window}</div>
                <div className="text-xs text-slate-400 font-mono">{win.days}</div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold rounded-full">
                {win.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FacebookPlatformView;
