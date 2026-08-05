export interface DispatchExecutionLog {
  id: string;
  postId?: string;
  title: string;
  platform: string;
  status: 'Dispatched' | 'Retrying' | 'Failed' | 'Queued';
  timestamp: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export interface DispatchRequest {
  postId?: string;
  title: string;
  content: string;
  platforms: string[];
  mediaUrl?: string;
  mediaPrompt?: string;
  scheduledTime?: string;
}

const DISPATCH_LOGS_STORAGE_KEY = 'minipost_backend_dispatch_logs_v1';

export class PublishingDispatchService {
  static getSupportedPlatforms(): string[] {
    return [
      'Facebook',
      'Twitter (X)',
      'LinkedIn',
      'Instagram Feed',
      'Instagram Story',
      'YouTube',
      'TikTok',
      'Google Business',
      'Bluesky',
      'Threads',
      'Telegram',
    ];
  }

  static getStoredDispatchLogs(): DispatchExecutionLog[] {
    if (typeof window === 'undefined') {
      return this.getSampleLogs();
    }
    try {
      const raw = localStorage.getItem(DISPATCH_LOGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load backend dispatch logs', e);
    }
    return this.getSampleLogs();
  }

  static async dispatchPost(request: DispatchRequest): Promise<{ success: boolean; logs: DispatchExecutionLog[] }> {
    const currentLogs = this.getStoredDispatchLogs();
    const newLogs: DispatchExecutionLog[] = request.platforms.map((platform) => ({
      id: `disp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      postId: request.postId,
      title: request.title,
      platform,
      status: 'Dispatched' as const,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3,
    }));

    const updated = [...newLogs, ...currentLogs];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DISPATCH_LOGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist dispatch logs', e);
      }
    }

    return { success: true, logs: updated };
  }

  static retryFailedDispatch(dispatchId: string): DispatchExecutionLog[] {
    const currentLogs = this.getStoredDispatchLogs();
    const updated = currentLogs.map((log) => {
      if (log.id === dispatchId) {
        return {
          ...log,
          status: 'Dispatched' as const,
          timestamp: new Date().toISOString(),
          retryCount: log.retryCount + 1,
        };
      }
      return log;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DISPATCH_LOGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update retry log', e);
      }
    }

    return updated;
  }

  static getSampleLogs(): DispatchExecutionLog[] {
    return [
      {
        id: 'disp_101',
        title: 'Q3 Product Announcement & Features',
        platform: 'LinkedIn',
        status: 'Dispatched',
        timestamp: new Date().toISOString(),
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: 'disp_102',
        title: 'Q3 Product Announcement & Features',
        platform: 'Twitter (X)',
        status: 'Dispatched',
        timestamp: new Date().toISOString(),
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: 'disp_103',
        title: 'Behind the Scenes Story Reel',
        platform: 'Instagram Story',
        status: 'Retrying',
        timestamp: new Date().toISOString(),
        errorMessage: 'Temporary rate limit reached, retrying in 30 seconds',
        retryCount: 1,
        maxRetries: 3,
      },
    ];
  }
}
