const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const companyDocsDir = path.join(rootDir, 'docs', 'Company Modules');
const standardsDocsDir = path.join(rootDir, 'docs', 'Standards Modules');

fs.mkdirSync(companyDocsDir, { recursive: true });
fs.mkdirSync(standardsDocsDir, { recursive: true });

const companyFiles = [
  'company_module_prebuild_audit.md',
  'company_module_architecture.md',
  'company_module_route_map.md',
  'company_module_content_inventory.md',
  'company_module_navigation_map.md',
  'company_module_redirect_map.md',
  'company_module_seo_report.md',
  'company_module_accessibility_report.md',
  'company_module_validation_report.md',
  'company_module_manual_review.md',
  'company_pages_manual_review.md',
  'company_module_cleanup_report.md',
  'company_module_final_report.md',
  'company-pages-migration-manifest.md',
];

companyFiles.forEach((file) => {
  const src = path.join(rootDir, file);
  const dest = path.join(companyDocsDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    console.log('Moved to Company Modules:', file);
  }
});

// Check for existing standards document in root
const rootStandardsFile = path.join(rootDir, 'trust_safety_header_and_standards_report.md');
if (fs.existsSync(rootStandardsFile)) {
  const dest = path.join(standardsDocsDir, 'standards_module_standards_review.md');
  fs.copyFileSync(rootStandardsFile, dest);
  fs.unlinkSync(rootStandardsFile);
  console.log('Migrated trust_safety_header_and_standards_report.md -> standards_module_standards_review.md');
}
