import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.redirect(`${origin}/login?error=missing_user_id`);
  }

  try {
    // 1. Fetch user profile document from Firestore (`users/{userId}`)
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    let isSubscribed = false;
    let subscriptionStatus = 'unpaid';

    if (docSnap.exists()) {
      const data = docSnap.data();
      subscriptionStatus = data.subscriptionStatus || 'unpaid';
      isSubscribed =
        data.isSubscribed === true ||
        subscriptionStatus === 'active' ||
        subscriptionStatus === 'pro' ||
        Boolean(data.stripeCustomerId);
    }

    // 2 & 3. If unsubscribed or status not active -> Redirect to /subscribe
    if (!isSubscribed || subscriptionStatus === 'unpaid') {
      return NextResponse.redirect(`${origin}/subscribe?userId=${userId}`);
    }

    // 4. If subscribed -> Redirect to /dashboard
    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (error) {
    console.error('[GET /api/auth/callback] Firestore lookup exception:', error);
    return NextResponse.redirect(`${origin}/subscribe?userId=${userId}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, redirectUrl: '/subscribe' });
    }

    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    let isSubscribed = false;
    let subscriptionStatus = 'unpaid';

    if (docSnap.exists()) {
      const data = docSnap.data();
      subscriptionStatus = data.subscriptionStatus || 'unpaid';
      isSubscribed =
        data.isSubscribed === true ||
        subscriptionStatus === 'active' ||
        subscriptionStatus === 'pro' ||
        Boolean(data.stripeCustomerId);
    }

    const redirectUrl = isSubscribed && subscriptionStatus !== 'unpaid' ? '/dashboard' : '/subscribe';

    return NextResponse.json({
      success: true,
      isSubscribed,
      subscriptionStatus,
      redirectUrl,
    });
  } catch (error) {
    console.error('[POST /api/auth/callback] Exception:', error);
    return NextResponse.json({ success: false, redirectUrl: '/subscribe' });
  }
}
