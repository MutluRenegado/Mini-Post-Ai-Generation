import { NextRequest, NextResponse } from 'next/server';
import { StockSearchService, UnifiedStockSearchRequest } from '@/lib/services/stockSearchService';
import { ProviderUnknownError, ProviderNotConfiguredError } from '@/providers/stock-provider-router';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Auth Check
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer invalid')) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required for stock search API.' },
        { status: 401 }
      );
    }

    const {
      action = 'search_stock_images',
      provider = 'all',
      query = '',
      orientation,
      page = 1,
      perPage = 20,
      color,
      safeSearch = true,
    } = body as UnifiedStockSearchRequest;

    if (action && action !== 'search_stock_images') {
      return NextResponse.json(
        { error: 'INVALID_ACTION', message: `Unsupported action "${action}". Expected "search_stock_images".` },
        { status: 400 }
      );
    }

    const result = await StockSearchService.search({
      action,
      provider,
      query,
      orientation,
      page,
      perPage,
      color,
      safeSearch,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const sanitizedMsg = (error.message || 'Stock search failed.').replace(/key=[a-zA-Z0-9_-]+/gi, 'key=[REDACTED]');

    if (sanitizedMsg.startsWith('VALIDATION_ERROR:')) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: sanitizedMsg },
        { status: 400 }
      );
    }

    if (error instanceof ProviderUnknownError) {
      return NextResponse.json(
        { error: error.code, message: sanitizedMsg },
        { status: error.statusCode || 400 }
      );
    }

    if (error instanceof ProviderNotConfiguredError) {
      return NextResponse.json(
        { error: error.code, message: sanitizedMsg },
        { status: error.statusCode || 503 }
      );
    }

    return NextResponse.json(
      { error: 'STOCK_SEARCH_ERROR', message: sanitizedMsg },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Auth Check
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer invalid')) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required for stock search API.' },
        { status: 401 }
      );
    }

    const provider = (searchParams.get('provider') || searchParams.get('p') || 'all') as any;
    const query = searchParams.get('query') || searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || searchParams.get('per_page') || '20', 10);
    const orientation = searchParams.get('orientation') as any;
    const color = searchParams.get('color') || undefined;

    const result = await StockSearchService.search({
      action: 'search_stock_images',
      provider,
      query,
      orientation,
      page,
      perPage,
      color,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const sanitizedMsg = (error.message || 'Stock search failed.').replace(/key=[a-zA-Z0-9_-]+/gi, 'key=[REDACTED]');

    if (sanitizedMsg.startsWith('VALIDATION_ERROR:')) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: sanitizedMsg },
        { status: 400 }
      );
    }

    if (error instanceof ProviderUnknownError) {
      return NextResponse.json(
        { error: error.code, message: sanitizedMsg },
        { status: error.statusCode || 400 }
      );
    }

    if (error instanceof ProviderNotConfiguredError) {
      return NextResponse.json(
        { error: error.code, message: sanitizedMsg },
        { status: error.statusCode || 503 }
      );
    }

    return NextResponse.json(
      { error: 'STOCK_SEARCH_ERROR', message: sanitizedMsg },
      { status: 500 }
    );
  }
}
