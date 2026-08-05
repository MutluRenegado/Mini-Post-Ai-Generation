import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');

// 1. Gather all actual app routes in src/app
function getAppRoutes(dir, baseRoute = '') {
  let routes = [];
  if (!fs.existsSync(dir)) return routes;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Ignore route groups (e.g. (auth)) when building route path
      const segName = entry.name.startsWith('(') && entry.name.endsWith(')') ? '' : entry.name;
      const nextBase = segName ? `${baseRoute}/${segName}` : baseRoute;
      routes.push(...getAppRoutes(path.join(dir, entry.name), nextBase));
    } else if (entry.isFile() && (entry.name === 'page.tsx' || entry.name === 'page.ts' || entry.name === 'route.ts')) {
      routes.push(baseRoute || '/');
    }
  }
  return Array.from(new Set(routes));
}

const appRoutes = getAppRoutes(path.join(srcDir, 'app'));
console.log(`Found ${appRoutes.length} valid app routes:`);
console.log(appRoutes.slice(0, 30));

// 2. Scan all tsx/ts files for interactive element patterns
function scanFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const lines = code.split('\n');

      lines.forEach((line, idx) => {
        const lineNo = idx + 1;

        // Check href="#" or empty href
        if (/href=["']#["']/.test(line) || /href=["']["']/.test(line) || /href=["']javascript:/.test(line)) {
          results.push({
            file: path.relative(projectRoot, fullPath),
            lineNo,
            defect: 'UNLINKED_HREF',
            code: line.trim(),
          });
        }

        // Check empty or console-only handlers
        if (/onClick=\{\(\)\s*=>\s*\{\s*\}\}/.test(line) || /onClick=\{\(\)\s*=>\s*console\./.test(line) || /onClick=\{\(\)\s*=>\s*alert/.test(line)) {
          results.push({
            file: path.relative(projectRoot, fullPath),
            lineNo,
            defect: 'EMPTY_OR_CONSOLE_ONCLICK',
            code: line.trim(),
          });
        }

        // Check links to href strings
        const hrefMatch = line.match(/href=["'](\/[^"']*)["']/);
        if (hrefMatch) {
          const target = hrefMatch[1].split('?')[0].split('#')[0];
          // Check if target is in appRoutes (accounting for dynamic routes like [id])
          const routeExists = appRoutes.some(r => {
            if (r === target) return true;
            const rRegex = new RegExp('^' + r.replace(/\[[^\]]+\]/g, '[^/]+') + '$');
            return rRegex.test(target);
          });

          if (!routeExists && !target.startsWith('/api') && !target.startsWith('/_')) {
            results.push({
              file: path.relative(projectRoot, fullPath),
              lineNo,
              defect: 'BROKEN_ROUTE_LINK',
              target,
              code: line.trim(),
            });
          }
        }
      });
    }
  }
  return results;
}

const defects = scanFiles(srcDir);
console.log(`\nScan complete. Total potential defects found: ${defects.length}`);
console.log(JSON.stringify(defects, null, 2));
