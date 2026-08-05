'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { AuthModal } from '@/modules/auth/components/AuthModal';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TrustSafetyHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#04060a]/95 backdrop-blur-xl border-b border-amber-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-2">
          {/* Top Row: Logo, Route Indicator Badge & Action Buttons */}
          <div className="flex items-center justify-between gap-4 h-12">
            <Link
              href="/"
              aria-label="Go to Mini Post App homepage"
              className="flex items-center gap-3 shrink-0 group focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-4 rounded-xl cursor-pointer"
            >
              <img
                src="/Logoblackbackground.png"
                alt="Mini Post App"
                className="h-8 sm:h-9 w-auto object-contain mix-blend-screen transition-transform duration-200 group-hover:scale-105"
                style={{ mixBlendMode: 'screen' }}
              />
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline-block">
                Trust, Safety & Standards
              </span>
            </Link>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
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
                className="px-4 py-1.5 bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-950 text-xs font-extrabold rounded-full shadow-md hover:shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                Go To Dashboard
              </button>
            </div>
          </div>

          {/* Navigation Container — Prepared for Message 2 Header Reference */}
          <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              TRUST & SAFETY DIRECTORY
            </span>
            <span className="text-[10px] text-slate-500 italic">
              Mini Post App Security & Legal Information
            </span>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
