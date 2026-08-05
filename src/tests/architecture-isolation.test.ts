import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

test('Architecture Isolation — No Cross-Module Imports Between Text Editor and Image Generator', () => {
  const textModuleDir = path.resolve(process.cwd(), 'src/lib/ai-text-editor');
  const imageModuleDir = path.resolve(process.cwd(), 'src/lib/ai-image-generator');

  const textFiles = getFilesRecursively(textModuleDir);
  const imageFiles = getFilesRecursively(imageModuleDir);

  const textViolations: string[] = [];
  const imageViolations: string[] = [];

  textFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('lib/ai-image-generator') || content.includes('/ai-image-generator/')) {
      textViolations.push(file);
    }
  });

  imageFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('lib/ai-text-editor') || content.includes('/ai-text-editor/')) {
      imageViolations.push(file);
    }
  });

  assert.strictEqual(
    textViolations.length,
    0,
    `Text Editor module contains cross-module imports from Image Generator: ${textViolations.join(', ')}`
  );

  assert.strictEqual(
    imageViolations.length,
    0,
    `Image Generator module contains cross-module imports from Text Editor: ${imageViolations.join(', ')}`
  );
});
