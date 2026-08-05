import React, { useState } from 'react';

export const WelcomeOnboardingWizard: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="p-8 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl max-w-xl mx-auto font-sans">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-cyan-600 mx-auto flex items-center justify-center text-xl font-bold text-white shadow-lg">
          S
        </div>
        <h2 className="text-2xl font-black text-white">Welcome to StudioOS v3.0</h2>
        <p className="text-xs text-slate-400">Enterprise AI Content Studio Operating System</p>
      </div>

      <div className="mt-8 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
        <div>Step {step} of 3: {step === 1 ? 'Workspace Tour' : step === 2 ? 'Select Default AI Provider' : 'Ready for Launch'}</div>
        <p className="text-slate-300">
          {step === 1 && 'StudioOS coordinates 9 autonomous agents for multi-platform post creation with zero placeholder logic.'}
          {step === 2 && 'Primary provider configured to Gemini 2.5 Flash with fallback to OpenAI or Claude.'}
          {step === 3 && 'Your enterprise workspace is fully initialized and production ready!'}
        </p>
      </div>

      <div className="mt-6 flex justify-between items-center">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step < 3) setStep(step + 1);
            else if (onComplete) onComplete();
          }}
          className="ml-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg transition-all"
        >
          {step === 3 ? 'Launch StudioOS' : 'Next Step ➔'}
        </button>
      </div>
    </div>
  );
};
