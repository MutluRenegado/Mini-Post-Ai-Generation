import { NextRequest, NextResponse } from 'next/server';
import { PexelsProvider } from '@/providers/pexels/pexels.provider';
import { PexelsError } from '@/providers/pexels/pexels.errors';

const pexelsProvider = new PexelsProvider();

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const asset = await pexelsProvider.getPhoto(id);
    return NextResponse.json(asset);
  } catch (error: any) {
    if (error instanceof PexelsError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.statusCode || 400 }
      );
    }
    return NextResponse.json(
      { error: 'PEXELS_GET_PHOTO_ERROR', message: 'Failed to retrieve photo.' },
      { status: 500 }
    );
  }
}
