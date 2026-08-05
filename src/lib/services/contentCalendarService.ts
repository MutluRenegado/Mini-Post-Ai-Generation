export interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM AM/PM
  timezone: string;
  status: 'Published' | 'Scheduled' | 'Draft' | 'History';
  mediaPrompt?: string;
  bodySnippet?: string;
  createdAt: string;
}

const CALENDAR_STORAGE_KEY = 'minipost_backend_calendar_events_v1';

export class ContentCalendarService {
  static getCalendarEvents(statusFilter?: string): CalendarEvent[] {
    const all = this.getStoredEvents();
    if (!statusFilter || statusFilter === 'all') return all;
    return all.filter((e) => e.status.toLowerCase() === statusFilter.toLowerCase());
  }

  static getStoredEvents(): CalendarEvent[] {
    if (typeof window === 'undefined') {
      return this.getSampleEvents();
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
      console.warn('Failed to load calendar events', e);
    }
    return this.getSampleEvents();
  }

  static createCalendarEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent[] {
    const current = this.getStoredEvents();
    const newEvt: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEvt, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save calendar event', e);
      }
    }
    return updated;
  }

  static getSampleEvents(): CalendarEvent[] {
    return [
      {
        id: 'evt_1',
        title: 'Launch Announcement Post 🚀',
        platform: 'LinkedIn',
        scheduledDate: '2026-08-01',
        scheduledTime: '10:00 AM',
        timezone: 'UTC',
        status: 'Scheduled',
        bodySnippet: 'Excited to unveil the new AI Creator Studio capabilities...',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'evt_2',
        title: 'Weekly Tech Tips Reel',
        platform: 'Instagram Feed',
        scheduledDate: '2026-08-02',
        scheduledTime: '06:00 PM',
        timezone: 'UTC',
        status: 'Published',
        bodySnippet: 'Top 3 productivity hacks for SaaS builders in 2026...',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'evt_3',
        title: 'Build in Public Update #42',
        platform: 'Twitter (X)',
        scheduledDate: '2026-08-04',
        scheduledTime: '02:00 PM',
        timezone: 'UTC',
        status: 'Draft',
        bodySnippet: 'Here is how we optimized multi-channel post generation...',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
