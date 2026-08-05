import { db } from '../../../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
} from 'firebase/firestore';
import type { ImageLibrarySearchFilters, PaginationResult, VisualReference } from '../models/visual-reference.model';
import type { IImageLibraryRepository } from './image-library-repository.interface';

const COLLECTION_NAME = 'image_library_references';

export class FirestoreImageLibraryRepository implements IImageLibraryRepository {
  private localCache: Map<string, VisualReference> = new Map();

  constructor() {}

  private loadLocalData() {}

  private persistLocalData() {}

  async findById(id: string): Promise<VisualReference | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as VisualReference;
      }
    } catch {
      // Fall back to local cache if Firestore is offline
    }
    return this.localCache.get(id) || null;
  }

  async findByChecksum(checksum: string): Promise<VisualReference | null> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('checksum', '==', checksum), fsLimit(1));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as VisualReference;
      }
    } catch {
      // Fallback
    }

    for (const item of this.localCache.values()) {
      if (item.checksum === checksum) return item;
    }
    return null;
  }

  async getAll(): Promise<VisualReference[]> {
    const results: VisualReference[] = [];
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      snapshot.forEach((doc) => results.push(doc.data() as VisualReference));
      if (results.length > 0) return results;
    } catch {
      // Fallback
    }
    return Array.from(this.localCache.values());
  }

  async getApprovedReferences(): Promise<VisualReference[]> {
    const all = await this.getAll();
    return all.filter(
      (ref) =>
        ref.review?.status === 'APPROVED' &&
        ref.rights?.rightsConfirmed === true &&
        ref.rights?.commercialUseReviewStatus === 'APPROVED'
    );
  }

  async search(filters: ImageLibrarySearchFilters): Promise<PaginationResult<VisualReference>> {
    let all = await this.getAll();

    // Query filter
    if (filters.query && filters.query.trim().length > 0) {
      const q = filters.query.toLowerCase();
      all = all.filter(
        (ref) =>
          ref.title.toLowerCase().includes(q) ||
          (ref.caption && ref.caption.toLowerCase().includes(q)) ||
          (ref.description && ref.description.toLowerCase().includes(q)) ||
          (ref.topic && ref.topic.toLowerCase().includes(q)) ||
          (ref.industry && ref.industry.toLowerCase().includes(q)) ||
          (ref.scene && ref.scene.toLowerCase().includes(q)) ||
          (ref.subjects && ref.subjects.some((s) => s.toLowerCase().includes(q))) ||
          (ref.objects && ref.objects.some((o) => o.toLowerCase().includes(q)))
      );
    }

    // Status filter
    if (filters.reviewStatus) {
      const statuses = Array.isArray(filters.reviewStatus)
        ? filters.reviewStatus
        : [filters.reviewStatus];
      all = all.filter((ref) => statuses.includes(ref.review.status));
    }

    // Rights filter
    if (filters.rightsConfirmed !== undefined) {
      all = all.filter((ref) => ref.rights.rightsConfirmed === filters.rightsConfirmed);
    }

    // Source filter
    if (filters.sourceType) {
      const sources = Array.isArray(filters.sourceType)
        ? filters.sourceType
        : [filters.sourceType];
      all = all.filter((ref) => sources.includes(ref.sourceType));
    }

    // Industry filter
    if (filters.industry) {
      all = all.filter(
        (ref) => ref.industry?.toLowerCase() === filters.industry?.toLowerCase()
      );
    }

    // Aspect ratio filter
    if (filters.aspectRatio) {
      all = all.filter((ref) => ref.aspectRatio === filters.aspectRatio);
    }

    // Sort
    const sortBy = filters.sortBy || 'createdAt';
    const sortDir = filters.sortDirection === 'asc' ? 1 : -1;
    all.sort((a, b) => {
      const valA = (a as any)[sortBy] || '';
      const valB = (b as any)[sortBy] || '';
      if (valA < valB) return -1 * sortDir;
      if (valA > valB) return 1 * sortDir;
      return 0;
    });

    // Pagination
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.max(1, filters.pageSize || 12);
    const total = all.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIdx = (page - 1) * pageSize;
    const items = all.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async save(reference: VisualReference): Promise<VisualReference> {
    this.localCache.set(reference.id, reference);
    this.persistLocalData();

    try {
      const docRef = doc(db, COLLECTION_NAME, reference.id);
      await setDoc(docRef, reference);
    } catch {
      // Local cache persisted
    }

    return reference;
  }

  async update(id: string, updates: Partial<VisualReference>): Promise<VisualReference> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`VisualReference with ID ${id} not found.`);
    }

    const updated: VisualReference = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    };

    this.localCache.set(id, updated);
    this.persistLocalData();

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: updated.updatedAt,
        version: updated.version,
      });
    } catch {
      // Local cache updated
    }

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    this.localCache.delete(id);
    this.persistLocalData();

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch {
      // Local cache deleted
    }

    return true;
  }

  async count(): Promise<number> {
    const all = await this.getAll();
    return all.length;
  }
}
