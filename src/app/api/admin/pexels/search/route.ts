import { NextRequest, NextResponse } from 'next/server';
import { PexelsProvider } from '@/providers/pexels/pexels.provider';
import { PexelsError } from '@/providers/pexels/pexels.errors';

const pexelsProvider = new PexelsProvider();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = Math.min(parseInt(searchParams.get('per_page') || '15', 10), 50);
  const orientation = searchParams.get('orientation') as 'landscape' | 'portrait' | 'square' | undefined;

  try {
    const result = await pexelsProvider.searchPhotos({
      query,
      page,
      perPage,
      orientation,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof PexelsError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.statusCode || 400 }
      );
    }
    return NextResponse.json(
      { error: 'PEXELS_SEARCH_ERROR', message: 'Failed to complete Pexels search.' },
      { status: 500 }
    );
  }
}
