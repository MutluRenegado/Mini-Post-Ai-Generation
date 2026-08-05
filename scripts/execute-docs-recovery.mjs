import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const workingDocs = path.join(process.cwd(), 'docs');
const canonicalRoot = path.join(process.cwd(), 'Mini-Post-App-Docs-Organized', 'Docs');

function getAllFiles(dir, base = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const relPath = base ? path.join(base, item.name) : item.name;
    if (item.isDirectory()) {
      results.push(...getAllFiles(path.join(dir, item.name), relPath));
    } else if (item.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

// Unset read-only attribute on workingDocs folder
try {
  fs.chmodSync(workingDocs, 0o777);
} catch (e) {}

const workingFiles = getAllFiles(workingDocs);
const canonicalFilesRaw = getAllFiles(canonicalRoot);

const canonicalFilesMap = canonicalFilesRaw.map((raw) => {
  let rel = raw;
  if (rel.startsWith('docs' + path.sep)) {
    rel = rel.substring(('docs' + path.sep).length);
  } else if (rel.startsWith('docs/')) {
    rel = rel.substring(5);
  }
  return {
    raw,
    rel,
    fullCanonicalPath: path.join(canonicalRoot, raw),
  };
});

console.log('=== PHASE 1 — AUDIT & COMPARISON ===');
console.log(`Total Canonical Docs Files: ${canonicalFilesMap.length}`);
console.log(`Total Working Docs Files Before Recovery: ${workingFiles.length}`);

const auditReport = [];
const recoveredFiles = [];
const skippedConflicts = [];
const failedEpermFiles = [];

for (const item of canonicalFilesMap) {
  const workingPath = path.join(workingDocs, item.rel);
  const section = item.rel.split(path.sep)[0] || 'Root';

  if (!fs.existsSync(workingPath)) {
    auditReport.push({
      path: item.rel,
      section,
      status: 'MISSING',
      evidence: 'Present in canonical Docs, missing from working project docs directory',
      recoverable: 'YES',
    });

    // Phase 2: Copy file to working docs
    try {
      const targetDir = path.dirname(workingPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(item.fullCanonicalPath, workingPath);
      recoveredFiles.push(item.rel);
    } catch (err) {
      failedEpermFiles.push({ path: item.rel, error: err.message });
    }
  } else {
    const canonicalContent = fs.readFileSync(item.fullCanonicalPath, 'utf8');
    const workingContent = fs.readFileSync(workingPath, 'utf8');

    if (canonicalContent === workingContent) {
      auditReport.push({
        path: item.rel,
        section,
        status: 'MATCH',
        evidence: 'Identical file exists in working project',
        recoverable: 'N/A',
      });
    } else {
      auditReport.push({
        path: item.rel,
        section,
        status: 'OVERWRITTEN',
        evidence: `Content differs (Working: ${workingContent.length} bytes, Canonical: ${canonicalContent.length} bytes)`,
        recoverable: 'CONFLICT',
      });
      skippedConflicts.push({
        relFile: item.rel,
        workingSize: workingContent.length,
        canonicalSize: canonicalContent.length,
      });
    }
  }
}

console.log('\n=== PHASE 2 — RECOVERY SUMMARY ===');
console.log(`Successfully Recovered: ${recoveredFiles.length}`);
console.log(`Skipped Due to Conflicts: ${skippedConflicts.length}`);
console.log(`Failed Copy (EPERM Permissions): ${failedEpermFiles.length}`);

// Verification
const workingFilesAfter = getAllFiles(workingDocs);
console.log(`Working Docs Files After Recovery: ${workingFilesAfter.length}`);

const summaryJson = {
  canonicalCount: canonicalFilesMap.length,
  workingCountBefore: workingFiles.length,
  missingCount: canonicalFilesMap.length - workingFiles.length + skippedConflicts.length,
  recoveredCount: recoveredFiles.length,
  skippedConflictsCount: skippedConflicts.length,
  failedEpermCount: failedEpermFiles.length,
  workingCountAfter: workingFilesAfter.length,
  auditReport,
  recoveredFilesList: recoveredFiles,
  skippedConflictsList: skippedConflicts,
  failedEpermFilesList: failedEpermFiles,
};

fs.writeFileSync(path.join(process.cwd(), 'docs-recovery-summary.json'), JSON.stringify(summaryJson, null, 2), 'utf8');
console.log('Saved recovery output JSON to docs-recovery-summary.json');
