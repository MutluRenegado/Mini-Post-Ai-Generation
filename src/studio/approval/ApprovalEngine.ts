import { ReviewWorkflow, ReviewStatus } from './ReviewWorkflow';

export class ApprovalEngine {
  static getStatus(postId: string): ReviewStatus {
    const req = (ReviewWorkflow as any).reviews?.get(postId);
    return req ? req.status : 'draft';
  }

  static isReadyForPublish(postId: string): boolean {
    return this.getStatus(postId) === 'approved';
  }
}
