import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import LegalLayout from "@/components/legal/LegalLayout";

export default function DataDeletionSuccessPage() {
  return (
    <LegalLayout title="Deletion Request Submitted" subtitle="Your data deletion request has been received.">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-4 text-slate-300">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          <span>Data Deletion Request Received</span>
        </div>
        <p className="text-xs leading-relaxed">
          Your account deletion request is queued for processing within 30 days. For questions, contact{" "}
          <a href="mailto:deletion@minipostapp.space" className="text-amber-400 underline font-semibold">
            deletion@minipostapp.space
          </a>.
        </p>
        <div className="pt-2">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white hover:border-amber-400 transition-colors">
            <span>Return to Mini Post App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </LegalLayout>
  );
}
