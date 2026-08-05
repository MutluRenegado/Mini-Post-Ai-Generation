'use client';

import React, { useState, useEffect } from 'react';
import { ImageIcon, Wand2, Upload, FolderKanban, Sparkles, Search, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, Loader2, ShieldCheck, XCircle, Layers, Crop } from 'lucide-react';
import { ImageSourceOption, WizardFormData } from '../types/wizard.types';
import { ImageAssetResult } from '@/providers/canonical-image-model';
import { StockSearchQueryBuilder } from '@/lib/services/stockSearchQueryBuilder';
import { PostVisualBriefExtractor } from '@/lib/ai-image-generator/images/PostVisualBriefExtractor';
import { ImageValidationService, ValidationResult } from '@/lib/services/imageValidationService';
import { PlatformSizingManager } from '@/lib/services/platformSizingManager';
import { FinalPostAnalyzer } from '@/lib/ai-image-generator/images/finalPostAnalyzer';
import { VisualConceptGenerator } from '@/lib/ai-image-generator/images/visualConceptGenerator';
import { CompositionPlanner } from '@/lib/ai-image-generator/images/compositionPlanner';
import { MasterImagePromptBuilder } from '@/lib/ai-image-generator/images/masterImagePromptBuilder';
import { PromptRepairEngine } from '@/lib/ai-image-generator/images/promptRepairEngine';
import { ImageMakerLearningService } from '@/lib/ai-image-generator/images/imageMakerLearningService';

interface StepImagesProps {
  formData: WizardFormData;
  updateFormData: (fields: Partial<WizardFormData>) => void;
  errors: Record<string, string>;
}

const SOURCES: { id: ImageSourceOption; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'ai_generated', label: 'AI Generated', icon: Wand2, desc: 'Autonomous AI visual intelligence engine' },
  { id: 'pexels', label: 'Pexels', icon: ImageIcon, desc: 'Pexels stock photo search' },
  { id: 'pixabay', label: 'Pixabay', icon: ImageIcon, desc: 'Pixabay stock photo search' },
  { id: 'unsplash', label: 'Unsplash', icon: ImageIcon, desc: 'Unsplash stock photo search' },
  { id: 'stock', label: 'All Stock Providers', icon: Sparkles, desc: 'Federated search across all stock providers' },
  { id: 'upload', label: 'Upload Image', icon: Upload, desc: 'Upload custom image asset' },
  { id: 'asset_library', label: 'Asset Library', icon: FolderKanban, desc: 'Select existing media from library' },
];

export function StepImages({ formData, updateFormData, errors }: StepImagesProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiStageMessage, setAiStageMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [searchResults, setSearchResults] = useState<ImageAssetResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [providerStatuses, setProviderStatuses] = useState<Record<string, { status: string; error?: string }>>({});
  const [generatedBaseQuery, setGeneratedBaseQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const isStockMode = ['pexels', 'pixabay', 'unsplash', 'stock'].includes(formData.imageSource);

  // Derive base query from Visual Brief when post content exists
  useEffect(() => {
    const postText = formData.description || formData.topic;
    if (postText && postText.trim().length > 0) {
      try {
        const brief = PostVisualBriefExtractor.extract({
          operation: 'generate',
          postTopic: formData.topic || 'Social Media Post',
          postContent: postText,
          platform: formData.platforms[0] || 'LinkedIn',
        });
        const queryInfo = StockSearchQueryBuilder.buildQuery(brief, formData.queryRefinement);
        setGeneratedBaseQuery(queryInfo.generatedQuery);
      } catch (_) {
        setGeneratedBaseQuery(StockSearchQueryBuilder.sanitizeText(formData.topic || 'business technology'));
      }
    }
  }, [formData.description, formData.topic, formData.platforms]);

  // Run validation whenever selected asset changes
  useEffect(() => {
    if (formData.selectedImageAsset) {
      const res = ImageValidationService.validateAsset(formData.selectedImageAsset);
      setValidationResult(res);
    } else {
      setValidationResult(null);
    }
  }, [formData.selectedImageAsset]);

  // Compute non-destructive platform variants upon explicit confirmation
  useEffect(() => {
    if (formData.selectedImageAsset && formData.imageConfirmed) {
      const variants = PlatformSizingManager.generateVariants(
        formData.selectedImageAsset,
        formData.platforms as string[]
      );
      updateFormData({ imageVariants: variants });
    }
  }, [formData.imageConfirmed, formData.selectedImageAsset, formData.platforms]);

  // Select asset handler (resets confirmation state)
  const handleSelectAsset = (asset: ImageAssetResult) => {
    updateFormData({
      selectedImageAsset: asset,
      imageConfirmed: false,
      imageConfirmedAt: undefined,
      unsplashTracked: false,
      requiresServerStorage: asset.source === 'PIXABAY',
      imageVariants: undefined,
    });
  };

  // Execute unified stock search call via server API
  const handleStockSearch = async (pageNum = 1) => {
    if (isSearching) return;
    setIsSearching(true);
    setSearchError(null);

    const postText = formData.description || formData.topic || 'business';
    let queryToUse = generatedBaseQuery || StockSearchQueryBuilder.sanitizeText(postText);
    if (formData.queryRefinement) {
      queryToUse = `${queryToUse} ${formData.queryRefinement}`.trim().slice(0, 100);
    }

    const providerParam = formData.imageSource === 'stock' ? 'all' : formData.imageSource;

    try {
      const response = await fetch('/api/admin/stock/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search_stock_images',
          provider: providerParam,
          query: queryToUse,
          orientation: formData.stockOrientation || 'square',
          page: pageNum,
          perPage: 12,
          color: formData.stockColor,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Stock search failed with status ${response.status}`);
      }

      const data = await response.json();
      const newAssets: ImageAssetResult[] = data.assets || [];

      if (pageNum === 1) {
        setSearchResults(newAssets);
      } else {
        setSearchResults((prev) => [...prev, ...newAssets]);
      }

      setHasMore(data.hasMore || false);
      setPage(pageNum);
      if (data.providers) setProviderStatuses(data.providers);
    } catch (err: any) {
      setSearchError(err.message || 'Failed to complete stock image search.');
    } finally {
      setIsSearching(false);
    }
  };

  // Autonomous AI Image Generation Trigger using Levels 14–22 Visual Intelligence Pipeline
  const handleGenerateAi = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    setSearchError(null);

    try {
      const postContent = formData.description || formData.topic || 'Enterprise cloud security and AI monitoring';
      const targetPlatform = formData.platforms[0] || 'LinkedIn';
      const aspectRatio = formData.imageAspectRatio || '1:1';

      // 1. FinalPostAnalyzer -> VisualIntelligenceBrief
      setAiStageMessage('Analyzing post content & extracting visual intelligence...');
      const brief = FinalPostAnalyzer.analyze({
        postContent,
        platform: targetPlatform,
        brandContext: { brandId: 'brand_default', palette: ['#0284C7', '#0F172A'] },
      });

      // 2. VisualConceptGenerator -> Selected Concept
      setAiStageMessage('Generating visual concepts & selecting optimal idea...');
      const conceptRes = VisualConceptGenerator.generateConcepts(brief);
      const selectedConcept = conceptRes.selectedConcept;

      // 3. CompositionPlanner -> Selected Art Direction Plan
      setAiStageMessage('Planning composition, lighting, camera lens & safe zones...');
      const compRes = CompositionPlanner.planComposition(brief, selectedConcept);
      const selectedComp = compRes.selectedComposition;

      // 4. MasterImagePromptBuilder -> Master Prompt
      setAiStageMessage('Assembling 8K Master AI Prompt...');
      const masterPrompt = MasterImagePromptBuilder.buildPrompt(brief, selectedConcept, selectedComp, {
        userRefinement: formData.imagePrompt,
      });

      // 5. Prompt Validation & Repair
      setAiStageMessage('Auditing & repairing prompt structure...');
      const repairResult = PromptRepairEngine.repairPrompt(masterPrompt);
      const validatedPrompt = repairResult.repairedPrompt;

      // 6. Invoke Server-Side AI Generation Endpoint
      setAiStageMessage('Generating AI image via server-side engine...');
      const response = await fetch('/api/admin/stock/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: validatedPrompt.promptText,
          negativePrompt: validatedPrompt.negativePromptText,
          style: formData.imageStyle || 'modern-editorial',
          aspectRatio,
          seed: Math.floor(Math.random() * 1000000),
          briefId: brief.id,
          conceptId: selectedConcept.id,
          compositionPlanId: selectedComp.id,
          promptId: validatedPrompt.id,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `AI image generation failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiAsset: ImageAssetResult = data.asset;

      const updatedVersions = [aiAsset, ...(formData.aiVersions || [])];
      updateFormData({
        selectedImageAsset: aiAsset,
        aiVersions: updatedVersions,
        imageConfirmed: false,
        imageConfirmedAt: undefined,
        imageVariants: undefined,
      });
    } catch (err: any) {
      setSearchError(err.message || 'AI image generation failed.');
    } finally {
      setIsGeneratingAi(false);
      setAiStageMessage(null);
    }
  };

  // Explicit User Confirmation Handler
  const handleConfirmAsset = async () => {
    if (!formData.selectedImageAsset || isConfirming) return;
    setIsConfirming(true);

    const asset = formData.selectedImageAsset;
    let unsplashTracked = formData.unsplashTracked || false;

    // Trigger Unsplash download tracking ONLY on explicit confirmation
    if (asset.source === 'UNSPLASH' && asset.downloadLocation && !unsplashTracked) {
      try {
        await fetch('/api/admin/stock/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'track_unsplash_download',
            downloadLocation: asset.downloadLocation,
          }),
        }).catch(() => null);
        unsplashTracked = true;
      } catch (_) {
        // Non-blocking tracking notice
      }
    }

    const variants = PlatformSizingManager.generateVariants(asset, formData.platforms as string[]);

    updateFormData({
      imageConfirmed: true,
      imageConfirmedAt: new Date().toISOString(),
      unsplashTracked,
      requiresServerStorage: asset.source === 'PIXABAY',
      imageVariants: variants,
    });
    setIsConfirming(false);
  };

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file type. Please upload a PNG, JPEG, or WebP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadPreview(dataUrl);

      const uploadAsset: ImageAssetResult = {
        id: `upload_${Date.now()}`,
        source: 'USER_UPLOAD',
        kind: 'USER_UPLOAD',
        url: dataUrl,
        previewUrl: dataUrl,
        thumbnailUrl: dataUrl,
        width: 1920,
        height: 1080,
        aspectRatio: '1:1',
        mimeType: file.type,
        altText: file.name,
        creator: { name: 'User Upload' },
        sourcePage: '#',
        attribution: { text: 'Custom User Upload', url: '#' },
        license: 'User Provided Asset',
      };

      handleSelectAsset(uploadAsset);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-cyan-400" /> Step 7: Image & Visual Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Choose visual source: Autonomous AI Generation, Stock Providers (Pexels, Pixabay, Unsplash), Custom Upload, or Asset Library.
        </p>
      </div>

      {/* Source Cards Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {SOURCES.map((item) => {
          const Icon = item.icon;
          const isSelected = (formData.imageSource || 'ai_generated') === item.id;
          return (
            <div
              key={item.id}
              onClick={() => updateFormData({ imageSource: item.id })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/60 to-indigo-950/40 border-cyan-500/60 text-white shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-[#0F131E] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  {item.label}
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Asset Full Preview & Compliance Component */}
      {formData.selectedImageAsset && (
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-cyan-500/50 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Full Image Preview & Provider Compliance
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 uppercase">
                {formData.selectedImageAsset.source}
              </span>
              {formData.imageConfirmed ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/50 text-[10px] font-bold text-amber-400">
                  Pending Confirmation
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
              <img
                src={formData.selectedImageAsset.previewUrl || formData.selectedImageAsset.url}
                alt={formData.selectedImageAsset.altText}
                className="max-h-72 object-contain"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Creator / Photographer:</span>
                  <a
                    href={formData.selectedImageAsset.creator.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {formData.selectedImageAsset.creator.name}
                    {formData.selectedImageAsset.creator.url && <ExternalLink className="w-2.5 h-2.5" />}
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Dimensions & Aspect Ratio:</span>
                  <span className="font-mono text-white">
                    {formData.selectedImageAsset.width} x {formData.selectedImageAsset.height} ({formData.selectedImageAsset.aspectRatio})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Attribution Text:</span>
                <p className="text-slate-300 bg-slate-900 border border-slate-800 p-2 rounded-lg text-[11px] font-mono">
                  {formData.selectedImageAsset.attribution.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">License:</span>
                  <span className="text-slate-300 font-semibold">{formData.selectedImageAsset.license || 'Standard License'}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Source Page:</span>
                  <a
                    href={formData.selectedImageAsset.sourcePage || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View Source Page <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Validation Results */}
              {validationResult && (
                <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                  validationResult.isValid ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {validationResult.isValid ? <ShieldCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {validationResult.isValid ? 'Asset Security & Compliance Validated' : 'Validation Issues Detected'}
                  </div>
                  {validationResult.warnings.map((w, idx) => (
                    <div key={idx} className="text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" /> {w}
                    </div>
                  ))}
                  {validationResult.errors.map((e, idx) => (
                    <div key={idx} className="text-rose-400 font-semibold">
                      • {e}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {!formData.imageConfirmed ? (
                  <button
                    type="button"
                    disabled={isConfirming || (validationResult !== null && !validationResult.isValid)}
                    onClick={handleConfirmAsset}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {isConfirming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Confirm Image Selection
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateFormData({ imageConfirmed: false, imageVariants: undefined })}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs"
                  >
                    Edit Selection
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => updateFormData({ selectedImageAsset: undefined, imageConfirmed: false, imageVariants: undefined })}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Change Selection
                </button>
              </div>
            </div>
          </div>

          {/* Level 10: Non-Destructive Platform Variants Preview Section */}
          {formData.imageConfirmed && formData.imageVariants && formData.imageVariants.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <Layers className="w-4 h-4 text-cyan-400" /> Non-Destructive Platform Sizing Variants ({formData.imageVariants.length})
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Original Asset Unchanged</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.imageVariants.map((v) => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white font-bold text-[11px]">
                      <span>{v.platform}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                        {v.aspectRatio}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{v.preset}</div>
                    <div className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Crop className="w-3 h-3 text-cyan-400" /> {v.width}x{v.height} px
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px]">
                      <span className="text-emerald-400 font-mono flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                      </span>
                      {v.crop && (
                        <span className="text-slate-500 font-mono">
                          Crop: {v.crop.width}x{v.crop.height}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stock Image Search Subform */}
      {isStockMode && (
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
              <Search className="w-4 h-4 text-cyan-400" /> Server-Side Stock Photo Search (
              {formData.imageSource.toUpperCase()})
            </div>
            {generatedBaseQuery && (
              <span className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
                Base Query: <strong className="text-cyan-300">{generatedBaseQuery}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-200">Query Refinement</label>
              <input
                type="text"
                value={formData.queryRefinement || ''}
                onChange={(e) => updateFormData({ queryRefinement: e.target.value })}
                placeholder="Optional refinement keywords (e.g. aerial view, minimal, daylight)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-200">Orientation</label>
              <select
                value={formData.stockOrientation || 'square'}
                onChange={(e) => updateFormData({ stockOrientation: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="square">Square (1:1)</option>
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (9:16)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={isSearching}
            onClick={() => handleStockSearch(1)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isSearching ? 'Searching Stock Catalog...' : 'Search Stock Photos'}
          </button>

          {/* Partial Failures / Status Alerts */}
          {Object.entries(providerStatuses).some(([_, s]) => s.status === 'error') && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Some stock providers encountered minor errors, showing available fallback results.</span>
            </div>
          )}

          {searchError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {searchError}
            </div>
          )}

          {/* Search Results Grid */}
          {searchResults.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300">Available Stock Photos ({searchResults.length})</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {searchResults.map((asset) => {
                  const isSelected = formData.selectedImageAsset?.id === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={asset.previewUrl || asset.url}
                        alt={asset.altText}
                        className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[9px] font-mono text-cyan-300 uppercase">
                        {asset.source}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-950/90 to-transparent text-[10px] text-slate-300 line-clamp-1 flex items-center justify-between">
                        <span>by {asset.creator.name}</span>
                        <a
                          href={asset.attribution.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-cyan-300"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <button
                  type="button"
                  onClick={() => handleStockSearch(page + 1)}
                  disabled={isSearching}
                  className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2"
                >
                  Load More Stock Photos
                </button>
              )}
            </div>
          )}

          {!isSearching && searchResults.length === 0 && !searchError && (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No stock photos loaded. Click "Search Stock Photos" to fetch visual options.
            </div>
          )}
        </div>
      )}

      {/* Autonomous AI Generation Subform (Default Mode) */}
      {(formData.imageSource === 'ai_generated' || !formData.imageSource) && (
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Autonomous AI Visual Intelligence Engine
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
              Default Auto-Mode
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">
              Visual Refinement / Guidance <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.imagePrompt || ''}
              onChange={(e) => updateFormData({ imagePrompt: e.target.value })}
              placeholder="e.g. Include cyan neon lighting accents, high contrast studio background"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[10px] text-slate-500">
              AI automatically extracts visual concepts, camera lens, lighting, and safe areas directly from your finalized post.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Image Style Preference</label>
              <select
                value={formData.imageStyle || 'modern-editorial'}
                onChange={(e) => updateFormData({ imageStyle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="modern-editorial">Modern Editorial</option>
                <option value="colourful-professional">Colourful Professional</option>
                <option value="bold-social">Bold Social</option>
                <option value="premium-lifestyle">Premium Lifestyle</option>
                <option value="modern-3d-editorial">Modern 3D Editorial</option>
                <option value="clean-infographic">Clean Infographic</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Aspect Ratio</label>
              <select
                value={formData.imageAspectRatio || '1:1'}
                onChange={(e) =>
                  updateFormData({
                    imageAspectRatio: e.target.value as any,
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 Portrait</option>
                <option value="9:16">9:16 Story / Reel</option>
                <option value="16:9">16:9 Landscape</option>
              </select>
            </div>
          </div>

          {aiStageMessage && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-cyan-400" />
              <span>{aiStageMessage}</span>
            </div>
          )}

          <button
            type="button"
            disabled={isGeneratingAi}
            onClick={handleGenerateAi}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGeneratingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {formData.selectedImageAsset?.kind === 'AI_GENERATED' ? 'Regenerate AI Image' : 'Generate Autonomous AI Image'}
          </button>
        </div>
      )}

      {/* Upload Mode Subform */}
      {formData.imageSource === 'upload' && (
        <div className="p-5 rounded-2xl bg-[#0F131E] border border-cyan-500/30 space-y-4">
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
            <Upload className="w-4 h-4 text-cyan-400" /> Custom Image Upload
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            className="text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
          />
          {uploadError && <p className="text-xs text-rose-400 font-semibold">{uploadError}</p>}
          {uploadPreview && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <img src={uploadPreview} alt="Upload preview" className="h-40 object-cover rounded-lg" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
