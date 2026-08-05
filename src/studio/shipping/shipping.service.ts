import { Publisher } from '../publishing/Publisher';
import { StudioPost } from '../types/studio.types';

export interface DispatchLogItem {
  id: string;
  platform: string;
  title: string;
  status: 'Dispatched' | 'Retrying' | 'Failed' | 'Queued';
  timestamp: string;
  retryCount?: number;
}

export interface ConnectedChannelStatus {
  name: string;
  status: 'Active' | 'Warning' | 'Offline';
  accountName: string;
  lastSync: string;
}

const SHIPPING_STORAGE_KEY = 'minipost_studio_shipping_v1';

export class ShippingEngineService {
  static getSampleLogs(): DispatchLogItem[] {
    return [
      { id: '1', platform: 'LinkedIn', title: 'Product Launch Announcement', status: 'Dispatched', timestamp: 'Today, 10:00 AM', retryCount: 0 },
      { id: '2', platform: 'X / Twitter', title: 'AI Automation Workflow Tips', status: 'Dispatched', timestamp: 'Today, 09:30 AM', retryCount: 0 },
      { id: '3', platform: 'Instagram Feed', title: 'Behind the Scenes Reel', status: 'Retrying', timestamp: 'Today, 09:00 AM', retryCount: 1 },
      { id: '4', platform: 'TikTok', title: 'Creator Studio Demo Video', status: 'Dispatched', timestamp: 'Yesterday, 04:15 PM', retryCount: 0 },
      { id: '5', platform: 'YouTube', title: 'Weekly Tech Shorts', status: 'Dispatched', timestamp: 'Yesterday, 02:00 PM', retryCount: 0 },
    ];
  }

  static getStoredLogs(): DispatchLogItem[] {
    if (typeof window === 'undefined') {
      return this.getSampleLogs();
    }
    try {
      const raw = localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return this.getSampleLogs();
  }

  static addDispatchLog(log: Omit<DispatchLogItem, 'id' | 'timestamp'>): DispatchLogItem[] {
    const current = this.getStoredLogs();
    const newLog: DispatchLogItem = {
      ...log,
      id: `dispatch_${Date.now()}`,
      timestamp: 'Just now',
      retryCount: log.retryCount || 0,
    };
    const updated = [newLog, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save dispatch log', e);
      }
    }
    return updated;
  }

  static retryDispatch(id: string): DispatchLogItem[] {
    const current = this.getStoredLogs();
    const updated = current.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Dispatched' as const,
          timestamp: 'Just now (Retried)',
          retryCount: (item.retryCount || 0) + 1,
        };
      }
      return item;
    });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update retry log', e);
      }
    }
    return updated;
  }

  static getConnectedChannels(): ConnectedChannelStatus[] {
    return [
      { name: 'LinkedIn', status: 'Active', accountName: '@minipost-official', lastSync: '1 min ago' },
      { name: 'Twitter (X)', status: 'Active', accountName: '@MiniPostApp', lastSync: '3 mins ago' },
      { name: 'Facebook', status: 'Active', accountName: 'Mini Post Studio Page', lastSync: '5 mins ago' },
      { name: 'Instagram Feed', status: 'Active', accountName: '@minipost_studio', lastSync: '2 mins ago' },
      { name: 'Instagram Story', status: 'Active', accountName: '@minipost_studio', lastSync: '2 mins ago' },
      { name: 'YouTube', status: 'Active', accountName: 'Mini Post Official Channel', lastSync: '10 mins ago' },
      { name: 'TikTok', status: 'Active', accountName: '@minipost_tiktok', lastSync: '4 mins ago' },
      { name: 'Google Business', status: 'Active', accountName: 'Mini Post HQ', lastSync: '12 mins ago' },
      { name: 'Bluesky', status: 'Active', accountName: '@minipost.bsky.social', lastSync: '8 mins ago' },
      { name: 'Threads', status: 'Active', accountName: '@minipost_threads', lastSync: '6 mins ago' },
      { name: 'Telegram', status: 'Active', accountName: '@MiniPostNewsChannel', lastSync: '1 min ago' },
    ];
  }
}

