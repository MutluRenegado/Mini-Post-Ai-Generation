import { NextRequest, NextResponse } from 'next/server';
import { FirestoreImageLibraryRepository } from '@/modules/image-library/repositories/firestore-image-library.repository';
import { ImageLibraryAdminService } from '@/modules/image-library/services/image-library-admin.service';

const repo = new FirestoreImageLibraryRepository();
const adminService = new ImageLibraryAdminService(repo);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await repo.findById(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Reference not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, reference: item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let reference = await repo.findById(id);
    if (!reference) {
      return NextResponse.json({ success: false, error: 'Reference not found.' }, { status: 404 });
    }

    if (body.metadata) {
      reference = await adminService.updateMetadata(id, body.metadata);
    }

    if (body.rights) {
      reference = await adminService.updateRights(id, body.rights, body.reviewerId || 'admin');
    }

    if (body.reviewStatus) {
      reference = await adminService.setReviewStatus(
        id,
        body.reviewStatus,
        body.reviewerId || 'admin',
        body.reviewerNotes,
        body.rejectionReason
      );
    }

    return NextResponse.json({ success: true, reference });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await adminService.setReviewStatus(id, 'ARCHIVED', 'admin', 'Archieved via API request');
    return NextResponse.json({ success: true, archived: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
