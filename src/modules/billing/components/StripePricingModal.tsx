'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { X, Check, QrCode, Zap, Building2, Crown, ExternalLink, Video, Clock } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/config/tiers';

interface StripePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripePricingModal({ isOpen, onClose }: StripePricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'business'>('pro');

  if (!isOpen) return null;

  const starterPaymentUrl = 'https://buy.stripe.com/9B6cN574q9I85GA5vRbQY04?prefilled_email=billing%40minipostapp.space';
  const proPaymentUrl = 'https://buy.stripe.com/dRm9ATdsOf2s1qk8I3bQY03?prefilled_email=billing%40minipostapp.space';
  const businessPaymentUrl = 'https://buy.stripe.com/9B614n4WiaMcfha0bxbQY00?prefilled_email=billing%40minipostapp.space';

  return (
    <>
      <Script src="https://js.stripe.com/v3/buy-button.js" strategy="lazyOnload" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase">
              <Clock className="w-3.5 h-3.5" /> DURATION-BASED PRICING TIERS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Monthly Video Generation Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Upgrade your video duration quota. Select a plan below or scan the Stripe QR code to activate.
            </p>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* STARTER PLAN */}
            <div
              onClick={() => setSelectedPlan('starter')}
              className={`relative bg-slate-950/70 border rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'starter'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-indigo-400" /> Starter Plan
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-black text-slate-100">$9</span>
                  <span className="text-xs text-slate-400 font-medium"> / month</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4 flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-extrabold text-indigo-300">10 Mins (600s) / Month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10 Mins Video Duration</strong> / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Gemini AI Flash High-Speed Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1-Click Multi-Platform Adaptation</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <a
                  href={starterPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Pay $9 (Starter 10 Mins)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedPlan === 'starter'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {selectedPlan === 'starter' ? 'Selected • View Details' : 'Select Starter'}
                </button>
              </div>
            </div>

            {/* PRO PLAN */}
            <div
              onClick={() => setSelectedPlan('pro')}
              className={`relative bg-gradient-to-b from-indigo-950/40 to-slate-950 border rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'pro'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-950/50'
                  : 'border-indigo-500/40 hover:border-indigo-500/70'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                ★ Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" /> Pro Creator
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-black text-slate-100">$19</span>
                  <span className="text-xs text-slate-400 font-medium"> / month</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4 flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-extrabold text-amber-300">50 Mins (3,000s) / Month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>50 Mins Video Duration</strong> / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>15 Ready-to-Use Social Presets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Priority GPU Video Rendering</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <a
                  href={proPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <span>Pay $19 (Pro 50 Mins)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedPlan === 'pro'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {selectedPlan === 'pro' ? 'Selected • View Details' : 'Select Pro'}
                </button>
              </div>
            </div>

            {/* BUSINESS PLAN */}
            <div
              onClick={() => setSelectedPlan('business')}
              className={`relative bg-slate-950/70 border rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'business'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-400" /> Business Enterprise
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-black text-slate-100">$29</span>
                  <span className="text-xs text-slate-400 font-medium"> / month</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-4 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-extrabold text-purple-300">100 Mins (6,000s) / Month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>100 Mins Video Duration</strong> / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Multi-Brand Team Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dedicated Production Support</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <a
                  href={businessPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
                >
                  <span>Pay $29 (Business 100 Mins)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedPlan === 'business'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {selectedPlan === 'business' ? 'Selected • View Details' : 'Select Business'}
                </button>
              </div>
            </div>
          </div>

          {/* Selected Plan Payment & QR Code Display Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-48 bg-indigo-600 p-3 rounded-2xl shadow-xl border border-indigo-500 flex flex-col items-center justify-center gap-2">
                <div className="w-full bg-white p-2.5 rounded-xl flex items-center justify-center">
                  <Image
                    src={`/stripe-qr/${selectedPlan}.png`}
                    alt={`Stripe QR Code - ${selectedPlan.toUpperCase()}`}
                    width={160}
                    height={160}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">Scan to pay</span>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono inline-block">
                PRICING & Checkout • {SUBSCRIPTION_TIERS[selectedPlan].monthlyMinutes} Minutes Included
              </span>
              <h4 className="text-lg font-bold text-slate-100 capitalize">
                Checkout for {selectedPlan} Plan (${SUBSCRIPTION_TIERS[selectedPlan].price} / mo)
              </h4>

              {selectedPlan === 'starter' && (
                <div className="space-y-3 pt-1">
                  <div className="inline-block">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1TwZn7GwrJchitTIMV9crrDf"
                      publishable-key="pk_live_51TjWTbGwrJchitTI67591BfmlnFfy90GdI9iUKybdL6FaffR1YsNrhh2GcrULjtugmnASfaZIDtjs92IT4mSN7BF00DpXlNt8c"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Or pay directly via link: <a href={starterPaymentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-mono text-[11px]">{starterPaymentUrl}</a>
                  </p>
                </div>
              )}

              {selectedPlan === 'pro' && (
                <div className="space-y-3 pt-1">
                  <div className="inline-block">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1TwZjbGwrJchitTIDbo7YfbP"
                      publishable-key="pk_live_51TjWTbGwrJchitTI67591BfmlnFfy90GdI9iUKybdL6FaffR1YsNrhh2GcrULjtugmnASfaZIDtjs92IT4mSN7BF00DpXlNt8c"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Or pay directly via link: <a href={proPaymentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-mono text-[11px]">{proPaymentUrl}</a>
                  </p>
                </div>
              )}

              {selectedPlan === 'business' && (
                <div className="space-y-3 pt-1">
                  <div className="inline-block">
                    <stripe-buy-button
                      buy-button-id="buy_btn_1TwLvKGwrJchitTIMszuhS8V"
                      publishable-key="pk_live_51TjWTbGwrJchitTI67591BfmlnFfy90GdI9iUKybdL6FaffR1YsNrhh2GcrULjtugmnASfaZIDtjs92IT4mSN7BF00DpXlNt8c"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Or pay directly via link: <a href={businessPaymentUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-mono text-[11px]">{businessPaymentUrl}</a>
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer / Return Button */}
            <div className="mt-8 pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Return to Creator Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
