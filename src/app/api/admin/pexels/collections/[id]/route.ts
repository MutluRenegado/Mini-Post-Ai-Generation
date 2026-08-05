import { NextRequest, NextResponse } from 'next/server';
import { PexelsProvider } from '@/providers/pexels/pexels.provider';
import { PexelsError } from '@/providers/pexels/pexels.errors';

const pexelsProvider = new PexelsProvider();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = Math.min(parseInt(searchParams.get('per_page') || '15', 10), 50);

  try {
    const result = await pexelsProvider.getCollectionPhotos(id, { page, perPage, query: '' });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof PexelsError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.statusCode || 400 }
      );
    }
    return NextResponse.json(
      { error: 'PEXELS_COLLECTION_MEDIA_ERROR', message: 'Failed to retrieve collection media.' },
      { status: 500 }
    );
  }
}
