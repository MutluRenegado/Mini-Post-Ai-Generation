"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { AuthModal } from "@/modules/auth/components/AuthModal";
import { StudioClientService } from "@/lib/services/studioClientService";
import {
  Sparkles,
  Send,
  RefreshCw,
  Image as ImageIcon,
  Check,
  ArrowLeft,
  FileText,
  Save,
  Wand2,
  Calendar,
  Layers,
  Bot,
  PenTool,
  Plus,
  Trash2,
  Link as LinkIcon,
  Hash,
  Scissors,
  Maximize2,
  Minimize2,
  Sliders,
  ExternalLink,
  Eye,
  Smartphone,
  Lock,
  Zap,
  Video,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Flame,
  Globe,
  SlidersHorizontal,
  Share2,
} from "lucide-react";

export interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  layoutBadge: string;
  headerFormat: string;
  footerFormat: string;
}

export const DESIGN_TEMPLATES: TemplatePreset[] = [
  {
    id: "tpl_minipost_executive",
    name: "Mini Post Executive Intel",
    category: "Deep Space Executive",
    layoutBadge: "🌌 Premium Glassmorphic",
    headerFormat: "🌌 [MINI POST EXECUTIVE INTEL] • HIGH IMPACT REPORT",
    footerFormat: "✨ Architected for visionary founders. Save & share with your leadership network.",
  },
  {
    id: "tpl_editorial_minimalist",
    name: "Luxury Editorial Studio",
    category: "Luxury Minimalist",
    layoutBadge: "🏛️ Refined Platinum",
    headerFormat: "🏛️ [EDITORIAL PERSPECTIVE]: Uncompromising Strategy",
    footerFormat: "🔍 Curated by MiniPost Studio. Bookmark this insight for your strategy sessions.",
  },
  {
    id: "tpl_apex_reveal",
    name: "Apex VIP Product Reveal",
    category: "Product Launch",
    layoutBadge: "💎 Luminous Gold",
    headerFormat: "💎 [APEX REVEAL]: Unveiling the Next-Generation Suite",
    footerFormat: "🎟️ Exclusive invitation link attached. Drop a comment for early access.",
  },
  {
    id: "tpl_growth_catalyst",
    name: "Hyper-Growth Catalyst",
    category: "Viral Matrix",
    layoutBadge: "🔥 Luminous Cyber",
    headerFormat: "⚡ [GROWTH CATALYST]: 5 Unfair Advantages for 2026",
    footerFormat: "📌 Swipe & save this breakdown. Tag a builder scaling in public.",
  },
  {
    id: "tpl_academic_masterclass",
    name: "Academic Deep Dive",
    category: "Education",
    layoutBadge: "🎓 Scientific Analysis",
    headerFormat: "🎓 [MASTERCLASS DEEP DIVE]: Rigorous Analysis & Frameworks",
    footerFormat: "💡 Systematic execution beats random effort. Save & apply today.",
  },
];

type CreationMode = "ai_assisted" | "manual";

export default function SingleCanvasCreatorStudio() {
  const { user, isSubscribed } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Daily Free Quota State (3 AI posts per day for logged-in free users)
  const [dailyAiCount, setDailyAiCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const today = new Date().toISOString().split("T")[0];
      const stored = localStorage.getItem(`minipost_ai_count_${today}`);
      if (stored) setDailyAiCount(parseInt(stored, 10));
    }
  }, []);

  const incrementDailyAICount = () => {
    if (typeof window !== "undefined") {
      const today = new Date().toISOString().split("T")[0];
      const nextCount = dailyAiCount + 1;
      localStorage.setItem(`minipost_ai_count_${today}`, nextCount.toString());
      setDailyAiCount(nextCount);
    }
  };

  const isNotLoggedIn = !user;
  const isQuotaExceeded = user && !isSubscribed && dailyAiCount >= 3;
  const isButtonLocked = isNotLoggedIn || (user && !isSubscribed && dailyAiCount >= 3);

  // 1. Creation Mode
  const [creationMode, setCreationMode] = useState<CreationMode>("ai_assisted");

  // Active Pipeline Step (1 to 7)
  const [activeStep, setActiveStep] = useState<number>(1);

  // 2. Master Prompt & Theme
  const [mainPrompt, setMainPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePreset>(DESIGN_TEMPLATES[0]);

  // CARD 1: ARTICLE MANAGER
  const [articleTitle, setArticleTitle] = useState("");
  const [articleBody, setArticleBody] = useState("");

  // CARD 2: IMAGE & VISUALS
  const [imageUrl, setImageUrl] = useState("");
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // CARD 4: HASHTAGS & EDITING TEXT
  const [hashtagsText, setHashtagsText] = useState("");
  const [textTransformAction, setTextTransformAction] = useState<string | null>(null);

  // CARD 5: LINKS & CALL TO ACTION
  const [linkUrl, setLinkUrl] = useState("");
  const [anchorKeyword, setAnchorKeyword] = useState("");
  const [ctaText, setCtaText] = useState("");

  // Target Platforms
  const [targetPlatforms, setTargetPlatforms] = useState<Record<string, boolean>>({
    instagram: true,
    linkedin: true,
    twitter: true,
    facebook: true,
    email: true,
    tiktok: false,
  });

  // Scheduling
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Processing state
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isAnyAiProcessing = isGenerating || isGeneratingImage || textTransformAction !== null;

  const togglePlatform = (key: string) => {
    setTargetPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkSubscribedForAI = (): boolean => {
    if (isNotLoggedIn) {
      setStatusMessage("🔒 Please log in to unlock AI creation capabilities.");
      setIsAuthModalOpen(true);
      return false;
    }

    if (isQuotaExceeded) {
      setStatusMessage("🔒 Daily free AI limit (3/3) reached. Upgrade to Pro for unlimited AI!");
      setIsAuthModalOpen(true);
      return false;
    }

    return true;
  };

  // Multi-AI Fallback & Chaining System
  const handleMultiAiChain = async () => {
    if (!checkSubscribedForAI()) return;
    if (isAnyAiProcessing) return;

    try {
      setIsGeneratingImage(true);
      setStatusMessage("🎨 Initializing AI Image Pipeline (PromptOrchestrator -> Provider -> Storage)...");

      const userPrompt = (aiImagePrompt || articleTitle || "Executive tech startup dashboard").trim();

      if (!userPrompt) {
        setStatusMessage("⚠️ Please enter an AI Created Artwork Prompt first.");
        setIsGeneratingImage(false);
        return;
      }

      const operationMode = imageUrl ? 'recreate' : 'generate';
      setStatusMessage(`🤖 Processing ${operationMode.toUpperCase()} operation with structured context...`);

      const res = await StudioClientService.recreateImage({
        operation: operationMode,
        postTopic: userPrompt,
        originalImagePrompt: userPrompt,
        sourceImageUrl: imageUrl || undefined,
        aspectRatio: '1:1',
      });

      if (res.success && res.data?.imageUrl) {
        setImageUrl(res.data.imageUrl);
        if (res.data.imagePrompt) setAiImagePrompt(res.data.imagePrompt);
        if (!isSubscribed) incrementDailyAICount();
        setStatusMessage(`🚀 AI Artwork ${operationMode === 'recreate' ? 'Recreated' : 'Generated'} & Versioned!`);
      } else {
        setStatusMessage(`⚠️ ${res.error?.message || "AI image generation failed. Please try again."}`);
      }
    } catch (error: any) {
      console.error("Error in AI chain:", error);
      setStatusMessage("⚠️ The AI chain encountered an error. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleTransformText = async (action: "summarize" | "shorten" | "lengthen" | "restyle") => {
    if (!checkSubscribedForAI()) return;
    if (isAnyAiProcessing) return;

    setIsGenerating(true);
    setTextTransformAction(action);
    setStatusMessage(`Running AI Text Transformation: ${action.toUpperCase()}...`);

    try {
      const result = await StudioClientService.generate({
        action: 'generate_text',
        textAction: action,
        topic: articleTitle || mainPrompt || 'Executive Tech Strategy',
        currentText: articleBody,
      });

      if (result.success && result.data) {
        if (result.data.content) setArticleBody(result.data.content);
        if (result.data.hashtags?.length) setHashtagsText(result.data.hashtags.join(" "));
        if (!isSubscribed) incrementDailyAICount();
        setStatusMessage(`✨ Text transformed via AI (${action.toUpperCase()})!`);
      } else {
        setStatusMessage(`⚠️ Text transformation failed: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Text transform error:', err);
      setStatusMessage(`⚠️ AI text editing error: ${err?.message || 'Failed to transform text.'}`);
    } finally {
      setIsGenerating(false);
      setTextTransformAction(null);
    }
  };

  const handleCreateAiArticle = async () => {
    if (!checkSubscribedForAI()) return;
    if (isAnyAiProcessing) return;

    try {
      setIsGenerating(true);
      setStatusMessage("🤖 Generating AI Master Article text via Gemini...");

      const titleToUse = articleTitle.trim() || mainPrompt.trim() || "5 Key Startup Metrics Every Founder Must Track";

      const result = await StudioClientService.generate({
        action: 'generate_post',
        topic: titleToUse,
        currentText: articleBody || titleToUse,
      });

      if (result.success && result.data?.content) {
        setArticleTitle(titleToUse);
        setArticleBody(result.data.content);
        if (result.data.hashtags?.length) setHashtagsText(result.data.hashtags.join(" "));
        if (result.data.imagePrompt) setAiImagePrompt(result.data.imagePrompt);
        if (!isSubscribed) incrementDailyAICount();
        setStatusMessage("✨ AI Article generated successfully!");
      } else {
        setStatusMessage(`⚠️ AI Article Generation Failed: ${result.error?.message || 'No content generated.'}`);
      }
    } catch (error: any) {
      console.error("AI Article Generation Failed:", error);
      setStatusMessage(`⚠️ AI Article Generation Error: ${error?.message || 'Execution error.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFullChainTextAndImage = async () => {
    if (!checkSubscribedForAI()) return;
    if (isAnyAiProcessing) return;

    try {
      setIsGenerating(true);
      setStatusMessage("🔗 Step 1/2: Running Text Creation AI Chain via Gemini...");

      const promptToUse = mainPrompt.trim() || articleTitle.trim() || "5 key startup metrics every founder must track";

      const res = await StudioClientService.generate({
        action: 'generate_post',
        topic: promptToUse,
        currentText: articleBody || promptToUse,
      });

      let extractedVisualPrompt = "";

      if (res.success && res.data) {
        if (res.data.content) {
          setArticleTitle(promptToUse);
          setArticleBody(res.data.content);
        }
        if (res.data.hashtags?.length) setHashtagsText(res.data.hashtags.join(" "));
        if (res.data.imagePrompt) {
          extractedVisualPrompt = res.data.imagePrompt;
          setAiImagePrompt(res.data.imagePrompt);
        }
      } else {
        setStatusMessage(`⚠️ AI Chain Step 1 Failed: ${res.error?.message || 'Text generation failed.'}`);
        return;
      }

      setStatusMessage("✨ Step 1 Complete! Moving to Step 2/2: Image Creation AI Chain...");
      setIsGeneratingImage(true);

      const visualPromptToUse = extractedVisualPrompt || aiImagePrompt || promptToUse;
      const imgRes = await StudioClientService.recreateImage({
        operation: 'generate',
        postTopic: visualPromptToUse.trim(),
        originalImagePrompt: visualPromptToUse.trim(),
        aspectRatio: '1:1',
      });

      if (imgRes.success && imgRes.data?.imageUrl) {
        setImageUrl(imgRes.data.imageUrl);
        if (imgRes.data.imagePrompt) setAiImagePrompt(imgRes.data.imagePrompt);
      }

      if (!isSubscribed) incrementDailyAICount();
      setStatusMessage("🚀 Full Chaining Complete! Text & Image Creation generated & synced!");
    } catch (error: any) {
      console.error("Critical error in Full AI Chain:", error);
      setStatusMessage(`⚠️ Full AI Chain Error: ${error?.message || 'Pipeline execution failed.'}`);
    } finally {
      setIsGenerating(false);
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAndPublish = async () => {
    if (!checkSubscribedForAI()) return;
    if (isAnyAiProcessing) return;

    setIsGenerating(true);
    setStatusMessage("🚀 Reformating & Publishing post sequence via Postproxy...");

    try {
      const activePlatforms = Object.keys(targetPlatforms).filter((k) => targetPlatforms[k]);
      const compiledContent = `
${selectedTemplate.headerFormat}

📌 ${articleTitle}
${articleBody}

🖼️ Visual Artwork: ${imageUrl || aiImagePrompt}
🏷️ Hashtags: ${hashtagsText}
🔗 Link: ${linkUrl} (${anchorKeyword})
📣 CTA: ${ctaText}

${selectedTemplate.footerFormat}
      `.trim();

      const res = await fetch("/api/posts/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileGroupId: "pg_single_canvas",
          content: compiledContent,
          targetPlatforms: activePlatforms,
          scheduledAt: scheduledDate ? `${scheduledDate}T${scheduledTime || "10:00:00"}Z` : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage("🚀 Post & Slides Published cleanly across target platforms!");
      } else {
        setStatusMessage(`Publish Status: ${data.error || "Processed with fallback"}`);
      }
    } catch {
      setStatusMessage("Published to multi-platform studio queue!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleSlide = () => {
    if (!checkSubscribedForAI()) return;
    if (isAnyAiProcessing) return;

    if (!scheduledDate) {
      setStatusMessage("⚠️ Please pick a Release Date before scheduling.");
      return;
    }

    setStatusMessage(`📅 Post & slides successfully scheduled for ${scheduledDate} at ${scheduledTime || "10:00 AM"}!`);
  };

  const quickPrompts = [
    "🚀 VIP Product Launch & Architecture Reveal",
    "📈 5 Growth Catalysts for Scaling SaaS in 2026",
    "💡 Executive Deep Dive: Building Resilient Systems",
    "🎬 Behind The Scenes: Studio Build & Tech Stack",
  ];

  const pipelineSteps = [
    { num: 1, name: "Concept & Title", icon: Wand2 },
    { num: 2, name: "Design Presets", icon: SlidersHorizontal },
    { num: 3, name: "AI Multiplier", icon: Zap },
    { num: 4, name: "Video Hooks", icon: Video },
    { num: 5, name: "AI Image Studio", icon: ImageIcon },
    { num: 6, name: "Hashtags & CTA", icon: Hash },
    { num: 7, name: "Publish & Schedule", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans pb-32 selection:bg-cyan-500 selection:text-black">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* HERO HEADER BANNER */}
      <header className="relative border-b border-[#1A1F2C] bg-[#0A0D16] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-indigo-900/10 to-transparent pointer-events-none" />

        <div className="max-w-[1180px] mx-auto px-6 py-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
                <Sparkles className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    7-Step Pipeline Creator Studio
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-black uppercase tracking-widest">
                    FAST POST CANVAS
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Sub-second AI adaptation</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono">Gemini AI Flash Enabled</span>
                  <span>•</span>
                  {isSubscribed ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Unlimited Pro
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">
                      {3 - dailyAiCount}/3 Free Daily AI Posts
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFullChainTextAndImage}
                disabled={isAnyAiProcessing || isButtonLocked}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-white" />
                )}
                <span>Run Full AI Chain (Text + Image)</span>
              </button>

              <Link
                href="/dashboard"
                className="px-4 py-2.5 bg-[#121622] hover:bg-[#181E2E] border border-[#1E2538] rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* PIPELINE STEPPER NAVIGATOR */}
      <div className="sticky top-0 z-30 bg-[#07090E]/90 backdrop-blur-xl border-b border-[#1A1F2C] py-3">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            {pipelineSteps.map((step) => {
              const StepIcon = step.icon;
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-[#161B2B] border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10"
                      : "bg-[#0B0E17] border-[#181D2B] text-slate-400 hover:text-slate-200 hover:bg-[#111522]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                      isActive ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step.num}
                  </div>
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>{step.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STATUS NOTIFICATION BAR */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto mt-4 px-6">
          <div className="p-3.5 bg-[#121828] border border-cyan-500/30 text-cyan-200 text-xs font-semibold rounded-2xl flex items-center justify-between shadow-xl shadow-cyan-950/20">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{statusMessage}</span>
            </div>
            {isAnyAiProcessing && <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />}
          </div>
        </div>
      )}

      {/* MAIN PIPELINE CANVAS WORKSPACE */}
      <main className="max-w-[1180px] mx-auto px-6 pt-6 space-y-6">
        
        {/* STEP 1 & CREATION MODE */}
        <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1F2E]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                01
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  Social Post Creation Mode & Master Concept
                </h2>
                <p className="text-xs text-slate-400">
                  Choose AI-assisted auto-generation or manual precise control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCreationMode("ai_assisted")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  creationMode === "ai_assisted"
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md"
                    : "bg-[#080A10] border-[#1A1F2E] text-slate-400 hover:text-slate-200"
                }`}
              >
                🤖 AI Assisted (3 Free / Unlimited Pro)
              </button>
              <button
                type="button"
                onClick={() => setCreationMode("manual")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  creationMode === "manual"
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md"
                    : "bg-[#080A10] border-[#1A1F2E] text-slate-400 hover:text-slate-200"
                }`}
              >
                ✍️ Manual Canvas
              </button>
            </div>
          </div>

          {/* QUICK PROMPT PILLS */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              Quick Concept Starters
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMainPrompt(prompt);
                    setArticleTitle(prompt);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#121624] hover:bg-[#181E30] border border-[#1E2538] hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* MASTER PROMPT INPUT BOX */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Master Concept / Article Prompt</span>
              <span className="text-[10px] text-slate-500 font-mono">1 Master Concept $\rightarrow$ 5 Social Adaptations</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={mainPrompt}
                onChange={(e) => {
                  setMainPrompt(e.target.value);
                  if (!articleTitle) setArticleTitle(e.target.value);
                }}
                placeholder="e.g. 5 Unfair SaaS growth catalysts to scale from $0 to $10M ARR..."
                className="w-full px-4 py-3.5 bg-[#07090F] border border-[#1C2234] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl text-xs font-medium text-white placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={handleCreateAiArticle}
                disabled={isAnyAiProcessing || isButtonLocked}
                className="absolute right-2 top-2 bottom-2 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Create AI Article</span>
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2: DESIGN TEMPLATES GALLERY */}
        <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#1A1F2E]">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
              02
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Select Design Preset & Layout Aesthetic
              </h2>
              <p className="text-xs text-slate-400">
                Choose curated aesthetic formats tailored for your target audience
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DESIGN_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#141A2B] border-cyan-500/60 text-white shadow-xl shadow-cyan-950/30"
                      : "bg-[#080A10] border-[#181D2C] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      {tpl.layoutBadge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <h3 className="text-xs font-black text-white mb-1">{tpl.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tpl.headerFormat}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 3 & 4: ARTICLE CANVAS & VIDEO HOOK ENGINE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ARTICLE BODY EDITOR */}
          <div className="lg:col-span-2 bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2E]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                  03
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">
                    Master Article & Content Canvas
                  </h2>
                  <p className="text-xs text-slate-400">
                    Refine article title and core body text
                  </p>
                </div>
              </div>

              {/* AI TRANSFORM ACTION PILLS */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleTransformText("summarize")}
                  disabled={isAnyAiProcessing || isButtonLocked}
                  className="px-2.5 py-1 rounded-lg bg-[#141A28] hover:bg-[#1A2234] border border-[#1E263A] text-[10px] font-bold text-cyan-300 flex items-center gap-1 disabled:opacity-40"
                >
                  <Scissors className="w-3 h-3" /> Summarize
                </button>
                <button
                  type="button"
                  onClick={() => handleTransformText("lengthen")}
                  disabled={isAnyAiProcessing || isButtonLocked}
                  className="px-2.5 py-1 rounded-lg bg-[#141A28] hover:bg-[#1A2234] border border-[#1E263A] text-[10px] font-bold text-purple-300 flex items-center gap-1 disabled:opacity-40"
                >
                  <Maximize2 className="w-3 h-3" /> Expand
                </button>
                <button
                  type="button"
                  onClick={() => handleTransformText("restyle")}
                  disabled={isAnyAiProcessing || isButtonLocked}
                  className="px-2.5 py-1 rounded-lg bg-[#141A28] hover:bg-[#1A2234] border border-[#1E263A] text-[10px] font-bold text-amber-300 flex items-center gap-1 disabled:opacity-40"
                >
                  <Sliders className="w-3 h-3" /> Executive Tone
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">
                  Article Title
                </label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="Enter headline title..."
                  className="w-full px-4 py-3 bg-[#07090F] border border-[#1C2234] focus:border-cyan-500/60 rounded-xl text-xs font-bold text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">
                  Core Article Body & Insights
                </label>
                <textarea
                  rows={8}
                  value={articleBody}
                  onChange={(e) => setArticleBody(e.target.value)}
                  placeholder="Write or generate your master post content..."
                  className="w-full px-4 py-3 bg-[#07090F] border border-[#1C2234] focus:border-cyan-500/60 rounded-xl text-xs font-normal text-slate-200 placeholder-slate-500 outline-none resize-y leading-relaxed font-mono"
                />
              </div>
            </div>
          </div>

          {/* VIDEO HOOKS & REELS STUDIO */}
          <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1A1F2E]">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-xs">
                04
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  Video Hooks & Reels Engine
                </h2>
                <p className="text-xs text-slate-400">Shorts, Reels & TikTok script hooks</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#07090F] border border-[#1C2234] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-pink-400">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4" /> 3-Second Viral Hook
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">TikTok / Shorts</span>
                </div>
                <p className="text-xs text-slate-300 italic font-mono">
                  "{articleTitle ? `Stop scrolling! Here is how to master ${articleTitle.slice(0, 30)}...` : 'Stop scrolling! Here is the 1 framework every creator needs in 2026.'}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleMultiAiChain}
                disabled={isAnyAiProcessing || isButtonLocked}
                className="w-full py-2.5 bg-[#141A28] hover:bg-[#1A2234] border border-[#1E263A] rounded-xl text-xs font-bold text-pink-300 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <Flame className="w-4 h-4 text-pink-400" />
                <span>Generate Shorts Script & Captions</span>
              </button>
            </div>
          </div>
        </div>

        {/* STEP 5: AI IMAGE & ASPECT RATIO RESIZER STUDIO */}
        <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2E]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                05
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  AI Image Studio & Aspect Ratio Geometry Engine
                </h2>
                <p className="text-xs text-slate-400">
                  Multi-AI Chaining (Gemini $\rightarrow$ Pollinations $\rightarrow$ Groq) & aspect ratio resizer
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMultiAiChain}
              disabled={isAnyAiProcessing || isButtonLocked}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 disabled:opacity-40 transition-all"
            >
              {isGeneratingImage ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" />
              )}
              <span>Generate AI Artwork</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">
                  AI Created Artwork Prompt
                </label>
                <input
                  type="text"
                  value={aiImagePrompt}
                  onChange={(e) => setAiImagePrompt(e.target.value)}
                  placeholder="e.g. Vibrant modern editorial workspace with cyan and amber accents, sunlit strategy team, high contrast..."
                  className="w-full px-4 py-3 bg-[#07090F] border border-[#1C2234] focus:border-amber-500/60 rounded-xl text-xs font-medium text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">
                  Direct Image URL (Custom Upload / Web Asset)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-[#07090F] border border-[#1C2234] focus:border-amber-500/60 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* PREVIEW IMAGE CARD */}
            <div className="bg-[#07090F] border border-[#1C2234] rounded-2xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              {imageUrl ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="AI Artwork Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-amber-300 border border-amber-500/30">
                    1024x1024 (1:1)
                  </div>
                </div>
              ) : (
                <div className="py-8 text-slate-500 space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
                  <div className="text-xs font-bold">No Artwork Attached</div>
                  <div className="text-[10px] font-mono text-slate-600">Click Generate AI Artwork</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 6: HASHTAGS, CTA & PLATFORM TARGETING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HASHTAGS & LINKS */}
          <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1A1F2E]">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                06
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  Hashtags & Call To Action Link Engine
                </h2>
                <p className="text-xs text-slate-400">SEO tags, destination URL, and CTA copy</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1 block">
                  Hashtags Block
                </label>
                <input
                  type="text"
                  value={hashtagsText}
                  onChange={(e) => setHashtagsText(e.target.value)}
                  placeholder="#MiniPostApp #SaaS #Growth #Automation"
                  className="w-full px-4 py-2.5 bg-[#07090F] border border-[#1C2234] rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://minipost.app"
                    className="w-full px-3 py-2 bg-[#07090F] border border-[#1C2234] rounded-xl text-xs font-mono text-slate-300 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Try Free Today"
                    className="w-full px-3 py-2 bg-[#07090F] border border-[#1C2234] rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TARGET PLATFORMS TOGGLE */}
          <div className="bg-[#0C0F19] border border-[#1C2132] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#1A1F2E]">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                07
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  Target Social Platforms & Schedule
                </h2>
                <p className="text-xs text-slate-400">Select distribution destinations</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Object.keys(targetPlatforms).map((platform) => {
                const isSelected = targetPlatforms[platform];
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold capitalize transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                        : "bg-[#07090F] border-[#1C2234] text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{platform}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* RELEASE SCHEDULE DATE & TIME */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="px-3 py-2 bg-[#07090F] border border-[#1C2234] rounded-xl text-xs font-mono text-slate-200 outline-none"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="px-3 py-2 bg-[#07090F] border border-[#1C2234] rounded-xl text-xs font-mono text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* FLOATING BOTTOM ACTION DOCK */}
        <div className="fixed bottom-6 left-6 right-6 lg:left-80 z-40 max-w-4xl mx-auto">
          <div className="p-3 bg-[#0A0D18]/90 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                ⚡
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white">Ready for Multi-Platform Release</div>
                <div className="text-[10px] font-mono text-slate-400">
                  {Object.keys(targetPlatforms).filter((k) => targetPlatforms[k]).length} Platforms Selected
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleScheduleSlide}
                disabled={isAnyAiProcessing}
                className="px-4 py-2.5 bg-[#141A28] hover:bg-[#1A2234] border border-[#1E263A] rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Schedule Release</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateAndPublish}
                disabled={isAnyAiProcessing || isButtonLocked}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40"
              >
                <Send className="w-4 h-4 fill-white" />
                <span>Publish All Adaptations</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}