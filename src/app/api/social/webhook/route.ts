import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Verify HMAC-SHA256 signature from Postproxy using rotated keys
 */
function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret =
    process.env.POSTPROXY_WEBHOOK_SECRET ||
    process.env.POST_PROXY_MEGA_API_KEY ||
    process.env.POST_PROXY_MASTER_API_KEY ||
    process.env.POST_PROXY_DEFAULT_API_KEY ||
    process.env.POSTPROXY_API_KEY;

  // If no secret configured in env, allow pass-through in development/sandbox mode
  if (!secret) {
    console.warn('[Postproxy Webhook] No webhook secret configured in environment.');
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const cleanHeader = signatureHeader.replace(/^sha256=/i, '').trim();

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const headerBuffer = Buffer.from(cleanHeader, 'hex');

    if (expectedBuffer.length !== headerBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, headerBuffer);
  } catch (err) {
    console.error('[Postproxy Webhook] Signature verification error:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Extract raw body text
    const rawBody = await req.text();

    // 2. Read Postproxy Signature header
    const signatureHeader =
      req.headers.get('x-postproxy-signature') ||
      req.headers.get('X-PostProxy-Signature') ||
      req.headers.get('x-signature');

    // 3. Verify HMAC-SHA256 Signature
    const isValid = verifySignature(rawBody, signatureHeader);
    if (!isValid) {
      console.warn('[Postproxy Webhook] Signature verification failed.');
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid signature' },
        { status: 401 }
      );
    }

    // 4. Parse JSON Event Payload
    const event = JSON.parse(rawBody);
    const eventType = event.type || event.event || 'unknown';
    const payload = event.data || event.payload || event;

    console.log(`[Postproxy Webhook] Processing event type: "${eventType}"`);

    // 5. Handle Core Event Types
    switch (eventType) {
      case 'post.published':
      case 'post.failed': {
        const postId = payload.postId || payload.id;
        const status = eventType === 'post.published' ? 'published' : 'failed';
        const userId = payload.userId || payload.profileGroupId;

        if (postId) {
          try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
              status,
              updatedAt: new Date().toISOString(),
              postproxyMeta: payload,
            });
          } catch {
            // Fallback: Create or update document if it does not exist
            const postRef = doc(db, 'posts', postId);
            await setDoc(
              postRef,
              {
                id: postId,
                status,
                userId: userId || 'unknown',
                updatedAt: new Date().toISOString(),
                postproxyMeta: payload,
              },
              { merge: true }
            );
          }
        }
        break;
      }

      case 'comment.created':
      case 'message.created':
      case 'interaction.created': {
        const interactionId = payload.id || `int_${Date.now()}`;
        const userId = payload.userId || payload.profileGroupId || 'guest';

        const interactionRef = doc(db, `users/${userId}/interactions`, interactionId);
        await setDoc(
          interactionRef,
          {
            id: interactionId,
            profileGroupId: payload.profileGroupId || '',
            platform: payload.platform || 'social',
            type: payload.type || (eventType.startsWith('message') ? 'dm' : 'comment'),
            senderName: payload.senderName || payload.authorName || 'Social User',
            content: payload.content || payload.text || '',
            createdAt: payload.createdAt || new Date().toISOString(),
            rawEvent: payload,
          },
          { merge: true }
        );
        break;
      }

      default:
        console.log(`[Postproxy Webhook] Unhandled event type "${eventType}". Acknowledged.`);
        break;
    }

    // 6. Always return HTTP 200 OK promptly to prevent webhook retries
    return NextResponse.json({ received: true, eventType });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[Postproxy Webhook] Exception:', error);
    // Return 200 with error summary so Webhook provider doesn't spam retries on parse errors
    return NextResponse.json({ received: true, warning: errorMsg });
  }
}
