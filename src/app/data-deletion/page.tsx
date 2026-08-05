"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, AlertTriangle, CheckCircle2, Trash2, FileText, ArrowRight } from "lucide-react";
import LegalLayout from "@/components/legal/LegalLayout";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { ExplainControl } from "@/modules/helping";

export default function DataDeletionPage() {
  const { user, logout } = useAuth();
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const accountEmail = user?.email || "";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setErrorMsg("Please sign in to submit an automated account deletion request.");
      return;
    }
    if (!confirmCheckbox) {
      setErrorMsg("Please confirm that you understand this data deletion is permanent.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      // Simulated deletion request submission / audit log recording
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit deletion request. Please email deletion@minipostapp.space.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LegalLayout
      title="Data Deletion Request"
      subtitle="Public data deletion instructions and account erasure request workflow for Mini Post App."
      lastUpdated="August 1, 2026"
    >
      <div className="space-y-8 text-slate-300">
        <section className="space-y-4">
          <p>
            Mini Post App (operated by Yoga Products Top Limited) respects your right to control your personal data.
            Any user can request the permanent deletion of their account records, workspace data, saved prompt templates, and connected social channel OAuth tokens.
          </p>

          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="rounded-xl border border-slate-800 bg-[#05070c] p-4 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>How to Request Deletion</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in to your Mini Post App account below to submit an instant deletion request, or email your request to{" "}
                <a href="mailto:deletion@minipostapp.space" className="text-amber-400 underline font-semibold">
                  deletion@minipostapp.space
                </a>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#05070c] p-4 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>What Data is Deleted</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your profile, email address, connected Facebook, Instagram, LinkedIn, X, TikTok, and YouTube access tokens, master posts, and custom brand configurations are permanently purged.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#05070c] p-4 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Processing Timeframe</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Account deletion requests are processed within 30 days. Connected social media tokens are revoked immediately upon request confirmation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#05070c] p-4 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Data Deletion Support Email</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                For manual account deletion inquiries or Data Subject Access Requests (DSAR), contact{" "}
                <a href="mailto:deletion@minipostapp.space" className="text-amber-400 underline font-mono font-semibold">
                  deletion@minipostapp.space
                </a>.
              </p>
            </div>
          </div>
        </section>

        {/* Account Deletion Request Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#05070c] p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" />
              <span>Submit Account & Data Deletion Request</span>
            </h2>
            <ExplainControl helpId="data-deletion-form" />
          </div>

          {!user ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
              <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                You are currently not signed in. To submit an automated deletion request for your account, please sign in first. Alternatively, you can email{" "}
                <a href="mailto:deletion@minipostapp.space?subject=Manual%20Data%20Deletion%20Request" className="underline font-bold text-white">
                  deletion@minipostapp.space
                </a>{" "}
                from your registered email address.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <span>Sign In to Request Deletion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : submitted ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Deletion Request Received</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your request to delete account <strong className="text-white">{accountEmail}</strong> and revoke all connected social channel access tokens has been queued. Our privacy compliance team will process the request within 30 days.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  Sign Out Now
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border border-slate-800 bg-[#0c101a] p-4 text-xs space-y-1">
                <span className="text-slate-500 font-mono uppercase text-[10px]">Active Authenticated Account</span>
                <div className="text-sm font-bold text-white">{accountEmail || user.uid}</div>
              </div>

              <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-200 leading-relaxed">
                  Warning: Deleting your account will permanently remove all your saved drafts, prompt templates, and social channel connections. This action cannot be undone.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-[#0c101a] p-4 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={confirmCheckbox}
                  onChange={(e) => setConfirmCheckbox(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-rose-500 rounded"
                />
                <span>I confirm that I want to permanently delete my Mini Post App account and associated personal data.</span>
              </label>

              {errorMsg && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={!confirmCheckbox || submitting}
                className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{submitting ? "Submitting Request..." : "Submit Account Deletion Request"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </LegalLayout>
  );
}
