import fs from 'fs';
import path from 'path';

export type FolderCategory =
  | 'INCOMING'
  | 'APPROVED'
  | 'ARCHIVE'
  | 'KNOWLEDGE'
  | 'METADATA'
  | 'EMBEDDINGS'
  | 'FEEDBACK'
  | 'GENERATED'
  | 'OTHER';

export type KnowledgeDomain =
  | 'Objects'
  | 'People'
  | 'Industries'
  | 'Scenes'
  | 'Lighting'
  | 'Composition'
  | 'CameraAngles'
  | 'Styles';

export interface ScannedFileItem {
  absolutePath: string;
  relativePath: string;
  fileName: string;
  extension: string;
  mimeType: string;
  fileSizeBytes: number;
  modifiedTimeMs: number;
  folderCategory: FolderCategory;
  knowledgeDomain?: KnowledgeDomain;
}

export class FolderScanner {
  private static ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

  /**
   * Identifies canonical folder category from relative path.
   */
  static classifyPath(relativePath: string): { folderCategory: FolderCategory; knowledgeDomain?: KnowledgeDomain } {
    const parts = relativePath.split('/');
    const topFolder = parts[0] || '';

    let folderCategory: FolderCategory = 'OTHER';
    let knowledgeDomain: KnowledgeDomain | undefined = undefined;

    if (/^(01_Incoming|Incoming)$/i.test(topFolder)) {
      folderCategory = 'INCOMING';
    } else if (/^(02_Approved|Approved|Approved References)$/i.test(topFolder)) {
      folderCategory = 'APPROVED';
    } else if (/^(03_Archive|Archive)$/i.test(topFolder)) {
      folderCategory = 'ARCHIVE';
    } else if (/^(Knowledge|Knowledge Base)$/i.test(topFolder)) {
      folderCategory = 'KNOWLEDGE';
      const subFolder = parts[1] || '';
      if (/^Objects$/i.test(subFolder)) knowledgeDomain = 'Objects';
      else if (/^People$/i.test(subFolder)) knowledgeDomain = 'People';
      else if (/^Industries$/i.test(subFolder)) knowledgeDomain = 'Industries';
      else if (/^Scenes$/i.test(subFolder)) knowledgeDomain = 'Scenes';
      else if (/^Lighting$/i.test(subFolder)) knowledgeDomain = 'Lighting';
      else if (/^Composition$/i.test(subFolder)) knowledgeDomain = 'Composition';
      else if (/^(CameraAngles|Camera Angles)$/i.test(subFolder)) knowledgeDomain = 'CameraAngles';
      else if (/^Styles$/i.test(subFolder)) knowledgeDomain = 'Styles';
    } else if (/^Metadata$/i.test(topFolder)) {
      folderCategory = 'METADATA';
    } else if (/^Embeddings$/i.test(topFolder)) {
      folderCategory = 'EMBEDDINGS';
    } else if (/^Feedback$/i.test(topFolder)) {
      folderCategory = 'FEEDBACK';
    } else if (/^(Generated|Generated Images)$/i.test(topFolder)) {
      folderCategory = 'GENERATED';
    }

    return { folderCategory, knowledgeDomain };
  }

  /**
   * Recursively scans root directory for supported image files.
   * Never moves, renames, overwrites, or deletes source files on disk.
   */
  static scanDirectory(rootDir: string): ScannedFileItem[] {
    const results: ScannedFileItem[] = [];

    if (!fs.existsSync(rootDir)) {
      return results;
    }

    const traverse = (currentDir: string) => {
      let entries: fs.Dirent[] = [];
      try {
        entries = fs.readdirSync(currentDir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (this.ALLOWED_EXTENSIONS.has(ext)) {
            try {
              const stats = fs.statSync(fullPath);
              const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
              let mimeType = 'image/jpeg';
              if (ext === '.png') mimeType = 'image/png';
              else if (ext === '.webp') mimeType = 'image/webp';

              const { folderCategory, knowledgeDomain } = this.classifyPath(relativePath);

              results.push({
                absolutePath: fullPath,
                relativePath,
                fileName: entry.name,
                extension: ext,
                mimeType,
                fileSizeBytes: stats.size,
                modifiedTimeMs: stats.mtimeMs,
                folderCategory,
                knowledgeDomain,
              });
            } catch {
              // Ignore unreadable files
            }
          }
        }
      }
    };

    traverse(rootDir);
    return results;
  }
}
