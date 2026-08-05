export interface ScheduledPostItem {
  id: string;
  title: string;
  platform: string;
  date: string;
  time: string;
  status: 'Queued' | 'Published' | 'Draft';
  mediaPrompt?: string;
  hashtags?: string[];
  createdAt: string;
}

const CALENDAR_STORAGE_KEY = 'minipost_studio_calendar_v1';

export class StudioCalendarService {
  static getSamplePosts(): ScheduledPostItem[] {
    return [
      {
        id: 'cal_1',
        title: 'Product Launch Announcement 🚀',
        platform: 'LinkedIn',
        date: '2026-08-01',
        time: '10:00 AM',
        status: 'Queued',
        mediaPrompt: 'Modern sleek 3D render of AI post creator interface with cyan neon accents',
        hashtags: ['#ProductLaunch', '#AI', '#LinkedInGrowth'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cal_2',
        title: 'AI Automation Workflow Tips',
        platform: 'Twitter (X)',
        date: '2026-08-02',
        time: '02:30 PM',
        status: 'Queued',
        mediaPrompt: 'Dark mode code snippet card showcasing AI orchestration pipeline',
        hashtags: ['#BuildInPublic', '#Tech', '#AIStudio'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cal_3',
        title: 'Behind the Scenes Creator Reel',
        platform: 'Instagram Feed',
        date: '2026-08-04',
        time: '09:00 AM',
        status: 'Draft',
        mediaPrompt: 'Vertical vibrant gradient photo card highlighting studio metrics',
        hashtags: ['#ContentCreator', '#StudioLife'],
        createdAt: new Date().toISOString(),
      },
    ];
  }

  static getStoredPosts(): ScheduledPostItem[] {
    if (typeof window === 'undefined') {
      return this.getSamplePosts();
    }
    try {
      const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load calendar posts from storage', e);
    }
    return this.getSamplePosts();
  }

  static schedulePost(post: Omit<ScheduledPostItem, 'id' | 'createdAt'>): ScheduledPostItem[] {
    const current = this.getStoredPosts();
    const newPost: ScheduledPostItem = {
      ...post,
      id: `cal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPost, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist calendar post', e);
      }
    }
    return updated;
  }

  static updatePostStatus(id: string, status: ScheduledPostItem['status']): ScheduledPostItem[] {
    const current = this.getStoredPosts();
    const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update calendar post status', e);
      }
    }
    return updated;
  }

  static deletePost(id: string): ScheduledPostItem[] {
    const current = this.getStoredPosts();
    const updated = current.filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to delete calendar post', e);
      }
    }
    return updated;
  }

  static getOptimalPostTimes() {
    return [
      { platform: 'LinkedIn', bestTime: '09:00 AM', day: 'Tuesday', engagement: 'High (94%)' },
      { platform: 'Instagram Feed', bestTime: '06:00 PM', day: 'Wednesday', engagement: 'Peak (98%)' },
      { platform: 'Twitter (X)', bestTime: '12:00 PM', day: 'Thursday', engagement: 'Very High (91%)' },
      { platform: 'Facebook', bestTime: '01:00 PM', day: 'Friday', engagement: 'High (88%)' },
      { platform: 'TikTok', bestTime: '08:00 PM', day: 'Saturday', engagement: 'Peak (96%)' },
      { platform: 'YouTube', bestTime: '03:00 PM', day: 'Sunday', engagement: 'High (92%)' },
    ];
  }
}

