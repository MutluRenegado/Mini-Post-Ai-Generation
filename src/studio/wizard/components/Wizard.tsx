'use client';

import React, { useState, useEffect } from 'react';
import { WizardFormData } from '../types/wizard.types';
import { WizardStorageService } from '../services/wizard-storage.service';
import { WizardValidationService } from '../services/wizard-validation.service';
import { CreatorWizardMainService } from '../services/wizard.service';
import { WizardHeader } from './WizardHeader';
import { WizardProgress } from './WizardProgress';
import { WizardFooter } from './WizardFooter';
import { WizardSidebar } from './WizardSidebar';
import { StepPostGoal } from './StepPostGoal';
import { StepContent } from './StepContent';
import { StepAudience } from './StepAudience';
import { StepPlatforms } from './StepPlatforms';
import { StepTemplate } from './StepTemplate';
import { StepBrand } from './StepBrand';
import { StepImages } from './StepImages';
import { StepSchedule } from './StepSchedule';
import { StepReview } from './StepReview';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

import { useStudioAssistant } from '@/studio/assistant/StudioAssistantContext';

interface WizardProps {
  onCancel: () => void;
  onSuccess?: (requestId: string) => void;
}

export function Wizard({ onCancel, onSuccess }: WizardProps) {
  const assistant = useStudioAssistant();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(() => {
    const saved = WizardStorageService.loadDraft();
    return saved ? { ...WizardStorageService.getDefaultFormData(), ...saved } : WizardStorageService.getDefaultFormData();
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string>('');

  // Auto-save draft on data change & emit notification
  useEffect(() => {
    WizardStorageService.saveDraft(formData);
    assistant.addNotification({
      id: 'wizard_autosave_status',
      type: 'success',
      title: 'Autosave Completed',
      message: `Wizard step ${currentStep} draft updated and saved locally.`,
      source: 'Wizard Storage',
    });
  }, [formData]);

  const updateFormData = (fields: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setErrors({});
  };

  const handleNext = () => {
    const val = WizardValidationService.validateStep(currentStep, formData);
    if (!val.isValid) {
      setErrors(val.errors);
      assistant.addNotification({
        type: 'warning',
        title: 'Validation Warning',
        message: Object.values(val.errors).join(' • '),
        source: `Wizard Step ${currentStep}`,
      });
      return;
    }
    setErrors({});
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all wizard selections?')) {
      WizardStorageService.clearDraft();
      setFormData(WizardStorageService.getDefaultFormData());
      setCurrentStep(1);
      setErrors({});
      setIsSubmitted(false);
      assistant.addNotification({
        type: 'info',
        title: 'Wizard Reset',
        message: 'All wizard selections have been reset to defaults.',
        source: 'Wizard Engine',
      });
    }
  };

  const handleSubmit = async () => {
    // Validate final review
    const val = WizardValidationService.validateStep(currentStep, formData);
    if (!val.isValid) {
      setErrors(val.errors);
      assistant.addNotification({
        type: 'warning',
        title: 'Validation Warning',
        message: Object.values(val.errors).join(' • '),
        source: 'Wizard Review Validation',
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    assistant.addNotification({
      id: 'wizard_generation_progress',
      type: 'progress',
      title: 'Content Generation Started',
      message: 'Dispatched post request to Studio Orchestrator pipeline...',
      source: 'AI Creator Wizard',
      progress: 35,
    });

    try {
      const res = await CreatorWizardMainService.submitWizardRequest(formData);
      if (res.success) {
        setSubmittedRequestId(res.requestId);
        setIsSubmitted(true);
        WizardStorageService.clearDraft();
        assistant.addNotification({
          id: 'wizard_generation_progress',
          type: 'success',
          title: 'Content Generation Completed',
          message: `Post Request (ID: ${res.requestId}) successfully generated!`,
          source: 'AI Creator Wizard',
          progress: 100,
          actionLabel: 'Return to Wizard',
          actionRoute: 'wizard',
        });
        if (onSuccess) onSuccess(res.requestId);
      } else {
        const errText = res.message || 'Wizard generation failed. Please try again.';
        setErrors({ general: errText });
        assistant.addNotification({
          id: 'wizard_generation_progress',
          type: 'error',
          title: 'Content Generation Failed',
          message: errText,
          source: 'AI Creator Wizard',
        });
      }
    } catch (e: any) {
      console.error('Wizard submission error', e);
      const errText = e?.message || 'Unexpected wizard submission error occurred.';
      setErrors({ general: errText });
      assistant.addNotification({
        id: 'wizard_generation_progress',
        type: 'error',
        title: 'System Error',
        message: errText,
        source: 'AI Creator Wizard',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-[#0F131E] border border-cyan-500/30 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> REQUEST SUBMITTED TO ORCHESTRATOR
          </div>
          <h2 className="text-2xl font-extrabold text-white">Post Request Dispatched!</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your CreatePostRequest (ID: <span className="font-mono text-cyan-300 font-bold">{submittedRequestId}</span>) has entered the Fast Post Studio background workflow.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2"
          >
            Return to Studio Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setFormData(WizardStorageService.getDefaultFormData());
              setCurrentStep(1);
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-950/40 cursor-pointer"
          >
            Create Another Post <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#07090E] text-slate-100 select-none min-h-[calc(100vh-3.5rem)]">
      {/* Header & Stepper */}
      <WizardHeader
        currentStep={currentStep}
        totalSteps={9}
        isDraftSaved={true}
        onReset={handleReset}
      />

      <WizardProgress
        currentStep={currentStep}
        totalSteps={9}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Main Workspace Area (Step Form + Floating Live Summary Green Rectangle Box) */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto space-y-6">
            {errors.general && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-mono text-rose-300">
                <strong className="font-bold">Wizard Error:</strong> {errors.general}
              </div>
            )}
            {currentStep === 1 && (
              <StepPostGoal formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepContent formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 3 && (
              <StepAudience formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 4 && (
              <StepPlatforms formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 5 && (
              <StepTemplate formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 6 && (
              <StepBrand formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 7 && (
              <StepImages formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 8 && (
              <StepSchedule formData={formData} updateFormData={updateFormData} errors={errors} />
            )}
            {currentStep === 9 && (
              <StepReview formData={formData} onJumpToStep={(step) => setCurrentStep(step)} />
            )}
          </div>
        </main>

        {/* Floating Green Rectangle Live Summary Panel Box */}
        <WizardSidebar formData={formData} />
      </div>

      {/* Footer Nav Controls */}
      <WizardFooter
        currentStep={currentStep}
        totalSteps={9}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
