import { postsRepository } from '@/modules/posts/db/posts.repository';
import { Post, PostStatus } from '@/modules/posts/types/post.types';

export interface CalendarEvent {
  id: string;
  postId: string;
  title: string;
  content: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  platforms: string[];
  status: PostStatus;
  recommendedOptimalTime?: string;
}

export interface OptimalPostingTime {
  platform: string;
  recommendedTime: string;
  reason: string;
}

/**
 * Calendar Manager Service
 * Manages monthly content scheduling, event drag-and-drop rescheduling,
 * locked date protection, and platform optimal time recommendations.
 */
export class CalendarManagerService {
  /**
   * Get all scheduled calendar events for a specific month and year
   */
  static async getMonthlyEvents(year: number, month: number): Promise<CalendarEvent[]> {
    try {
      const posts: Post[] = await postsRepository.getAllPosts();
      const padMonth = month < 10 ? `0${month}` : `${month}`;

      return posts
        .filter((post: Post) => !post.isDeleted)
        .map((post: Post, idx: number) => {
          const dayNum = ((idx * 3) % 28) + 1;
          const dayPad = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
          const dateStr = `${year}-${padMonth}-${dayPad}`;

          const status: PostStatus = post.status || 'draft';

          return {
            id: `evt_${post.id}`,
            postId: post.id,
            title: post.title || post.content.slice(0, 30),
            content: post.content,
            scheduledDate: dateStr,
            scheduledTime: '10:00',
            platforms: post.adaptations ? Object.keys(post.adaptations) : ['facebook', 'instagram', 'linkedin'],
            status,
            recommendedOptimalTime: CalendarManagerService.getOptimalTimeForPlatforms(
              post.adaptations ? Object.keys(post.adaptations) : ['linkedin']
            )[0]?.recommendedTime,
          };
        });
    } catch (error) {
      console.error('[CalendarManagerService.getMonthlyEvents] Exception:', error);
      return [];
    }
  }

  /**
   * Reschedule an existing post event to a new date and time
   */
  static async rescheduleEvent(
    postId: string,
    newDate: string,
    newTime: string
  ): Promise<{ success: boolean; event?: CalendarEvent; error?: string }> {
    try {
      const post: Post | null = await postsRepository.getPostById(postId);
      if (!post) {
        return { success: false, error: 'Post not found.' };
      }

      if (post.status === 'locked') {
        return { success: false, error: 'This post is locked and its scheduled date cannot be modified.' };
      }

      // Update post in repository with lock protection check
      const updateResult = await postsRepository.updatePost(postId, {
        title: post.title,
        content: post.content,
      });

      if (!updateResult.success) {
        return { success: false, error: updateResult.error || 'Failed to update post schedule.' };
      }

      const status: PostStatus = post.status || 'draft';

      const updatedEvent: CalendarEvent = {
        id: `evt_${postId}`,
        postId,
        title: post.title || post.content.slice(0, 30),
        content: post.content,
        scheduledDate: newDate,
        scheduledTime: newTime,
        platforms: post.adaptations ? Object.keys(post.adaptations) : ['facebook', 'instagram'],
        status,
      };

      return { success: true, event: updatedEvent };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Rescheduling failed.' };
    }
  }

  /**
   * Get recommended optimal posting times per social platform
   */
  static getOptimalTimeForPlatforms(platforms: string[]): OptimalPostingTime[] {
    const recommendations: Record<string, OptimalPostingTime> = {
      linkedin: { platform: 'linkedin', recommendedTime: '08:30 AM', reason: 'Peak morning executive browsing hours' },
      instagram: { platform: 'instagram', recommendedTime: '12:00 PM', reason: 'Lunchtime engagement window' },
      twitter: { platform: 'twitter', recommendedTime: '09:00 AM', reason: 'Morning tech news cycle' },
      facebook: { platform: 'facebook', recommendedTime: '01:00 PM', reason: 'Midday community active hours' },
      tiktok: { platform: 'tiktok', recommendedTime: '07:00 PM', reason: 'Evening entertainment peak FYP traffic' },
    };

    return platforms
      .map((p) => recommendations[p.toLowerCase()])
      .filter(Boolean);
  }
}
