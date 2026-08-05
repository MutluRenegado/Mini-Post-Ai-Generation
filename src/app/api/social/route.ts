import { NextRequest, NextResponse } from 'next/server';
import { getConnectAuthUrl, getUnifiedInteractions, replyToInteraction } from '@/lib/postproxy';

/**
 * Consolidated Social API Route (GET, POST)
 */
export async function GET(req: NextRequest) {
  try {
    const profileGroupId = req.nextUrl.searchParams.get('profileGroupId') || '';
    const interactions = await getUnifiedInteractions(profileGroupId);
    return NextResponse.json({ success: true, profileGroupId, count: interactions.length, interactions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch social inbox.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || req.nextUrl.searchParams.get('action');

    if (action === 'connect' || body.platform) {
      const { profileGroupId, platform, redirectUrl } = body;
      if (!profileGroupId || !platform) {
        return NextResponse.json({ success: false, error: 'Missing profileGroupId or platform.' }, { status: 400 });
      }
      const authUrlRes = await getConnectAuthUrl(profileGroupId, platform, redirectUrl);
      return NextResponse.json({ success: true, url: authUrlRes.url, platform, profileGroupId });
    }

    if (action === 'reply' || body.interactionId) {
      const { profileGroupId, interactionId, replyText, text } = body;
      if (!profileGroupId || !interactionId) {
        return NextResponse.json({ success: false, error: 'Missing profileGroupId or interactionId.' }, { status: 400 });
      }
      const res = await replyToInteraction(profileGroupId, interactionId, replyText || text);
      return NextResponse.json({ success: true, result: res });
    }

    return NextResponse.json({ success: false, error: 'Invalid social action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Social operation failed.' }, { status: 500 });
  }
}
