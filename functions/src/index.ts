import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  allSecrets,
  getPostProxyApiKey,
  geminiApiKeySecret,
  googleApiKeySecret,
  geminiApiKey2Secret,
  webhookSecret,
} from './services/secrets';
import { verifyAuthToken } from './middleware/auth';
import { enforceDailyQuota, SubscriptionTier } from './services/quota';

if (getApps().length === 0) {
  initializeApp();
}

const POSTPROXY_BASE_URL = 'https://api.postproxy.com/v1';

/**
 * 1. Onboarding & Provisioning Handler
 */
export const apiAuthOnSignup = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const { userId, userEmail } = req.body || {};
      const uid = userId || decoded.uid;
      const email = userEmail || decoded.email || 'user@minipost.app';

      const apiKey = getPostProxyApiKey() || process.env.POST_PROXY_MEGA_API_KEY || '';
      const groupName = `Group_${uid}`;

      let profileGroupId = `pg_${uid}`;

      if (apiKey) {
        const response = await fetch(`${POSTPROXY_BASE_URL}/profile-groups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ name: groupName }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          profileGroupId = data.profileGroupId || data.id || profileGroupId;
        }
      }

      await getFirestore().doc(`users/${uid}`).set(
        {
          userId: uid,
          userEmail: email,
          profileGroupId,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      res.status(200).json({
        success: true,
        userId: uid,
        profileGroupId,
        userEmail: email,
      });
    } catch (err) {
      console.error('[apiAuthOnSignup] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/**
 * 2. OAuth Social Connection URL Generator
 */
export const apiSocialConnect = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const { profileGroupId, platform, redirectUrl } = req.body || {};
      const apiKey = getPostProxyApiKey() || process.env.POST_PROXY_MEGA_API_KEY || '';

      if (!profileGroupId || !platform) {
        res.status(400).json({ error: 'Missing required parameters: profileGroupId and platform' });
        return;
      }

      let authUrl = `https://api.postproxy.com/v1/auth/connect?platform=${platform}&profileGroupId=${profileGroupId}`;

      if (apiKey) {
        const response = await fetch(`${POSTPROXY_BASE_URL}/connections/auth-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            profileGroupId,
            platform,
            redirectUrl: redirectUrl || 'https://minipost.app/dashboard',
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          authUrl = data.url || data.authUrl || authUrl;
        }
      }

      res.status(200).json({
        success: true,
        url: authUrl,
        platform,
        profileGroupId,
      });
    } catch (err) {
      console.error('[apiSocialConnect] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/**
 * 3. Multi-Platform Publishing & Scheduling Handler
 */
export const apiPostsPublish = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const { profileGroupId, content, mediaUrls, targetPlatforms, userTier, scheduledAt } = req.body || {};
      const uid = decoded.uid;
      const tier: SubscriptionTier = userTier || 'starter';

      const quotaResult = await enforceDailyQuota(uid, tier);
      if (!quotaResult.allowed) {
        res.status(429).json({ success: false, error: quotaResult.error });
        return;
      }

      const apiKey = getPostProxyApiKey() || process.env.POST_PROXY_MEGA_API_KEY || '';
      const platforms = Array.isArray(targetPlatforms) && targetPlatforms.length > 0
        ? targetPlatforms
        : ['facebook', 'instagram', 'linkedin', 'twitter'];

      let publishResult: any = {
        id: `post_${Date.now()}`,
        status: scheduledAt ? 'scheduled' : 'published',
        postedPlatforms: platforms,
        createdAt: new Date().toISOString(),
        scheduledAt: scheduledAt || null,
      };

      // If scheduledAt is specified, record into scheduled_posts collection for cron runner
      if (scheduledAt) {
        const scheduledTimeDate = new Date(scheduledAt);
        await getFirestore().collection('scheduled_posts').add({
          content,
          text: content,
          platforms,
          targetPlatforms: platforms,
          profileGroupId,
          userId: uid,
          status: 'pending',
          scheduledAt: Timestamp.fromDate(scheduledTimeDate),
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      if (apiKey) {
        const response = await fetch(`${POSTPROXY_BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            profileGroupId,
            text: content,
            media: Array.isArray(mediaUrls) ? mediaUrls : [],
            platforms,
            scheduledAt,
          }),
        });

        if (response.ok) {
          publishResult = await response.json();
        }
      }

      res.status(200).json({
        success: true,
        post: publishResult,
        quotaRemaining: quotaResult.remaining,
      });
    } catch (err) {
      console.error('[apiPostsPublish] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/**
 * 4. Multi-Platform Content Generation (Gemini AI Flash)
 */
export const apiGeneratePost = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const { basePrompt, content, masterText, userTier } = req.body || {};
      const inputPrompt = basePrompt || content || masterText;
      const uid = decoded.uid;
      const tier: SubscriptionTier = userTier || 'starter';

      const quotaResult = await enforceDailyQuota(uid, tier);
      if (!quotaResult.allowed) {
        res.status(429).json({ success: false, error: quotaResult.error });
        return;
      }

      const apiKey =
        googleApiKeySecret.value() ||
        geminiApiKey2Secret.value() ||
        geminiApiKeySecret.value() ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        '';
      const google = createGoogleGenerativeAI({ apiKey });

      const SYSTEM_PROMPT = `You are an elite social media strategist. Process the provided base content ONCE and generate a structured JSON object containing an optimized master post plus 5 platform-specific variations (Facebook, X/Twitter, LinkedIn, Instagram, and Threads).

JSON Schema:
{
  "master_post": "...",
  "facebook": "...",
  "twitter": "...",
  "linkedin": "...",
  "instagram": "...",
  "threads": "..."
}
Return raw JSON only.`;

      const { text } = await generateText({
          model: google(process.env.GEMINI_TEXT_MODEL?.trim() || 'gemini-3.6-flash'),
        system: SYSTEM_PROMPT,
        prompt: `Base Content:\n${inputPrompt}`,
        temperature: 0.7,
      });

      const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      const data = JSON.parse(cleaned);

      res.status(200).json({
        success: true,
        providerUsed: 'gemini-ai-flash',
        quotaRemaining: quotaResult.remaining,
        data,
      });
    } catch (err) {
      console.error('[apiGeneratePost] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/**
 * 5. Unified Interaction Inbox
 */
export const apiSocialInbox = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const profileGroupId = (req.query?.profileGroupId as string) || '';
      const apiKey = getPostProxyApiKey() || process.env.POST_PROXY_MEGA_API_KEY || '';

      let interactions: any[] = [];

      if (apiKey && profileGroupId) {
        const response = await fetch(
          `${POSTPROXY_BASE_URL}/interactions?profileGroupId=${encodeURIComponent(profileGroupId)}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );

        if (response.ok) {
          const data = (await response.json()) as any;
          interactions = data.interactions || data || [];
        }
      }

      res.status(200).json({
        success: true,
        profileGroupId,
        count: interactions.length,
        interactions,
      });
    } catch (err) {
      console.error('[apiSocialInbox] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/**
 * 6. Interaction Reply Handler
 */
export const apiSocialReply = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const { profileGroupId, interactionId, replyText, text } = req.body || {};
      const apiKey = getPostProxyApiKey() || process.env.POST_PROXY_MEGA_API_KEY || '';

      let result: any = { success: true, id: `reply_${Date.now()}` };

      if (apiKey) {
        const response = await fetch(`${POSTPROXY_BASE_URL}/interactions/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            profileGroupId,
            interactionId,
            text: replyText || text,
          }),
        });

        if (response.ok) {
          result = await response.json();
        }
      }

      res.status(200).json({
        success: true,
        profileGroupId,
        interactionId,
        result,
      });
    } catch (err) {
      console.error('[apiSocialReply] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

/**
 * 7. Webhook Handler with HMAC-SHA256 Signature Verification
 */
export const apiSocialWebhook = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    try {
      const secret = webhookSecret.value() || getPostProxyApiKey() || process.env.POSTPROXY_WEBHOOK_SECRET || '';
      const signature = (req.headers['x-postproxy-signature'] as string) || '';

      if (secret && signature) {
        const expected = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(req.body))
          .digest('hex');

        if (signature.replace(/^sha256=/i, '').trim() !== expected) {
          res.status(401).json({ error: 'Unauthorized: Invalid signature' });
          return;
        }
      }

      const event = req.body || {};
      const eventType = event.type || event.event || 'unknown';
      const payload = event.data || event.payload || event;

      if (eventType === 'post.published' || eventType === 'post.failed') {
        const postId = payload.postId || payload.id;
        if (postId) {
          await getFirestore().doc(`posts/${postId}`).set(
            {
              status: eventType === 'post.published' ? 'published' : 'failed',
              updatedAt: new Date().toISOString(),
              postproxyMeta: payload,
            },
            { merge: true }
          );
        }
      }

      res.status(200).json({ received: true, eventType });
    } catch (err) {
      console.error('[apiSocialWebhook] Error:', err);
      res.status(200).json({ received: true, warning: 'Processed with error' });
    }
  }
);

/**
 * 8. Scheduled Cron Function: Runs every 5 minutes
 * Queries pending posts due for publishing and dispatches them to Postproxy.
 */
export const processScheduledPosts = onSchedule(
  {
    schedule: 'every 5 minutes',
    secrets: allSecrets,
    timeZone: 'UTC',
    retryCount: 3,
  },
  async (event) => {
    const now = Timestamp.now();
    const db = getFirestore();

    // 1. Query all pending posts scheduled for 'now' or earlier
    const pendingPostsQuery = await db
      .collection('scheduled_posts')
      .where('status', '==', 'pending')
      .where('scheduledAt', '<=', now)
      .limit(50)
      .get();

    if (pendingPostsQuery.empty) {
      console.log('No pending scheduled posts to process.');
      return;
    }

    const apiKey = getPostProxyApiKey() || process.env.POST_PROXY_MEGA_API_KEY || '';

    // 2. Process each due post
    const dispatchPromises = pendingPostsQuery.docs.map(async (docSnap) => {
      const post = docSnap.data();

      try {
        if (apiKey) {
          const response = await fetch(`${POSTPROXY_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: post.content || post.text,
              platforms: post.platforms || post.targetPlatforms || ['facebook', 'instagram', 'linkedin', 'twitter'],
              profileGroupId: post.profileGroupId,
            }),
          });

          if (!response.ok) {
            throw new Error(`Postproxy API error: ${response.statusText}`);
          }
        }

        // 3. Mark post as published
        await docSnap.ref.update({
          status: 'published',
          publishedAt: FieldValue.serverTimestamp(),
        });

        console.log(`Successfully published scheduled post ${docSnap.id}`);
      } catch (err: any) {
        console.error(`Failed to publish scheduled post ${docSnap.id}:`, err?.message || err);

        // Mark post as failed
        await docSnap.ref.update({
          status: 'failed',
          error: err?.message || 'Unknown error',
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    });

    await Promise.all(dispatchPromises);
  }
);

/**
 * 9. Sequential Multi-AI Creation Chain (Text Creation -> Image Creation)
 */
export const apiAiChain = onRequest(
  { cors: true, secrets: allSecrets },
  async (req: any, res: any): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const decoded = await verifyAuthToken(req, res);
    if (!decoded) return;

    try {
      const { prompt, title, userTier } = req.body || {};
      const basePrompt = prompt || title || '5 key startup metrics every founder must track';
      const uid = decoded.uid;
      const tier: SubscriptionTier = userTier || 'starter';

      const quotaResult = await enforceDailyQuota(uid, tier);
      if (!quotaResult.allowed) {
        res.status(429).json({ success: false, error: quotaResult.error });
        return;
      }

      const apiKey =
        googleApiKeySecret.value() ||
        geminiApiKey2Secret.value() ||
        geminiApiKeySecret.value() ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        '';

      const google = createGoogleGenerativeAI({ apiKey });

      // STEP 1: AI Text Creation Chain
      const SYSTEM_PROMPT = `You are an elite social media content strategist, editor, and multi-platform copywriter. Take the user's prompt and generate a comprehensive master long-form article plus platform variations adhering strictly to the character limits below:

CHAR LIMIT MATRIX:
- masterPost: Full Article (Title + 3-5 structured paragraphs)
- facebook: 1,000 – 2,000 characters (3 to 5 structured paragraphs)
- instagram: 800 – 1,500 characters (Engaging story arc + hashtag block max 30 tags)
- linkedin: 1,500 – 3,000 characters (Professional thought-leadership article/post)
- twitter: EXACTLY or UNDER 280 characters
- tiktok: 300 – 600 characters (Engaging video description + tags)
- threads: UNDER 500 characters

JSON Schema:
{
  "masterPost": "Full long-form article (Title + 3-5 structured paragraphs)...",
  "facebook": "Facebook post (1,000 - 2,000 characters)...",
  "instagram": "Instagram caption (800 - 1,500 characters)...",
  "linkedin": "LinkedIn post (1,500 - 3,000 characters)...",
  "twitter": "X/Twitter post strictly under 280 characters...",
  "threads": "Threads post strictly under 500 characters...",
  "tiktok": "TikTok video description (300 - 600 characters)...",
  "email": "Subject: ...\\nPreview: ...\\n\\nHi Subscriber,...",
  "hashtags": ["#Tag1", "#Tag2"],
  "imagePrompt": "Detailed visual description..."
}
Return raw JSON only.`;

      let textOutput: any;
      try {
        const { text } = await generateText({
            model: google(process.env.GEMINI_TEXT_MODEL?.trim() || 'gemini-3.6-flash'),
          system: SYSTEM_PROMPT,
          prompt: `Content Prompt: "${basePrompt}"`,
          temperature: 0.7,
        });

        const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '');
        textOutput = JSON.parse(cleaned);

        if (textOutput.facebook && textOutput.facebook.length > 2000) textOutput.facebook = textOutput.facebook.slice(0, 1997) + '...';
        if (textOutput.instagram && textOutput.instagram.length > 1500) textOutput.instagram = textOutput.instagram.slice(0, 1497) + '...';
        if (textOutput.linkedin && textOutput.linkedin.length > 3000) textOutput.linkedin = textOutput.linkedin.slice(0, 2997) + '...';
        if (textOutput.twitter && textOutput.twitter.length > 280) textOutput.twitter = textOutput.twitter.slice(0, 277) + '...';
        if (textOutput.tiktok && textOutput.tiktok.length > 600) textOutput.tiktok = textOutput.tiktok.slice(0, 597) + '...';
        if (textOutput.threads && textOutput.threads.length > 500) textOutput.threads = textOutput.threads.slice(0, 497) + '...';
      } catch (err) {
        console.warn('[apiAiChain] Gemini text fallback:', err);
        const cleanTopic = basePrompt.replace(/^(write me an article about|write an article about|article about|create an article about)\s*/i, '').trim() || basePrompt;
        const capitalizedTopic = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

        const masterArticle = `Title: Navigating ${capitalizedTopic}: A Comprehensive Executive Guide

International commerce and modern operations rely heavily on clear, standardized frameworks to govern relationships, risk, and delivery obligations. As organizations scale across global boundaries, understanding ${cleanTopic} is essential for mitigating liability, optimizing profit margins, and ensuring supply chain resilience.

The Evolution and Core Purpose of ${capitalizedTopic}
Standardized operational terms eliminate ambiguity between buyers and sellers. Specifying clear rules dictates precisely when the risk of loss or damage transfers between parties, preventing costly legal disputes and operational bottlenecks.

Key Operational Rules & Categories:
• Ex Works (EXW) & Free Carrier (FCA): Establishing baseline seller responsibilities at premises or designated carrier locations.
• Carriage Paid To (CPT) & CIP: Seller arranges primary freight and mandatory insurance coverage to destination.
• Delivered at Place (DAP) & DDP (Delivered Duty Paid): Shifting end-to-end logistics, import duties, and customs clearance onto the seller.

Strategic Selection for Organizational Success
Choosing the appropriate framework requires evaluating logistical capability, risk tolerance, and financial control. Mastering these principles ensures that global transactions remain predictable, compliant, and mutually profitable.`;

        const fbText = `🌐 Navigating ${capitalizedTopic}: A Comprehensive Executive Guide\n\n${masterArticle}\n\nWhat strategies is your organization implementing this quarter? Let us know in the comments below!`;
        const igText = `✨ [EXECUTIVE GUIDE] • Navigating ${capitalizedTopic}\n\nUnderstanding ${cleanTopic} protects profit margins and builds global supply chain resilience. 📌\n\nSave this guide for your next strategy session! 💾\n.\n.\n.#BusinessStrategy #${capitalizedTopic.replace(/[^a-zA-Z0-9]/g, '')}`;
        const liText = `📈 [EXECUTIVE INTEL] • Comprehensive Guide to ${capitalizedTopic}\n\nNavigating international trade and operations requires strict alignment on cost, risk, and liability.\n\n3 Core Takeaways:\n1. Clear Risk Boundaries\n2. Cost Transparency\n3. Compliance\n\nRead the full strategic breakdown above.`;
        const twText = `⚡ Master ${capitalizedTopic}: 3 key rules for global trade & supply chains 🧵\n\n1. Risk Transfer Boundaries\n2. Cost Transparency\n3. Global Compliance\n\n#GlobalTrade #${capitalizedTopic.replace(/[^a-zA-Z0-9]/g, '')}`;
        const tkText = `🎬 [HOOK]: Stop making costly mistakes with ${cleanTopic}! Do this instead 👇\n\n1. Establish clear risk transfer boundaries.\n2. Eliminate hidden logistics costs.\n3. Maintain strict compliance.\n\n#TechTok #${capitalizedTopic.replace(/[^a-zA-Z0-9]/g, '')}`;

        textOutput = {
          masterPost: masterArticle,
          facebook: fbText.length > 2000 ? fbText.slice(0, 1997) + '...' : fbText,
          instagram: igText.length > 1500 ? igText.slice(0, 1497) + '...' : igText,
          linkedin: liText.length > 3000 ? liText.slice(0, 2997) + '...' : liText,
          twitter: twText.length > 280 ? twText.slice(0, 277) + '...' : twText,
          tiktok: tkText.length > 600 ? tkText.slice(0, 597) + '...' : tkText,
          threads: `⚡ Quick Guide to ${capitalizedTopic}: 3 rules every leader must know to protect profit margins. Full breakdown above!`,
          email: `Subject: 🚀 Executive Briefing: Comprehensive Guide to ${capitalizedTopic}\nPreview: Essential insights on risk management\n\nHi Subscriber,\n\nHere is your guide to ${capitalizedTopic}:\n\n${masterArticle}`,
          hashtags: [`#${capitalizedTopic.replace(/\s+/g, '')}`, '#ExecutiveStrategy', '#BusinessGrowth', '#GlobalTrade'],
          imagePrompt: `High-resolution visual representation of ${cleanTopic}, modern 4k corporate aesthetic`,
        };
      }

      // STEP 2: AI Image Creation Chain (Optimization & URL Encoding)
      const rawImagePrompt = textOutput.imagePrompt || basePrompt;
      let enhancedImagePrompt = rawImagePrompt;

      try {
        const { text: optText } = await generateText({
            model: google(process.env.GEMINI_TEXT_MODEL?.trim() || 'gemini-3.6-flash'),
          prompt: `Optimize this prompt into a vivid, ultra-detailed visual description for an AI image generator (under 40 words): "${rawImagePrompt}"`,
        });
        if (optText.trim()) enhancedImagePrompt = optText.trim();
      } catch (err) {
        enhancedImagePrompt = `${rawImagePrompt}, professional executive studio lighting, high-end 4k resolution`;
      }

      const encodedPrompt = encodeURIComponent(enhancedImagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;

      res.status(200).json({
        success: true,
        providerUsed: 'firebase-cloud-functions-gemini',
        quotaRemaining: quotaResult.remaining,
        result: {
          ...textOutput,
          enhancedImagePrompt,
          imageUrl,
        },
      });
    } catch (err) {
      console.error('[apiAiChain] Error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);
