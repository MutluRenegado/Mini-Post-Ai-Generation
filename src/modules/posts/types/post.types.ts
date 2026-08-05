export type PostStatus = 'draft' | 'in_progress' | 'completed' | 'locked';

export interface PlatformAdaptations {
  master_post?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  threads?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  status?: PostStatus;
  adaptations?: PlatformAdaptations;
  imageUrl?: string | null;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
  // Audit log & workflow fields
  lockedAt?: string;
  lockedBy?: string;
  unlockedAt?: string;
  unlockedBy?: string;
  completedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  status?: PostStatus;
  adaptations?: PlatformAdaptations;
  imageUrl?: string | null;
  userId?: string;
  userEmail?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  status?: PostStatus;
  adaptations?: PlatformAdaptations;
  imageUrl?: string | null;
  userEmail?: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | null;
  fieldErrors?: {
    title?: string[];
    content?: string[];
  };
}

export interface BulkDeleteResult {
  deletedCount: number;
  skippedLockedCount: number;
  skippedLockedTitles?: string[];
}

