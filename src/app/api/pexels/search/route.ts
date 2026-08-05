import { NextRequest, NextResponse } from 'next/server';
import { PexelsService } from '@/lib/services/pexelsService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '15', 10);
  const orientation = searchParams.get('orientation') as 'landscape' | 'portrait' | 'square' | undefined;

  try {
    if (!query) {
      const curated = await PexelsService.getCuratedPhotos({ page, perPage });
      return NextResponse.json(curated);
    }

    const searchResults = await PexelsService.searchPhotos(query, {
      page,
      perPage,
      orientation,
    });

    return NextResponse.json(searchResults);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'PEXELS_SEARCH_FAILED' },
      { status: error.message?.includes('PEXELS_API_KEY_MISSING') ? 500 : 400 }
    );
  }
}
