import React from 'react';
import { buildCompanyMetadata } from '@/modules/company/metadata/metadataHelpers';
import { CompanyPageShell } from '@/modules/company/components/CompanyPageShell';
import { ContactForm } from '@/modules/company/components/ContactForm';
import { COMPANY_FACTS } from '@/modules/company/config/companyFacts';

export const metadata = buildCompanyMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Mini Post App support, billing, enterprise, legal, or partnership teams.',
  path: '/company/contact',
});

export default function ContactPage() {
  return (
    <CompanyPageShell
      groupKey="company"
      groupLabel="Company"
      badge="CONTACT US"
      title="How Can We Assist You?"
      subtitle={`Reach out directly to our dedicated support, billing, or compliance team. All inquiries route directly to ${COMPANY_FACTS.supportEmail}.`}
      breadcrumbs={[{ label: 'Contact', href: '/company/contact' }]}
      canonicalPath="/company/contact"
      metaDescription="Contact Mini Post App support, billing, or enterprise teams."
      relatedPages={[
        { title: 'Help Center', description: 'Search FAQs & Guides.', href: '/company/resources/help', groupLabel: 'Resources' },
        { title: 'Data Deletion', description: 'Account erasure request.', href: '/data-deletion', groupLabel: 'Trust' },
      ]}
    >
      <div className="max-w-3xl mx-auto">
        <ContactForm />
      </div>
    </CompanyPageShell>
  );
}
