import { NextResponse } from 'next/server';
import { PexelsRateLimitTracker } from '@/providers/pexels/pexels.rate-limit';

export async function GET() {
  const isConfigured = Boolean(process.env.PEXELS_API_KEY);

  if (!isConfigured) {
    return NextResponse.json({
      configured: false,
      connected: false,
      provider: 'PEXELS',
      message: 'PEXELS_API_KEY secret is not defined on server.',
    }, { status: 500 });
  }

  const rateLimit = PexelsRateLimitTracker.getStatus();

  return NextResponse.json({
    configured: true,
    connected: true,
    provider: 'PEXELS',
    rateLimit,
  });
}
