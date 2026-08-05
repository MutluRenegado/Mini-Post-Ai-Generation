import path from 'path';
import { FirestoreImageLibraryRepository } from '../src/modules/image-library/repositories/firestore-image-library.repository';
import { FolderSyncService } from '../src/modules/image-library/importer/folder-sync.service';
import { FolderScanner } from '../src/modules/image-library/importer/folder-scanner';

async function main() {
  const args = process.argv.slice(2);
  const isScanOnly = args.includes('--scan');
  const isDryRun = args.includes('--dry-run');
  const targetDir = 'D:\\Library\\Images Library';

  console.log('====================================================');
  console.log('   MINI POST APP — IMAGE LIBRARY LOCAL SYNCHRONIZER');
  console.log('====================================================');
  console.log(`Target Folder: ${targetDir}`);
  console.log(`Mode: ${isScanOnly ? 'SCAN ONLY' : isDryRun ? 'DRY RUN' : 'FULL SYNC'}`);
  console.log('----------------------------------------------------');

  if (isScanOnly) {
    console.log('Scanning directory recursively...');
    const files = FolderScanner.scanDirectory(targetDir);
    console.log(`Scanned Total Files: ${files.length}`);
    files.slice(0, 10).forEach((f) => console.log(` - ${f.relativePath} (${(f.fileSizeBytes / 1024).toFixed(1)} KB)`));
    if (files.length > 10) console.log(` ... and ${files.length - 10} more files.`);
    return;
  }

  const repo = new FirestoreImageLibraryRepository();
  const syncService = new FolderSyncService(repo);

  console.log('Executing local folder synchronization...');
  const report = await syncService.executeSync({
    rootDir: targetDir,
    dryRun: isDryRun,
  });

  console.log('\n--- SYNCHRONIZATION REPORT ---');
  console.log(`• Scanned Files:         ${report.scannedCount}`);
  console.log(`• New Files Added:       ${report.newFilesAdded}`);
  console.log(`• Modified Files Sync:   ${report.modifiedFilesUpdated}`);
  console.log(`• Unchanged Skipped:     ${report.skippedUnchanged}`);
  console.log(`• Missing Files Marked:  ${report.missingFilesMarked}`);
  console.log(`• Exact Duplicates:      ${report.exactDuplicatesBlocked}`);
  console.log(`• Near Duplicates:       ${report.nearDuplicatesWarned}`);
  console.log(`• Errors Encountered:    ${report.errors.length}`);
  console.log('----------------------------------------------------');
  if (report.errors.length > 0) {
    report.errors.forEach((err) => console.error(`  [ERROR] ${err}`));
  }
  console.log(`Sync completed cleanly at ${report.timestamp}.`);
}

main().catch((err) => {
  console.error('Fatal synchronizer exception:', err);
  process.exit(1);
});
