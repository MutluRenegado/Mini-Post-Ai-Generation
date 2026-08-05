const fs = require('fs');
const path = require('path');

const oldDir = path.join(__dirname, '..', 'src', 'deprecated', 'app');
const newDir = path.join(__dirname, '..', 'src', 'deprecated', 'skeleton_archive');

if (fs.existsSync(oldDir)) {
  fs.renameSync(oldDir, newDir);
  console.log('Renamed src/deprecated/app to src/deprecated/skeleton_archive successfully');
} else {
  console.log('src/deprecated/app does not exist or already renamed');
}
