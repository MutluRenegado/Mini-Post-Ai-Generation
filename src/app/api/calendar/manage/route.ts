import { NextRequest, NextResponse } from 'next/server';
import { CalendarManagerService } from '@/modules/posts/services/calendar-manager.service';

export async function GET(req: NextRequest) {
  try {
    const year = Number(req.nextUrl.searchParams.get('year')) || 2026;
    const month = Number(req.nextUrl.searchParams.get('month')) || 7;

    const events = await CalendarManagerService.getMonthlyEvents(year, month);
    return NextResponse.json({ success: true, year, month, count: events.length, events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch calendar events.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, postId, newDate, newTime, platforms } = body;

    if (action === 'reschedule') {
      if (!postId || !newDate) {
        return NextResponse.json({ success: false, error: 'Missing postId or newDate.' }, { status: 400 });
      }

      const result = await CalendarManagerService.rescheduleEvent(postId, newDate, newTime || '10:00');
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    if (action === 'optimal_times') {
      const activePlatforms = Array.isArray(platforms) ? platforms : ['linkedin', 'instagram', 'twitter', 'tiktok'];
      const optimalTimes = CalendarManagerService.getOptimalTimeForPlatforms(activePlatforms);
      return NextResponse.json({ success: true, optimalTimes });
    }

    return NextResponse.json({ success: false, error: 'Invalid calendar management action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Calendar operation failed.' }, { status: 500 });
  }
}
