export interface LegalReviewEntry {
  documentId: string;
  documentTitle: string;
  route: string;
  legalReview: 'PENDING' | 'APPROVED';
  privacyReview: 'PENDING' | 'APPROVED';
  cookieReview: 'PENDING' | 'APPROVED';
  businessReview: 'PENDING' | 'APPROVED';
  technicalReview: 'PASSED' | 'FAILED';
  approvalStatus: 'DRAFT FOR REVIEW' | 'PENDING MANUAL REVIEW' | 'APPROVED';
}
