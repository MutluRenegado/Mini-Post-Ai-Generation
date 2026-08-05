'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ExternalLink, ArrowLeft, Check, Video, Clock } from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/config/tiers';

export default function SubscribePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'business'>('pro');

  const starterUrl = 'https://buy.stripe.com/9B6cN574q9I85GA5vRbQY04?prefilled_email=support%40minipostapp.space';
  const proUrl = 'https://buy.stripe.com/dRm9ATdsOf2s1qk8I3bQY03?prefilled_email=support%40minipostapp.space';
  const businessUrl = 'https://buy.stripe.com/9B614n4WiaMcfha0bxbQY00?prefilled_email=support%40minipostapp.space';

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <Script src="https://js.stripe.com/v3/buy-button.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#0A0C10] text-slate-100 p-4 sm:p-6 lg:p-10 font-sans selection:bg-cyan-500 selection:text-black">
        {/* Top Navigation Bar with Back Button */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="px-4 py-2.5 bg-[#12151E] hover:bg-[#181C2B] active:scale-95 border border-[#1E2330] hover:border-cyan-500/50 rounded-xl text-xs font-bold text-slate-200 hover:text-cyan-400 transition-all flex items-center gap-2 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Creator Studio</span>
            </button>

            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-[#12151E] hover:bg-[#181C2B] border border-[#1E2330] rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all hidden sm:inline-flex"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
              M
            </div>
            <span className="text-lg font-black tracking-tight text-white">Mini Post App</span>
          </div>
        </div>

        {/* Hero Section with Prominent Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> PRICING & SUBSCRIPTION TIERS (STRIPE)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pricing & Subscription Tiers
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Choose your plan below. Pay securely via Stripe to activate instant video generation & multi-platform publishing.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* STARTER PACK */}
          <div
            onClick={() => setSelectedPlan('starter')}
            className={`relative bg-[#12151E] border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
              selectedPlan === 'starter'
                ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-2xl shadow-cyan-950/40'
                : 'border-[#1E2330] hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-white">Starter</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                  10 Mins / Mo
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                10 minutes (600s) of generated AI video per month for solo creators.
              </p>

              <div className="mb-6">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">MiniPost — Starter Tier</span>
                <span className="text-4xl font-black text-white">$9</span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-cyan-300">10 Minutes (600 Seconds) / Month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>10 Mins (600s) Video Render</strong> / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gemini AI Flash High-Speed Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Multi-Platform Adaptation</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <a
                href={starterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 active:scale-[0.99] text-black font-extrabold text-xs rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Secure Checkout ($9)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="pt-2 border-t border-[#1E2330] text-center space-y-2">
                <a href={starterUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-400 hover:underline font-medium inline-block">
                  Direct Link →
                </a>
                <div className="bg-[#0A0C10] p-3 rounded-2xl border border-[#1E2330] flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SCAN TO PAY (STARTER)</span>
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-700 flex items-center justify-center">
                    <Image src="/stripe-qr/starter.png" alt="Starter QR Code" width={110} height={110} className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRO PACK (MOST POPULAR) */}
          <div
            onClick={() => setSelectedPlan('pro')}
            className={`relative bg-gradient-to-b from-[#181C2B] to-[#12151E] border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
              selectedPlan === 'pro'
                ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-950/60'
                : 'border-indigo-500/40 hover:border-indigo-500/70'
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-xl font-black text-white flex items-center gap-1.5">
                  Pro
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold uppercase">
                  50 Mins / Mo
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                50 minutes (3,000s) of generated AI video per month for growth creators.
              </p>

              <div className="mb-6">
                <span className="text-xs text-indigo-300 uppercase tracking-wider block font-semibold">MiniPost — Pro Tier</span>
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-6 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-300 shrink-0" />
                <span className="text-xs font-bold text-indigo-200">50 Minutes (3,000 Seconds) / Month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>50 Mins (3,000s) Video Render</strong> / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>15 Ready-to-Use Social Presets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority GPU Video Rendering</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <a
                href={proUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 active:scale-[0.99] text-black font-extrabold text-xs rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Secure Checkout ($19)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="pt-2 border-t border-[#1E2330] text-center space-y-2">
                <a href={proUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-400 hover:underline font-medium inline-block">
                  Direct Link →
                </a>
                <div className="bg-[#0A0C10] p-3 rounded-2xl border border-[#1E2330] flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">SCAN TO PAY (PRO)</span>
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-700 flex items-center justify-center">
                    <Image src="/stripe-qr/pro.png" alt="Pro QR Code" width={110} height={110} className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BUSINESS PACK */}
          <div
            onClick={() => setSelectedPlan('business')}
            className={`relative bg-[#12151E] border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer ${
              selectedPlan === 'business'
                ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-2xl shadow-cyan-950/40'
                : 'border-[#1E2330] hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-white">Business</span>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                  100 Mins / Mo
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                100 minutes (6,000s) of generated AI video per month for scaling teams.
              </p>

              <div className="mb-6">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">MiniPost — Business Tier</span>
                <span className="text-4xl font-black text-white">$29</span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 mb-6 flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="text-xs font-bold text-purple-200">100 Minutes (6,000 Seconds) / Month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>100 Mins (6,000s) Video Render</strong> / Month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Brand Team Access & Firestore Database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Production Support</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center w-full my-2">
                <stripe-buy-button
                  buy-button-id="buy_btn_1TwLvKGwrJchitTIMszuhS8V"
                  publishable-key="pk_live_51TjWTbGwrJchitTI67591BfmlnFfy90GdI9iUKybdL6FaffR1YsNrhh2GcrULjtugmnASfaZIDtjs92IT4mSN7BF00DpXlNt8c"
                />
              </div>

              <a
                href={businessUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 active:scale-[0.99] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Secure Checkout ($29)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="pt-2 border-t border-[#1E2330] text-center space-y-2">
                <a href={businessUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-indigo-400 hover:underline font-medium inline-block">
                  Direct Link →
                </a>
                <div className="bg-[#0A0C10] p-3 rounded-2xl border border-[#1E2330] flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SCAN TO PAY (BUSINESS)</span>
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-700 flex items-center justify-center">
                    <Image src="/stripe-qr/business.png" alt="Business QR Code" width={110} height={110} className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Back Link */}
        <footer className="text-center text-xs text-slate-500 border-t border-[#1E2330] pt-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© Mini Post App. All rights reserved. Secure payment via Stripe.</span>

          <button
            type="button"
            onClick={handleBackNavigation}
            className="text-cyan-400 hover:underline font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Creator Studio
          </button>
        </footer>
      </div>
    </>
  );
}
