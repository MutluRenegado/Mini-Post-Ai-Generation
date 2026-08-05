import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({
    error: 'IMAGE_KERNEL_NOT_WIRED',
    message: 'Wire this route to your existing provider client and the GenerateImage use case. The kernel intentionally does not create a fake provider.',
  }, { status: 501 });
}
