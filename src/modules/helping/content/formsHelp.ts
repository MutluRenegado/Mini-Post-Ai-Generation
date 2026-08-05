import { HelpItem } from '../types/explain-item.types';

export const FORMS_HELP_ITEMS: HelpItem[] = [
  {
    id: 'data-deletion-form',
    title: 'Account & Data Erasure Request Form',
    shortDescription: 'Submit an automated request to erase account records and revoke connected social OAuth tokens.',
    purpose: 'Fulfills GDPR Article 17 right to erasure and platform data deletion requirements.',
    instructions: [
      'Ensure you are signed in to your account, or provide your registered email address.',
      'Check the explicit confirmation box.',
      'Click Submit Request.',
    ],
    expectedResult: 'Revokes OAuth tokens immediately and queues user records for purge within 30 days.',
    commonMistakes: ['Submitting an unverified email address without checking account ownership.'],
    limitations: ['Data erasure cannot be undone once confirmed.'],
    category: 'FORM_SECTION',
    route: '/data-deletion',
    placement: 'BELOW',
    version: 'v1.0.0',
    reviewed: true,
  },
  {
    id: 'contact-form-email',
    title: 'Contact Email Address Field',
    shortDescription: 'Enter a valid email address for receiving support or legal response.',
    purpose: 'Allows the compliance team to follow up on your inquiry.',
    instructions: ['Enter your active email address.'],
    expectedResult: 'Routes inquiry with a copy sent to your email.',
    category: 'FORM_FIELD',
    route: '/company/contact',
    placement: 'BELOW',
    version: 'v1.0.0',
    reviewed: true,
  },
];
