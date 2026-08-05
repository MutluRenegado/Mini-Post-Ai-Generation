import fs from 'fs';
import path from 'path';
import type { VisualReference } from '../models/visual-reference.model';
import type { IImageLibraryRepository } from '../repositories/image-library-repository.interface';
import { FolderScanner, ScannedFileItem } from './folder-scanner';
import { MetadataExtractor } from './metadata-extractor';
import { ThumbnailGenerator } from '../services/thumbnail-generator';
import { PerceptualHashService } from '../duplicate-detection/perceptual-hash';

export interface SyncManifestEntry {
  relativeSourcePath: string;
  referenceId: string;
  checksum: string;
  perceptualHash: string;
  fileSizeBytes: number;
  fileModifiedAtMs: number;
  lastSyncedAt: string;
  sourceAvailability: 'AVAILABLE' | 'MISSING';
}

export interface SyncManifest {
  version: string;
  lastScanTimestamp: string;
  totalSourceFiles: number;
  entries: Record<string, SyncManifestEntry>; // keyed by relativeSourcePath
}

export interface SyncOptions {
  rootDir?: string;
  manifestPath?: string;
  dryRun?: boolean;
}

export interface SyncResultReport {
  scannedCount: number;
  newFilesAdded: number;
  modifiedFilesUpdated: number;
  missingFilesMarked: number;
  skippedUnchanged: number;
  exactDuplicatesBlocked: number;
  nearDuplicatesWarned: number;
  errors: string[];
  dryRun: boolean;
  timestamp: string;
}

export class FolderSyncService {
  private repo: IImageLibraryRepository;
  private manifestPath: string;

  constructor(repository: IImageLibraryRepository, customManifestPath?: string) {
    this.repo = repository;
    this.manifestPath =
      customManifestPath || path.join(process.cwd(), 'db', 'sync-manifest.json');
  }

  private loadManifest(): SyncManifest {
    try {
      if (fs.existsSync(this.manifestPath)) {
        const raw = fs.readFileSync(this.manifestPath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {
      // Return fresh manifest
    }
    return {
      version: '1.0.0',
      lastScanTimestamp: new Date().toISOString(),
      totalSourceFiles: 0,
      entries: {},
    };
  }

  private saveManifest(manifest: SyncManifest): void {
    try {
      const dir = path.dirname(this.manifestPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    } catch {
      // Manifest write ignore
    }
  }

  /**
   * Executes local folder synchronization against D:\Library\Images Library.
   * Never moves, renames, overwrites, or deletes source files on disk.
   */
  async executeSync(options: SyncOptions = {}): Promise<SyncResultReport> {
    const rootDir = options.rootDir || 'D:\\Library\\Images Library';
    const dryRun = !!options.dryRun;
    const manifest = this.loadManifest();

    const report: SyncResultReport = {
      scannedCount: 0,
      newFilesAdded: 0,
      modifiedFilesUpdated: 0,
      missingFilesMarked: 0,
      skippedUnchanged: 0,
      exactDuplicatesBlocked: 0,
      nearDuplicatesWarned: 0,
      errors: [],
      dryRun,
      timestamp: new Date().toISOString(),
    };

    const scannedFiles = FolderScanner.scanDirectory(rootDir);
    report.scannedCount = scannedFiles.length;

    const existingRefs = await this.repo.getAll();
    const currentScannedRelativePaths = new Set<string>();

    for (const fileItem of scannedFiles) {
      currentScannedRelativePaths.add(fileItem.relativePath);

      try {
        const fileBuffer = fs.readFileSync(fileItem.absolutePath);
        const techMeta = MetadataExtractor.extractTechnicalMetadata(
          fileBuffer,
          fileItem.fileName,
          fileItem.relativePath,
          fileItem.mimeType,
          fileItem.modifiedTimeMs
        );

        const manifestEntry = manifest.entries[fileItem.relativePath];

        // 1. Check if file is completely unchanged
        if (
          manifestEntry &&
          manifestEntry.checksum === techMeta.checksum &&
          manifestEntry.fileModifiedAtMs === fileItem.modifiedTimeMs
        ) {
          report.skippedUnchanged++;
          continue;
        }

        // 2. Check duplicate status against repository
        const duplicates = PerceptualHashService.checkDuplicates(
          techMeta.checksum,
          techMeta.perceptualHash,
          fileItem.fileName,
          fileItem.fileSizeBytes,
          existingRefs
        );

        const exactMatch = duplicates.find((d) => d.classification === 'EXACT_DUPLICATE');
        if (exactMatch && !manifestEntry) {
          report.exactDuplicatesBlocked++;
          // Skip adding exact byte duplicate if not already in manifest
          continue;
        }

        const nearMatch = duplicates.find((d) => d.classification === 'NEAR_DUPLICATE');
        if (nearMatch) {
          report.nearDuplicatesWarned++;
        }

        if (dryRun) {
          if (manifestEntry) report.modifiedFilesUpdated++;
          else report.newFilesAdded++;
          continue;
        }

        // 3. Process image thumbnail & record creation
        const dataUrl = `data:${fileItem.mimeType};base64,${fileBuffer.toString('base64')}`;
        const thumbResult = await ThumbnailGenerator.generateThumbnail(dataUrl, 320);

        const refId = manifestEntry
          ? manifestEntry.referenceId
          : `ref_sync_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        const draftRef = MetadataExtractor.createDraftReference(
          refId,
          techMeta,
          thumbResult.thumbnailDataUrl,
          { category: fileItem.folderCategory, knowledgeDomain: fileItem.knowledgeDomain }
        );

        await this.repo.save(draftRef);

        manifest.entries[fileItem.relativePath] = {
          relativeSourcePath: fileItem.relativePath,
          referenceId: refId,
          checksum: techMeta.checksum,
          perceptualHash: techMeta.perceptualHash,
          fileSizeBytes: techMeta.fileSizeBytes,
          fileModifiedAtMs: fileItem.modifiedTimeMs,
          lastSyncedAt: new Date().toISOString(),
          sourceAvailability: 'AVAILABLE',
        };

        if (manifestEntry) {
          report.modifiedFilesUpdated++;
        } else {
          report.newFilesAdded++;
        }
      } catch (err: any) {
        report.errors.push(`Error processing ${fileItem.relativePath}: ${err.message}`);
      }
    }

    // 4. Detect missing local source files
    for (const [relPath, entry] of Object.entries(manifest.entries)) {
      if (!currentScannedRelativePaths.has(relPath)) {
        report.missingFilesMarked++;
        if (!dryRun) {
          entry.sourceAvailability = 'MISSING';
          const existingRef = existingRefs.find((r) => r.id === entry.referenceId);
          if (existingRef) {
            await this.repo.update(existingRef.id, { sourceAvailability: 'MISSING' });
          }
        }
      }
    }

    if (!dryRun) {
      manifest.lastScanTimestamp = report.timestamp;
      manifest.totalSourceFiles = report.scannedCount;
      this.saveManifest(manifest);
    }

    return report;
  }
}
