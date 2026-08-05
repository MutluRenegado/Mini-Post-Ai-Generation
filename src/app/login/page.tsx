'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { LogIn, UserPlus, Sparkles, UserCheck, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, registerWithEmail, loginAnonymously, loginWithGoogle, user } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      router.push('/');
    } catch (err: unknown) {
      console.error('[LoginPage] Auth Error:', err);
      const fbError = err as FirebaseError;
      if (
        fbError?.code === 'auth/invalid-credential' ||
        fbError?.code === 'auth/user-not-found' ||
        fbError?.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.');
      } else if (fbError?.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (fbError?.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(fbError?.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginAnonymously();
      router.push('/');
    } catch (err: unknown) {
      console.error('[LoginPage] Guest Login Error:', err);
      setError('Guest login failed. You can continue creating posts locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: unknown) {
      console.error('[LoginPage] Google Login Error:', err);
      setError('Google Sign-In failed or popup was closed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 relative">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {mode === 'login' ? 'Sign In to Account' : 'Create New Account'}
            </h1>
            <p className="text-xs text-slate-400">
              {mode === 'login'
                ? 'Access saved multi-platform social posts'
                : 'Join Mini Post Studio for 1-click AI creation'}
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 mb-6 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
            <span className="font-bold">•</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin font-bold">↻</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Or Continue With</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Quick Auth Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Guest Access</span>
          </button>
        </div>
      </div>
    </div>
  );
}
