export type ReviewStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'published';

export interface ReviewRequest {
  id: string;
  postId: string;
  status: ReviewStatus;
  reviewerNotes?: string;
  updatedAt: string;
}

export class ReviewWorkflow {
  private static reviews: Map<string, ReviewRequest> = new Map();

  static submitForReview(postId: string): ReviewRequest {
    const req: ReviewRequest = {
      id: `rev_${Date.now()}`,
      postId,
      status: 'review',
      updatedAt: new Date().toISOString(),
    };
    this.reviews.set(postId, req);
    return req;
  }

  static approve(postId: string, notes?: string): ReviewRequest | undefined {
    const req = this.reviews.get(postId);
    if (req) {
      req.status = 'approved';
      req.reviewerNotes = notes;
      req.updatedAt = new Date().toISOString();
    }
    return req;
  }

  static reject(postId: string, notes: string): ReviewRequest | undefined {
    const req = this.reviews.get(postId);
    if (req) {
      req.status = 'rejected';
      req.reviewerNotes = notes;
      req.updatedAt = new Date().toISOString();
    }
    return req;
  }
}
