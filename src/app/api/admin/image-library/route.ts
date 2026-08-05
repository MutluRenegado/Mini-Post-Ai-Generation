import { NextRequest, NextResponse } from 'next/server';
import { FirestoreImageLibraryRepository } from '@/modules/image-library/repositories/firestore-image-library.repository';
import { ImageLibraryAdminService } from '@/modules/image-library/services/image-library-admin.service';

const repo = new FirestoreImageLibraryRepository();
const adminService = new ImageLibraryAdminService(repo);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || undefined;
    const reviewStatus = searchParams.get('reviewStatus') as any || undefined;
    const industry = searchParams.get('industry') || undefined;
    const aspectRatio = searchParams.get('aspectRatio') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);

    const result = await repo.search({
      query,
      reviewStatus,
      industry,
      aspectRatio,
      page,
      pageSize,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search image library.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64Data, originalFileName, mimeType, fileSizeBytes, title, sourceProvider } = body;

    if (!base64Data || !originalFileName || !mimeType) {
      return NextResponse.json(
        { success: false, error: 'Missing required upload parameters (base64Data, originalFileName, mimeType).' },
        { status: 400 }
      );
    }

    const uploadRes = await adminService.processUpload({
      base64Data,
      originalFileName,
      mimeType,
      fileSizeBytes: fileSizeBytes || 1024,
      title,
      sourceProvider,
    });

    return NextResponse.json({ success: true, ...uploadRes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process image upload.' },
      { status: 400 }
    );
  }
}
