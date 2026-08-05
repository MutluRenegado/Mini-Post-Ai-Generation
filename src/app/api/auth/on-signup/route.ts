import { NextRequest, NextResponse } from 'next/server';
import { createProfileGroup } from '@/lib/postproxy';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing required string field "userId".' },
        { status: 400 }
      );
    }

    // 1 & 2. Provision tenant profile group in Postproxy
    const profileGroup = await createProfileGroup(userId);
    const profileGroupId = profileGroup.profileGroupId;

    // 3. Save profileGroupId into Firestore under `/users/{userId}`
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        userId,
        userEmail: userEmail || 'user@minipost.app',
        profileGroupId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      userId,
      profileGroupId,
      userEmail: userEmail || null,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[POST /api/auth/on-signup] Exception:', error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
