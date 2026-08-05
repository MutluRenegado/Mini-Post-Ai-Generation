import React from 'react';
import { createLegalMetadata } from '@/modules/legal/metadata/createLegalMetadata';
import { LegalPageShell } from '@/modules/legal/components/LegalPageShell';
import { getLegalDocumentBySlug } from '@/modules/legal/services/LegalDocumentService';
import { notFound } from 'next/navigation';

export const metadata = createLegalMetadata({
  title: 'Terms of Service',
  description: 'Canonical Terms of Service contract for Mini Post App, operated by Yoga Products Top Limited.',
  path: '/legal/terms',
});

export default function TermsPage() {
  const doc = getLegalDocumentBySlug('terms');
  if (!doc) notFound();

  return (
    <LegalPageShell
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      reviewStatus={doc.reviewStatus}
      breadcrumbs={[{ label: doc.title, href: '/legal/terms' }]}
    >
      <div className="space-y-8">
        {doc.sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="space-y-3 border-b border-slate-800/60 pb-6 last:border-b-0">
            <h2 className="text-lg font-bold text-white">{sec.title}</h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>
          </section>
        ))}
      </div>
    </LegalPageShell>
  );
}
