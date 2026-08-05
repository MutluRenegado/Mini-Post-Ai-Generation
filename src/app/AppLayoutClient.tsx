'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { AuthModal } from '@/modules/auth/components/AuthModal';
import { StripePricingModal } from '@/modules/billing/components/StripePricingModal';
import { SidebarNav } from '@/modules/navigation/components/SidebarNav';
import { LogOut, HelpCircle } from 'lucide-react';
import { TrustSafetyHeader } from '@/modules/company/components/TrustSafetyHeader';
import { HelpingProvider, ExplainBox } from '@/modules/helping';

function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const handleGoToDashboard = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_redirect', '/dashboard');
      }
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    router.push('/dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#04060a]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] sm:h-[76px] lg:h-[80px] flex items-center justify-between gap-4">
          {/* Logo & Brand - Clickable Full Logo Area with Workflow Subtitle */}
          <Link
            href="/"
            aria-label="Go to Mini Post App homepage"
            className="flex flex-col items-start justify-center shrink-0 group focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-4 rounded-xl cursor-pointer"
          >
            <img
              src="/Logoblackbackground.png"
              alt="Mini Post App"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain mix-blend-screen transition-transform duration-200 group-hover:scale-105"
              style={{ mixBlendMode: 'screen' }}
            />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-[#AAB3C2] whitespace-nowrap hidden sm:block -mt-1">
              Create → Optimize → Publish → Analyze
            </span>
          </Link>

          {/* Centralized Text Header Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-xs font-bold uppercase tracking-wider text-slate-300 flex-1 px-4">
            <Link href="/company/product/features" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              FEATURES
            </Link>
            <Link href="/company/product/pricing" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              PRICING
            </Link>
            <Link href="/company/about" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              COMPANY
            </Link>
            <Link href="/company/resources/help" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              RESOURCES
            </Link>
            <Link href="/company/trust/trust-safety" className="hover:text-amber-400 transition-colors whitespace-nowrap" aria-label="Trust, Safety & Engineering Standards">
              TRUST & SAFETY
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/company/resources/help"
              title="Help Center"
              aria-label="Help Center & Customer Support"
              className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            <Link
              href="/tour"
              className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              Take a Tour
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[9px]">
                    {(user.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate hidden md:inline">{user.isAnonymous ? 'Guest' : user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg border border-transparent transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              onClick={handleGoToDashboard}
              className="px-4 py-1.5 bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-950 text-xs font-extrabold rounded-full shadow-md hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 whitespace-nowrap"
            >
              Go To Dashboard
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={handleAuthSuccess} />
      <StripePricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
}

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isTrustSafetyRoute = pathname === '/company/trust/trust-safety';

  // Public pages that use Navbar + Footer
  const isPublicPage =
    pathname === '/' ||
    pathname === '/tour' ||
    pathname === '/subscribe' ||
    pathname === '/login' ||
    pathname === '/data-deletion' ||
    pathname?.startsWith('/company') ||
    pathname?.startsWith('/legal');

  return (
    <HelpingProvider>
      <ExplainBox />
      {isPublicPage ? (
        <>
          {isTrustSafetyRoute ? <TrustSafetyHeader /> : <Navbar />}
          <main className="flex-1 w-full">{children}</main>
          <footer className="border-t border-slate-800/90 bg-[#030408] py-10 sm:py-14 text-slate-400 shadow-[0_-12px_36px_rgba(0,0,0,0.7)] relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              {/* 6-Group Multi-Column Layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 text-xs">
                {/* Group 1: Company */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">Company</h3>
                  <ul className="space-y-2 text-slate-400 font-medium">
                    <li><Link href="/company/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                    <li><Link href="/company/our-story" className="hover:text-amber-400 transition-colors">Our Story</Link></li>
                    <li><Link href="/company/mission" className="hover:text-amber-400 transition-colors">Mission</Link></li>
                    <li><Link href="/company/vision" className="hover:text-amber-400 transition-colors">Vision</Link></li>
                    <li><Link href="/company/values" className="hover:text-amber-400 transition-colors">Values</Link></li>
                    <li><Link href="/company/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
                    <li><Link href="/company/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                  </ul>
                </div>

                {/* Group 2: Product */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">Product</h3>
                  <ul className="space-y-2 text-slate-400 font-medium">
                    <li><Link href="/company/product/features" className="hover:text-amber-400 transition-colors">Features</Link></li>
                    <li><Link href="/company/product/capabilities" className="hover:text-amber-400 transition-colors">Capabilities</Link></li>
                    <li><Link href="/company/product/ai-engine" className="hover:text-amber-400 transition-colors">AI Engine</Link></li>
                    <li><Link href="/company/product/templates" className="hover:text-amber-400 transition-colors">Templates</Link></li>
                    <li><Link href="/company/product/pricing" className="hover:text-amber-400 transition-colors">Pricing</Link></li>
                    <li><Link href="/company/product/enterprise" className="hover:text-amber-400 transition-colors">Enterprise</Link></li>
                  </ul>
                </div>

                {/* Group 3: Resources */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">Resources</h3>
                  <ul className="space-y-2 text-slate-400 font-medium">
                    <li><Link href="/company/resources/help" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
                    <li><Link href="/company/resources/documentation" className="hover:text-amber-400 transition-colors">Documentation</Link></li>
                    <li><Link href="/company/resources/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                    <li><Link href="/company/resources/tutorials" className="hover:text-amber-400 transition-colors">Tutorials</Link></li>
                    <li><Link href="/company/resources/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                    <li><Link href="/company/resources/changelog" className="hover:text-amber-400 transition-colors">Changelog</Link></li>
                    <li><Link href="/company/resources/roadmap" className="hover:text-amber-400 transition-colors">Roadmap</Link></li>
                  </ul>
                </div>

                {/* Group 4: Trust */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">Trust & Legal</h3>
                  <ul className="space-y-2 text-slate-400 font-medium">
                    <li><Link href="/company/trust/trust-safety" className="hover:text-amber-400 transition-colors">Trust & Safety</Link></li>
                    <li><Link href="/company/trust/security" className="hover:text-amber-400 transition-colors">Security</Link></li>
                    <li><Link href="/company/trust/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/company/trust/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                    <li><Link href="/company/trust/cookies" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
                    <li><Link href="/company/trust/gdpr" className="hover:text-amber-400 transition-colors">GDPR Rights</Link></li>
                    <li><Link href="/data-deletion" className="hover:text-amber-400 transition-colors font-semibold text-rose-300">Data Deletion</Link></li>
                    <li><Link href="/company/trust/subprocessors" className="hover:text-amber-400 transition-colors">Subprocessors</Link></li>
                    <li><Link href="/company/trust/status" className="hover:text-amber-400 transition-colors">Status</Link></li>
                  </ul>
                </div>

                {/* Group 5: Media */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">Media</h3>
                  <ul className="space-y-2 text-slate-400 font-medium">
                    <li><Link href="/company/media/press" className="hover:text-amber-400 transition-colors">Press</Link></li>
                    <li><Link href="/company/media/brand-kit" className="hover:text-amber-400 transition-colors">Brand Kit</Link></li>
                    <li><Link href="/company/media/logos" className="hover:text-amber-400 transition-colors">Logos</Link></li>
                    <li><Link href="/company/media/screenshots" className="hover:text-amber-400 transition-colors">Screenshots</Link></li>
                    <li><Link href="/company/media/media-kit" className="hover:text-amber-400 transition-colors">Media Kit</Link></li>
                  </ul>
                </div>

                {/* Group 6: Business */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200">Business</h3>
                  <ul className="space-y-2 text-slate-400 font-medium">
                    <li><Link href="/company/business/partners" className="hover:text-amber-400 transition-colors">Partners</Link></li>
                    <li><Link href="/company/business/affiliate" className="hover:text-amber-400 transition-colors">Affiliate</Link></li>
                    <li><Link href="/company/business/case-studies" className="hover:text-amber-400 transition-colors">Case Studies</Link></li>
                    <li><Link href="/company/business/customer-stories" className="hover:text-amber-400 transition-colors">Customer Stories</Link></li>
                  </ul>
                </div>
              </div>

              {/* Trust & Safety Banner */}
              <div className="pt-6 border-t border-slate-800/80 text-center">
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-slate-400 max-w-[780px] mx-auto font-normal">
                  Mini Post App is built in alignment with internationally recognized engineering, accessibility, security, responsible AI, and cloud architecture frameworks.{' '}
                  <Link href="/company/trust/trust-safety" className="text-[#ffae00] hover:text-[#ffd066] underline font-medium transition-colors">
                    Learn more in our Trust, Safety & Engineering Standards Center.
                  </Link>
                </p>
              </div>

              {/* Final Footer Row */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-xs text-slate-400">
                <div className="text-center sm:text-left leading-relaxed">
                  <p className="font-semibold text-slate-300">© 2026 Mini Post App</p>
                  <p className="text-slate-500 text-[11px]">Owned and operated by Yoga Products Top Limited.</p>
                </div>
                <Link href="/company/trust/status" className="flex items-center gap-2 text-slate-400 font-medium shrink-0 pt-0.5 hover:text-amber-400 transition-colors">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-xs">System Status • Fully Operational</span>
                </Link>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0C10] text-slate-400 p-8 font-mono text-sm">Loading Studio Layout...</div>}>
          <SidebarNav>{children}</SidebarNav>
        </Suspense>
      )}
    </HelpingProvider>
  );
}
