var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

// Read index.html for palette components
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// --- Extract palette HTML (from <!-- 调色盘 --> to </body>) ---
var palHtml = idx.substring(
  idx.indexOf('<!-- 调色盘 -->'),
  idx.indexOf('</body>')
);

// --- Extract palette JS ---
// The palette script is the LAST script block with DEFAULTS
// Find by looking for 'var DEFAULTS={' then go back to find the preceding <script>
var defStart = idx.indexOf('var DEFAULTS={');
// Go back to find the opening <script>
var scriptOpen = idx.lastIndexOf('<script>', defStart);
// Find the closing </script>
var scriptClose = idx.indexOf('</script>', defStart);
var palJS = idx.substring(scriptOpen + 8, scriptClose);

console.log('=== Palette Components ===');
console.log('palHtml length:', palHtml.length);
console.log('palJS length:', palJS.length);
console.log('palJS starts with:', palJS.substring(0, 60));
console.log('palJS ends with:', palJS.substring(palJS.length - 40));

// --- Extract CSS variables (:root block) ---
var styleStart = idx.indexOf('<style>');
var styleContent = idx.substring(styleStart + 7, idx.indexOf('</style>'));
var rootStart = styleContent.indexOf(':root{');
var rootEnd = styleContent.indexOf('}', rootStart);
var cssVars = styleContent.substring(rootStart, rootEnd + 1);

console.log('cssVars:', cssVars.substring(0, 60) + '...');

// --- Color replacement mapping ---
var colorReplacements = [
  ['#ffc832', 'var(--accent)'],
  ['rgba(255,200,50,', 'rgba(var(--accent-rgb),'],
  ['rgba(20,20,30,0.6)', 'var(--card-bg)'],
  ['rgba(255,255,255,0.05)', 'var(--card-border)'],
  ['rgba(255,255,255,0.06)', 'var(--user-border)'],
  ['rgba(15,15,24,0.92)', 'var(--menu-bg)'],
  ['#08080e', 'var(--bg-page)'],
  ['#4a9eff', 'var(--btn-blue-text)'],
  ['#ff6b6b', 'var(--btn-red-text)'],
  ['#51cf66', 'var(--btn-green-text)'],
  ['#cc5de8', 'var(--btn-purple-text)']
];

// --- Backup filenames to skip ---
var backupPatterns = ['bak', 'backup', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10',
  'hotfix', 'before-px', 'old'];

function isBackup(filename) {
  var lower = filename.toLowerCase();
  // Exact backup names
  var basename = lower.replace('.html', '');
  var exactBackups = [
    'map-valley-完美版',  // this is NOT a backup, it's the "perfect" version
  ];
  // Check patterns
  return backupPatterns.some(function(p) {
    return basename.indexOf(p) >= 0;
  });
}

var files = fs.readdirSync(pagesDir).filter(function(f) {
  return f.endsWith('.html') && !isBackup(f);
});

// Exclude map-valley-完美版.html from backup filter since it's the "perfect" version
var allFiles = fs.readdirSync(pagesDir).filter(function(f) {
  return f.endsWith('.html');
});

var backupFiles = allFiles.filter(function(f) {
  var lower = f.toLowerCase();
  return f === 'map-valley-完美版.html' ? false : backupPatterns.some(function(p) {
    return lower.indexOf(p) >= 0;
  });
});

console.log('\n=== Backup files skipped ===');
backupFiles.forEach(function(f) { console.log('  ' + f); });

var actualFiles = allFiles.filter(function(f) {
  return backupFiles.indexOf(f) < 0;
});

console.log('\n=== Files to process ===');
actualFiles.forEach(function(f) { console.log('  ' + f); });

var injected = 0;
var skipped = 0;

actualFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  var c = fs.readFileSync(fp, 'utf-8');
  
  // Skip if file is too small (placeholder)
  if (c.length < 50) {
    console.log(file + ': too small (' + c.length + ' bytes), skip');
    skipped++;
    return;
  }
  
  // Skip if already has palette
  if (c.indexOf('paletteBtn') >= 0 || c.indexOf('palettePanel') >= 0) {
    console.log(file + ': already has palette, skip');
    skipped++;
    return;
  }
  
  // 1. Inject CSS variables into <style> tag
  if (c.indexOf('<style>') >= 0) {
    c = c.replace('<style>', '<style>\n' + cssVars + '\n');
  } else if (c.indexOf('<link rel="stylesheet"') >= 0) {
    c = c.replace('<head>', '<head><style>' + cssVars + '</style>\n');
  }
  
  // 2. Replace hardcoded colors with CSS variable references
  colorReplacements.forEach(function(r) {
    c = c.split(r[0]).join(r[1]);
  });
  
  // 3. Inject palette HTML before </body>
  c = c.replace('</body>', palHtml + '</body>');
  
  // 4. Inject palette JS before last </script>
  var ls = c.lastIndexOf('</script>');
  if (ls >= 0) {
    c = c.substring(0, ls) + '\n' + palJS + '\n' + c.substring(ls);
  }
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': injected (size: ' + c.length + ')');
  injected++;
});

console.log('\n=== Summary ===');
console.log('Injected:', injected);
console.log('Skipped:', skipped);

// --- Validation ---
console.log('\n=== Validation ===');
var validateFiles = actualFiles.slice(0, 6); // Check first 6 files
validateFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) {
    console.log(file + ': FILE NOT FOUND');
    return;
  }
  var c = fs.readFileSync(fp, 'utf-8');
  var checks = {
    hasPaletteBtn: c.indexOf('paletteBtn') >= 0,
    hasTHEMES: c.indexOf('THEMES') >= 0,
    hasApplyAll: c.indexOf('applyAll') >= 0,
    hasDEFAULTS: c.indexOf('DEFAULTS') >= 0,
    hasRootVars: c.indexOf(':root{') >= 0,
    bracesBalanced: (c.match(/\{/g) || []).length === (c.match(/\}/g) || []).length
  };
  var allOk = Object.values(checks).every(function(v) { return v; });
  console.log(file + ': ' + (allOk ? 'PASS' : 'FAIL') + ' (size:' + c.length + ')');
  Object.keys(checks).forEach(function(k) {
    if (!checks[k]) console.log('  MISSING: ' + k);
  });
});
