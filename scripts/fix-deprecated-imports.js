const fs = require('fs');
const path = require('path');

const legalDir = path.join(__dirname, '..', 'src', 'deprecated', 'app', 'legal');

if (fs.existsSync(legalDir)) {
  function fixDir(d) {
    fs.readdirSync(d).forEach((f) => {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) {
        fixDir(p);
      } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/@\/app\//g, '@/deprecated/app/');
        fs.writeFileSync(p, content);
        console.log('Fixed import in:', p);
      }
    });
  }
  fixDir(legalDir);
}
