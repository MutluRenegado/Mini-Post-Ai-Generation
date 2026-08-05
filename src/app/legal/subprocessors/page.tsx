import React from 'react';
import { createLegalMetadata } from '@/modules/legal/metadata/createLegalMetadata';
import { LegalPageShell } from '@/modules/legal/components/LegalPageShell';
import { getLegalDocumentBySlug } from '@/modules/legal/services/LegalDocumentService';
import { notFound } from 'next/navigation';

export const metadata = createLegalMetadata({
  title: 'Subprocessors Directory',
  description: 'Directory of verified third-party cloud infrastructure, AI, and billing subprocessors for Mini Post App.',
  path: '/legal/subprocessors',
});

export default function SubprocessorsPage() {
  const doc = getLegalDocumentBySlug('subprocessors');
  if (!doc) notFound();

  return (
    <LegalPageShell
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      reviewStatus={doc.reviewStatus}
      breadcrumbs={[{ label: doc.title, href: '/legal/subprocessors' }]}
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
