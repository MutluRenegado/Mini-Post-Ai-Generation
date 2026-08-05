'use client';

import React, { useState } from 'react';
import { VisualReference, ReviewStatus } from '../models/visual-reference.model';
import { X, Save, ShieldCheck, CheckCircle2, AlertTriangle, Eye, Sparkles } from 'lucide-react';

interface ImageDetailModalProps {
  reference: VisualReference;
  onClose: () => void;
  onSaveMetadata: (id: string, updates: Partial<VisualReference>) => Promise<void>;
  onUpdateRights: (id: string, rights: any) => Promise<void>;
  onSetReviewStatus: (id: string, status: ReviewStatus, notes?: string, reason?: string) => Promise<void>;
}

export function ImageDetailModal({
  reference,
  onClose,
  onSaveMetadata,
  onUpdateRights,
  onSetReviewStatus,
}: ImageDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'classification' | 'style' | 'rights' | 'review'>('basic');
  const [formData, setFormData] = useState<VisualReference>({ ...reference });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof VisualReference, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRightsChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      rights: {
        ...prev.rights,
        [field]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Save metadata updates
      await onSaveMetadata(formData.id, {
        title: formData.title,
        caption: formData.caption,
        description: formData.description,
        topic: formData.topic,
        industry: formData.industry,
        category: formData.category,
        scene: formData.scene,
        peoplePresent: formData.peoplePresent,
        peopleDescription: formData.peopleDescription,
        environment: formData.environment,
        photographyStyle: formData.photographyStyle,
        mood: formData.mood,
        lighting: formData.lighting,
        cameraAngle: formData.cameraAngle,
        composition: formData.composition,
      });

      // Save rights update
      await onUpdateRights(formData.id, formData.rights);

      setSuccessMessage('Metadata and Rights configuration updated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save reference details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // First save rights
      await onUpdateRights(formData.id, {
        ...formData.rights,
        rightsConfirmed: true,
        commercialUseReviewStatus: 'APPROVED',
      });

      // Then transition status
      await onSetReviewStatus(formData.id, 'APPROVED', formData.review.reviewerNotes);

      setFormData((prev) => ({
        ...prev,
        rights: { ...prev.rights, rightsConfirmed: true, commercialUseReviewStatus: 'APPROVED' },
        review: { ...prev.review, status: 'APPROVED' },
      }));

      setSuccessMessage('Reference image successfully APPROVED and rights confirmed!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Approval blocked due to missing rights confirmation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSetReviewStatus(formData.id, 'REJECTED', formData.review.reviewerNotes, 'Failed quality or rights criteria');
      setFormData((prev) => ({
        ...prev,
        review: { ...prev.review, status: 'REJECTED' },
      }));
      setSuccessMessage('Reference image marked REJECTED.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reject reference.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0C0F17] border border-[#1C2234] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1C2234] flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Image Detail & Metadata Editor
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              ID: {formData.id} • Checksum: {formData.checksum?.slice(0, 12)}...
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-950 border-b border-[#1C2234] flex items-center gap-2 text-xs font-mono select-none">
          {[
            { id: 'basic', label: 'Basic Info' },
            { id: 'classification', label: 'Classification' },
            { id: 'style', label: 'Visual Style' },
            { id: 'rights', label: 'Rights & Licensing' },
            { id: 'review', label: 'Review & Approval' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-t-xl transition-colors font-bold ${
                activeTab === tab.id
                  ? 'bg-[#0C0F17] text-cyan-400 border-t border-x border-[#1C2234]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-[#1C2234] flex items-center justify-center">
                  {formData.thumbnailPath ? (
                    <img src={formData.thumbnailPath} alt={formData.title} className="w-full h-full object-contain" />
                  ) : (
                    <Eye className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-400">
                  <div>• Original File: {formData.originalFileName}</div>
                  <div>• Dimensions: {formData.width} x {formData.height} ({formData.orientation})</div>
                  <div>• Aspect Ratio: {formData.aspectRatio}</div>
                  <div>• Size: {(formData.fileSizeBytes / 1024).toFixed(1)} KB</div>
                  <div>• pHash: {formData.perceptualHash}</div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Caption</label>
                  <input
                    type="text"
                    value={formData.caption || ''}
                    onChange={(e) => handleInputChange('caption', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLASSIFICATION */}
          {activeTab === 'classification' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="e.g. Technology, Finance, Healthcare"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Topic</label>
                <input
                  type="text"
                  value={formData.topic || ''}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="e.g. Cloud Security, International Trade"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Scene Description</label>
                <input
                  type="text"
                  value={formData.scene || ''}
                  onChange={(e) => handleInputChange('scene', e.target.value)}
                  placeholder="e.g. Sunlit executive meeting room"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Environment</label>
                <input
                  type="text"
                  value={formData.environment || ''}
                  onChange={(e) => handleInputChange('environment', e.target.value)}
                  placeholder="e.g. Modern daylit office"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL STYLE */}
          {activeTab === 'style' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Photography Style</label>
                <input
                  type="text"
                  value={formData.photographyStyle || ''}
                  onChange={(e) => handleInputChange('photographyStyle', e.target.value)}
                  placeholder="e.g. Modern Editorial, Photorealistic"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Lighting</label>
                <input
                  type="text"
                  value={formData.lighting || ''}
                  onChange={(e) => handleInputChange('lighting', e.target.value)}
                  placeholder="e.g. Soft natural sunlight"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Camera Angle</label>
                <input
                  type="text"
                  value={formData.cameraAngle || ''}
                  onChange={(e) => handleInputChange('cameraAngle', e.target.value)}
                  placeholder="e.g. Eye level, Slight low angle"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Composition</label>
                <input
                  type="text"
                  value={formData.composition || ''}
                  onChange={(e) => handleInputChange('composition', e.target.value)}
                  placeholder="e.g. Rule of thirds, Centered subject"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: RIGHTS & LICENSING */}
          {activeTab === 'rights' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                ⚠️ <strong>Rights Confirmation Rule:</strong> All rights fields must be verified before this image can be Approved or retrieved by Visual Intelligence.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Rights Confirmed</label>
                  <select
                    value={String(formData.rights.rightsConfirmed)}
                    onChange={(e) => handleRightsChange('rightsConfirmed', e.target.value === 'true')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  >
                    <option value="false">Unconfirmed / Pending Review</option>
                    <option value="true">Confirmed Valid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Source Provider</label>
                  <input
                    type="text"
                    value={formData.rights.sourceProvider || ''}
                    onChange={(e) => handleRightsChange('sourceProvider', e.target.value)}
                    placeholder="e.g. Unsplash, Internal Studio, Licensed Stock"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Licence Type</label>
                  <input
                    type="text"
                    value={formData.rights.licenceType || ''}
                    onChange={(e) => handleRightsChange('licenceType', e.target.value)}
                    placeholder="e.g. Commercial Free, Royalty Free"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Commercial Use Status</label>
                  <select
                    value={formData.rights.commercialUseReviewStatus}
                    onChange={(e) => handleRightsChange('commercialUseReviewStatus', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEW & APPROVAL */}
          {activeTab === 'review' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-slate-300">
                <div>Current Review Status: <strong className="text-cyan-400">{formData.review.status}</strong></div>
                <div>Reviewer: {formData.review.reviewerId || 'admin'}</div>
                <div>Last Review Date: {formData.review.reviewedAt || 'N/A'}</div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reviewer Notes</label>
                <textarea
                  rows={3}
                  value={formData.review.reviewerNotes || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      review: { ...prev.review, reviewerNotes: e.target.value },
                    }))
                  }
                  placeholder="Notes regarding image quality, prompt suitability, or rights approval..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                >
                  Confirm Rights & Approve Reference
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 font-bold hover:bg-rose-900 transition-colors"
                >
                  Reject Reference
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1C2234] bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            {formData.classificationState === 'MANUALLY_REVIEWED' ? '✓ Manually Reviewed' : '⚡ Suggested Classifier Mode'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
