import { PostStatus, StudioPost } from '../types/studio.types';

export class ApprovalWorkflowService {
  static getNextStatus(currentStatus: PostStatus): PostStatus {
    switch (currentStatus) {
      case 'draft':
        return 'review';
      case 'review':
        return 'approved';
      case 'approved':
        return 'locked';
      case 'locked':
        return 'scheduled';
      case 'scheduled':
        return 'published';
      case 'published':
        return 'archived';
      default:
        return 'draft';
    }
  }

  static canEditPost(post: StudioPost): boolean {
    return post.status !== 'locked' && post.status !== 'published';
  }
}
