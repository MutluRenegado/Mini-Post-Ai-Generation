import { NextResponse } from 'next/server';
import { StudioHealthService } from '@/studio/monitoring/StudioHealthService';

export async function GET() {
  try {
    const health = StudioHealthService.getHealthOverview();
    return NextResponse.json({
      status: health.status,
      version: '4.0.0-RC1',
      environment: health.environment,
      circuitBreaker: health.circuitBreaker,
      providers: health.providers,
      analytics: health.analytics,
      timestamp: health.timestamp,
    }, { status: health.status === 'OPERATIONAL' ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'DEGRADED',
      error: error?.message || 'Health check error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
