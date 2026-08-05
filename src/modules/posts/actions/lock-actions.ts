'use server';

import { revalidatePath } from 'next/cache';
import { postsRepository } from '../db/posts.repository';
import { ActionResult, Post, PostStatus, BulkDeleteResult } from '../types/post.types';

export async function toggleLockPostAction(
  id: string,
  userEmail?: string
): Promise<ActionResult<{ isLocked: boolean; post: Post }>> {
  try {
    if (!id) {
      return { success: false, error: 'Post ID is required.' };
    }

    const result = await postsRepository.toggleLockPost(id, userEmail);

    if (!result.success || !result.post) {
      return { success: false, error: result.error || 'Failed to toggle lock status.' };
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/posts/${id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        isLocked: Boolean(result.isLocked),
        post: result.post,
      },
    };
  } catch (error: any) {
    console.error('[toggleLockPostAction] Exception:', error);
    return { success: false, error: error?.message || 'Server error while toggling post lock.' };
  }
}

export async function updatePostStatusAction(
  id: string,
  status: PostStatus,
  userEmail?: string
): Promise<ActionResult<Post>> {
  try {
    if (!id || !status) {
      return { success: false, error: 'Invalid post ID or status.' };
    }

    const result = await postsRepository.updatePost(id, { status }, userEmail);

    if (!result.success || !result.post) {
      return { success: false, error: result.error || 'Failed to update status.' };
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/posts/${id}`);
    revalidatePath('/dashboard');

    return { success: true, data: result.post };
  } catch (error: any) {
    console.error('[updatePostStatusAction] Exception:', error);
    return { success: false, error: error?.message || 'Server error while updating post status.' };
  }
}

export async function deletePostAction(
  id: string,
  userEmail?: string
): Promise<ActionResult<void>> {
  try {
    if (!id) {
      return { success: false, error: 'Post ID is required.' };
    }

    const result = await postsRepository.deletePost(id, userEmail);

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to delete post.' };
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/posts/${id}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error('[deletePostAction] Exception:', error);
    return { success: false, error: error?.message || 'Server error while deleting post.' };
  }
}

export async function restorePostAction(
  id: string,
  userEmail?: string
): Promise<ActionResult<void>> {
  try {
    if (!id) {
      return { success: false, error: 'Post ID is required.' };
    }

    const result = await postsRepository.restorePost(id, userEmail);

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to restore post.' };
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/posts/${id}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error('[restorePostAction] Exception:', error);
    return { success: false, error: error?.message || 'Server error while restoring post.' };
  }
}

export async function bulkDeletePostsAction(
  ids: string[],
  userEmail?: string
): Promise<ActionResult<BulkDeleteResult>> {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return { success: false, error: 'No posts selected for deletion.' };
    }

    const summary = await postsRepository.bulkDeletePosts(ids, userEmail);

    revalidatePath('/', 'layout');
    revalidatePath('/dashboard');

    return { success: true, data: summary };
  } catch (error: any) {
    console.error('[bulkDeletePostsAction] Exception:', error);
    return { success: false, error: error?.message || 'Server error during bulk deletion.' };
  }
}
