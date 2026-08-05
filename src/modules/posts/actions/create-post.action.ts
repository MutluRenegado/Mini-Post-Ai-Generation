'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { postsRepository } from '../db/posts.repository';
import { ActionResult, Post, PlatformAdaptations } from '../types/post.types';

const createPostSchema = z.object({
  title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }),
  content: z.string().trim().min(1, { message: 'Content cannot be empty' }),
  adaptations: z.record(z.string(), z.string()).optional(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
});

export async function createPostAction(input: {
  title: string;
  content: string;
  adaptations?: PlatformAdaptations;
  userId?: string;
  userEmail?: string;
}): Promise<ActionResult<Post>> {
  try {
    const validationResult = createPostSchema.safeParse(input);

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Validation failed.',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const createdPost = await postsRepository.createPost(validationResult.data);

    if (!createdPost) {
      return { success: false, error: 'Failed to write post to Firebase Firestore.' };
    }

    // Force Next.js router cache to clear and re-render feed
    revalidatePath('/', 'layout');

    return { success: true, data: createdPost };
  } catch (error) {
    console.error('[createPostAction] Exception:', error);
    return { success: false, error: 'Unexpected server error while saving post.' };
  }
}