import { NextRequest, NextResponse } from 'next/server';
import { FirestoreImageLibraryRepository } from '@/modules/image-library/repositories/firestore-image-library.repository';
import { PerceptualHashService } from '@/modules/image-library/duplicate-detection/perceptual-hash';

const repo = new FirestoreImageLibraryRepository();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { base64Data, checksum, perceptualHash, fileName, fileSizeBytes } = body;

    const buffer = base64Data ? Buffer.from(base64Data, 'base64') : undefined;
    const computedChecksum = checksum || (buffer ? PerceptualHashService.computeSha256(buffer) : '');
    const computedPHash = perceptualHash || (buffer ? PerceptualHashService.computeDHash(buffer) : '');

    const existingRefs = await repo.getAll();
    const duplicates = PerceptualHashService.checkDuplicates(
      computedChecksum,
      computedPHash,
      fileName || '',
      fileSizeBytes || 0,
      existingRefs
    );

    return NextResponse.json({
      success: true,
      checksum: computedChecksum,
      perceptualHash: computedPHash,
      duplicates,
      hasExactDuplicate: duplicates.some((d) => d.classification === 'EXACT_DUPLICATE'),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
