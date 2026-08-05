import { Post, CreatePostInput, UpdatePostInput, PostStatus, BulkDeleteResult } from '../types/post.types';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';

// In-memory store fallback for offline or unconfigured environment
const fallbackPostsStore: Post[] = [
  {
    id: 'demo-1',
    title: '🚀 Launching Mini Post App: 1 Master Template → All Platforms',
    content: '🌌 [MINI POST APP EXECUTIVE INTEL] • HIGH IMPACT REPORT\n\nCreate your content once and automatically adapt it into optimized posts for Facebook, Instagram, LinkedIn, X, and TikTok with Gemini AI Flash.\n\n✨ Architected for visionary founders. Save & share with your leadership network.',
    status: 'completed',
    adaptations: {
      facebook: '🌌 [MINI POST APP EXECUTIVE INTEL] • HIGH IMPACT REPORT\n\n🚀 Launching Mini Post App! Create your content once and automatically adapt it for FB, IG, LinkedIn, X, and TikTok. Try it free!\n\n✨ Architected for visionary founders. Save & share with your leadership network. #Innovation #Productivity',
      instagram: '🌌 [MINI POST APP EXECUTIVE INTEL] • HIGH IMPACT REPORT\n\nTransform 1 idea into 5 social platforms instantly ✨\n\nNo more wasting hours reformatting captions manually. Swipe to see live previews! ➡️\n\nSave this post! 📌\n.\n.\n#AITools #SocialMediaStrategy #ContentCreator',
      linkedin: '🌌 [MINI POST APP EXECUTIVE INTEL] • HIGH IMPACT REPORT\n\nExcited to introduce our multi-platform studio.\n\nKey features:\n• High-speed AI engine (Gemini AI Flash)\n• Real-time platform previews\n• Firestore persistent storage\n\nWhat content tools do you rely on daily?\n\n#TechLeadership #Saas #Productivity',
      twitter: '🌌 [MINI POST APP EXECUTIVE INTEL]\n\nTransform 1 master post into FB, IG, LinkedIn & TikTok posts in seconds ⚡ Powered by Gemini AI Flash. #AITools #BuildInPublic',
      tiktok: '🌌 [MINI POST APP EXECUTIVE INTEL]\n\n[HOOK]: Stop formatting social media posts manually! Do this instead 😱\n\n[SCRIPT]: 1-click adapt your master template for all platforms.\n\n[CTA]: Comment link below! 🚀 #TechTok #AITricks',
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    isDeleted: false,
  },
];

/**
 * Fast timeout wrapper to prevent SSR hanging or unhandled promise rejection overlays
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs = 1500): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Firestore timeout after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    promise
      .then((res) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(res);
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      });
  });
}

export class PostsRepository {
  /**
   * Centralized check if a post is locked
   */
  public isPostLocked(post: Post): boolean {
    return post.status === 'locked';
  }

  /**
   * Normalize document data to Post model with backward compatibility
   */
  private mapDocToPost(id: string, data: any): Post {
    const rawStatus = data.status as PostStatus | undefined;
    const status: PostStatus = rawStatus || 'draft';

    return {
      id,
      title: data.title || '',
      content: data.content || '',
      status,
      adaptations: data.adaptations || {},
      imageUrl: data.imageUrl || null,
      userId: data.userId,
      userEmail: data.userEmail,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      lockedAt: data.lockedAt,
      lockedBy: data.lockedBy,
      unlockedAt: data.unlockedAt,
      unlockedBy: data.unlockedBy,
      completedAt: data.completedAt,
      isDeleted: Boolean(data.isDeleted),
      deletedAt: data.deletedAt,
      deletedBy: data.deletedBy,
    };
  }

  /**
   * Retrieve all posts from Firebase Firestore (or fallback store)
   */
  public async getAllPosts(includeDeleted = false): Promise<Post[]> {
    try {
      if (typeof window === 'undefined') {
        return fallbackPostsStore
          .filter((p) => includeDeleted || !p.isDeleted)
          .map((p) => ({ ...p, status: p.status || 'draft' }));
      }

      const postsRef = collection(db, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
      
      const querySnapshot = await withTimeout(getDocs(q), 1500);

      if (querySnapshot && !querySnapshot.empty) {
        const posts: Post[] = [];
        querySnapshot.forEach((docSnap) => {
          const post = this.mapDocToPost(docSnap.id, docSnap.data());
          if (includeDeleted || !post.isDeleted) {
            posts.push(post);
          }
        });
        return posts;
      }
      return fallbackPostsStore
        .filter((p) => includeDeleted || !p.isDeleted)
        .map((p) => ({ ...p, status: p.status || 'draft' }));
    } catch {
      return fallbackPostsStore
        .filter((p) => includeDeleted || !p.isDeleted)
        .map((p) => ({ ...p, status: p.status || 'draft' }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  /**
   * Retrieve a post by ID from Firestore
   */
  public async getPostById(id: string): Promise<Post | null> {
    try {
      if (!id || typeof id !== 'string') return null;

      // Check fallback first for demo posts
      const fallback = fallbackPostsStore.find((p) => p.id === id);
      if (fallback) return { ...fallback, status: fallback.status || 'draft' };

      const docRef = doc(db, 'posts', id);
      const docSnap = await withTimeout(getDoc(docRef), 1500);

      if (docSnap && docSnap.exists()) {
        return this.mapDocToPost(docSnap.id, docSnap.data());
      }
      return null;
    } catch {
      const fallback = fallbackPostsStore.find((p) => p.id === id);
      return fallback ? { ...fallback, status: fallback.status || 'draft' } : null;
    }
  }

  /**
   * Create a new post in Firebase Firestore
   */
  public async createPost(input: CreatePostInput): Promise<Post | null> {
    try {
      const now = new Date().toISOString();
      const initialStatus: PostStatus = input.status || 'draft';
      
      const postPayload: Record<string, any> = {
        title: input.title.trim(),
        content: input.content.trim(),
        status: initialStatus,
        adaptations: input.adaptations || {},
        imageUrl: input.imageUrl || null,
        userId: input.userId || 'anonymous',
        userEmail: input.userEmail || 'guest@minipost.app',
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      };

      if (initialStatus === 'completed') {
        postPayload.completedAt = now;
      } else if (initialStatus === 'locked') {
        postPayload.lockedAt = now;
        postPayload.lockedBy = input.userEmail || input.userId || 'anonymous';
      }

      try {
        const docRef = await withTimeout(addDoc(collection(db, 'posts'), postPayload), 8000);
        return {
          id: docRef.id,
          ...postPayload,
        } as Post;
      } catch (fsError) {
        console.warn('[PostsRepository.createPost] Firestore write fallback:', fsError);
        const newLocalPost: Post = {
          id: `local-${crypto.randomUUID()}`,
          ...postPayload,
        } as Post;
        fallbackPostsStore.unshift(newLocalPost);
        return { ...newLocalPost };
      }
    } catch (error) {
      console.error('[PostsRepository.createPost] Exception:', error);
      return null;
    }
  }

  /**
   * Update an existing post with CENTRALIZED LOCK PROTECTION
   */
  public async updatePost(
    id: string,
    updates: UpdatePostInput,
    performingUser?: string
  ): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const existing = await this.getPostById(id);
      if (!existing) {
        return { success: false, error: 'Post not found.' };
      }

      // MANDATORY LOCK GUARD: Reject ALL modifications on locked posts (unless unlocking)
      if (existing.status === 'locked' && updates.status !== 'draft' && updates.status !== 'completed' && updates.status !== 'in_progress') {
        return {
          success: false,
          error: 'This post is locked and cannot be modified.',
        };
      }

      const now = new Date().toISOString();
      const updatedFields: Record<string, any> = {
        ...updates,
        updatedAt: now,
      };

      // Handle status workflow updates
      if (updates.status && updates.status !== existing.status) {
        if (updates.status === 'completed') {
          updatedFields.completedAt = now;
        } else if (updates.status === 'locked') {
          updatedFields.lockedAt = now;
          updatedFields.lockedBy = performingUser || updates.userEmail || 'anonymous';
        } else if (existing.status === 'locked') {
          // Document is being unlocked
          updatedFields.unlockedAt = now;
          updatedFields.unlockedBy = performingUser || updates.userEmail || 'anonymous';
        }
      }

      // Update in fallback store
      const fallbackIdx = fallbackPostsStore.findIndex((p) => p.id === id);
      if (fallbackIdx !== -1) {
        fallbackPostsStore[fallbackIdx] = {
          ...fallbackPostsStore[fallbackIdx],
          ...updatedFields,
        };
      }

      // Update in Firestore
      try {
        const docRef = doc(db, 'posts', id);
        await withTimeout(updateDoc(docRef, updatedFields), 2000);
      } catch (fsErr) {
        console.warn('[PostsRepository.updatePost] Firestore update fallback:', fsErr);
      }

      const mergedPost = { ...existing, ...updatedFields } as Post;
      return { success: true, post: mergedPost };
    } catch (error: any) {
      console.error('[PostsRepository.updatePost] Exception:', error);
      return { success: false, error: error?.message || 'Failed to update post.' };
    }
  }

  /**
   * Toggle lock status on a post (Lock / Unlock) with audit logging
   */
  public async toggleLockPost(
    id: string,
    performingUser?: string
  ): Promise<{ success: boolean; isLocked?: boolean; post?: Post; error?: string }> {
    try {
      const existing = await this.getPostById(id);
      if (!existing) {
        return { success: false, error: 'Post not found.' };
      }

      const now = new Date().toISOString();
      const isCurrentlyLocked = existing.status === 'locked';

      if (isCurrentlyLocked) {
        // Unlock post
        const nextStatus: PostStatus = existing.completedAt ? 'completed' : 'draft';
        const payload = {
          status: nextStatus,
          unlockedAt: now,
          unlockedBy: performingUser || 'anonymous',
          updatedAt: now,
        };

        const fallbackIdx = fallbackPostsStore.findIndex((p) => p.id === id);
        if (fallbackIdx !== -1) {
          fallbackPostsStore[fallbackIdx] = { ...fallbackPostsStore[fallbackIdx], ...payload };
        }

        try {
          await withTimeout(updateDoc(doc(db, 'posts', id), payload), 2000);
        } catch {}

        const updatedPost = { ...existing, ...payload } as Post;
        return { success: true, isLocked: false, post: updatedPost };
      } else {
        // Lock post
        const payload = {
          status: 'locked' as PostStatus,
          lockedAt: now,
          lockedBy: performingUser || 'anonymous',
          updatedAt: now,
        };

        const fallbackIdx = fallbackPostsStore.findIndex((p) => p.id === id);
        if (fallbackIdx !== -1) {
          fallbackPostsStore[fallbackIdx] = { ...fallbackPostsStore[fallbackIdx], ...payload };
        }

        try {
          await withTimeout(updateDoc(doc(db, 'posts', id), payload), 2000);
        } catch {}

        const updatedPost = { ...existing, ...payload } as Post;
        return { success: true, isLocked: true, post: updatedPost };
      }
    } catch (error: any) {
      console.error('[PostsRepository.toggleLockPost] Exception:', error);
      return { success: false, error: error?.message || 'Failed to toggle lock status.' };
    }
  }

  /**
   * SOFT DELETE a post (with mandatory lock check)
   */
  public async deletePost(
    id: string,
    userEmail?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!id) return { success: false, error: 'Invalid post ID.' };

      const existing = await this.getPostById(id);
      if (!existing) {
        return { success: false, error: 'Post not found.' };
      }

      // MANDATORY LOCK GUARD
      if (existing.status === 'locked') {
        return {
          success: false,
          error: 'This post is locked and cannot be deleted until unlocked.',
        };
      }

      const now = new Date().toISOString();
      const softDeletePayload = {
        isDeleted: true,
        deletedAt: now,
        deletedBy: userEmail || 'anonymous',
        updatedAt: now,
      };

      // Soft delete in fallback store
      const index = fallbackPostsStore.findIndex((p) => p.id === id);
      if (index !== -1) {
        fallbackPostsStore[index] = { ...fallbackPostsStore[index], ...softDeletePayload };
      }

      try {
        await withTimeout(updateDoc(doc(db, 'posts', id), softDeletePayload), 2000);
      } catch {
        // Fallback handling
      }

      return { success: true };
    } catch (error: any) {
      console.error('[PostsRepository.deletePost] Exception:', error);
      return { success: false, error: error?.message || 'Failed to delete post.' };
    }
  }

  /**
   * Restore a soft-deleted post
   */
  public async restorePost(
    id: string,
    userEmail?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const existing = await this.getPostById(id);
      if (!existing) return { success: false, error: 'Post not found.' };

      const now = new Date().toISOString();
      const restorePayload = {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: now,
      };

      const index = fallbackPostsStore.findIndex((p) => p.id === id);
      if (index !== -1) {
        fallbackPostsStore[index] = { ...fallbackPostsStore[index], ...restorePayload as any };
      }

      try {
        await withTimeout(updateDoc(doc(db, 'posts', id), restorePayload), 2000);
      } catch {}

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Failed to restore post.' };
    }
  }

  /**
   * Bulk delete posts, skipping locked items automatically
   */
  public async bulkDeletePosts(
    ids: string[],
    userEmail?: string
  ): Promise<BulkDeleteResult> {
    let deletedCount = 0;
    let skippedLockedCount = 0;
    const skippedLockedTitles: string[] = [];

    for (const id of ids) {
      const post = await this.getPostById(id);
      if (!post) continue;

      if (post.status === 'locked') {
        skippedLockedCount++;
        skippedLockedTitles.push(post.title || `Post #${id}`);
      } else {
        const res = await this.deletePost(id, userEmail);
        if (res.success) {
          deletedCount++;
        }
      }
    }

    return {
      deletedCount,
      skippedLockedCount,
      skippedLockedTitles,
    };
  }
}

export const postsRepository = new PostsRepository();
