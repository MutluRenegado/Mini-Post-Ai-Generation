'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, FileText, Lock, Server, Scale, ExternalLink } from 'lucide-react';

export const SECONDARY_LEGAL_LINKS = [
  { label: 'Legal Directory', href: '/legal', icon: FileText },
  { label: 'Disclaimer', href: '/disclaimer', icon: Scale },
  { label: 'Data Processing Addendum', href: '/data-processing-agreement', icon: FileText },
  { label: 'Security Disclosure', href: '/security', icon: Lock },
  { label: 'Subprocessors', href: '/subprocessors', icon: Server },
];

export function MoreLegalDocumentsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left pt-1">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="more-legal-documents-menu"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 rounded-md py-1 px-1.5 -ml-1 cursor-pointer"
      >
        <span>More Legal Documents</span>
        <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="more-legal-documents-menu"
          role="menu"
          aria-orientation="vertical"
          className="absolute bottom-full left-0 mb-2 w-60 rounded-xl bg-[#0c101a] border border-slate-800/90 p-1.5 shadow-2xl shadow-black z-50 focus:outline-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-800/60 mb-1">
            Secondary Legal Documents
          </div>
          <div className="flex flex-col gap-0.5">
            {SECONDARY_LEGAL_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-600 opacity-60" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
