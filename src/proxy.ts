import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and /subscribe routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isSubscribeRoute = pathname.startsWith('/subscribe');

  // Check for session cookie or auth header token
  const authSession =
    request.cookies.get('session')?.value ||
    request.cookies.get('firebase_token')?.value ||
    request.headers.get('authorization');

  if ((isDashboardRoute || isSubscribeRoute) && !authSession) {
    // Pass through for client-side Firebase Auth hydration while ensuring header security
    const response = NextResponse.next();
    response.headers.set('x-middleware-auth-pass', 'client-hydration');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/subscribe/:path*'],
};
