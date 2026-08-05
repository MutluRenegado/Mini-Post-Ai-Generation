/**
 * Environment & Backend API Endpoint Configuration
 * Dynamically routes requests to local App Router APIs, local Cloud Function emulators,
 * or production Cloud Functions based on environment flags.
 */

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const USE_CLOUD_FUNCTIONS = process.env.NEXT_PUBLIC_USE_CLOUD_FUNCTIONS === 'true';

// Live 2nd Gen Firebase Cloud Functions base URL
export const CLOUD_FUNCTIONS_BASE_URL =
  process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL ||
  'https://us-central1-echosofwandering.cloudfunctions.net';

// Local Firebase Emulator base URL
export const EMULATOR_FUNCTIONS_BASE_URL =
  process.env.NEXT_PUBLIC_EMULATOR_FUNCTIONS_URL ||
  'http://127.0.0.1:5001/echosofwandering/us-central1';

/**
 * Get endpoint URL for a given API function
 */
export function getApiEndpoint(endpointName: string): string {
  if (USE_CLOUD_FUNCTIONS) {
    const baseUrl = IS_PRODUCTION ? CLOUD_FUNCTIONS_BASE_URL : EMULATOR_FUNCTIONS_BASE_URL;
    return `${baseUrl}/${endpointName}`;
  }

  // Fallback to Next.js App Router local API routes (/api/...)
  switch (endpointName) {
    case 'apiAuthOnSignup':
      return '/api/auth/on-signup';
    case 'apiSocialConnect':
      return '/api/social/connect';
    case 'apiPostsPublish':
      return '/api/posts/publish';
    case 'apiGeneratePost':
      return '/api/generate';
    case 'apiSocialInbox':
      return '/api/social/inbox';
    case 'apiSocialReply':
      return '/api/social/reply';
    case 'apiSocialWebhook':
      return '/api/social/webhook';
    default:
      return `/api/${endpointName}`;
  }
}
