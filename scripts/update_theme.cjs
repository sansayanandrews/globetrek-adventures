const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../client/src');

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js') || entry.name.endsWith('.css'))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walk(srcDir);
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Replace teal- with blue-
  content = content.replace(/teal-(\d+)/g, 'blue-$1');
  content = content.replace(/teal\//g, 'blue/');
  
  // Replace sunset- with sky- or blue-
  content = content.replace(/sunset-(\d+)/g, 'sky-$1');

  // Fix any remaining corrupted characters like  with clean &bull; or •
  content = content.replace(/Negombo  Sri Lanka/g, 'Negombo &bull; Sri Lanka');
  content = content.replace(/Sri Lankas/g, "Sri Lanka's");
  content = content.replace(/Travelers/g, "Traveler's");
  content = content.replace(/Mon  Sat/g, 'Mon – Sat');
  content = content.replace(/8:00 AM  7:00 PM/g, '8:00 AM – 7:00 PM');
  content = content.replace(/ 2026/g, '© 2026');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated theme in:', path.relative(srcDir, file));
    totalReplacements++;
  }
}

console.log(`\nTheme replacement complete. Updated ${totalReplacements} files.`);
