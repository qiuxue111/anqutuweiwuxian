const fs = require('fs');
const path = require('path');

// 1. Find all nav bars across pages and change 枪械/技术/配装  labels
// Also rename nav link labels
const renameNavMap = {
  'pages/weapons.html': { oldNavLink: '枪械', newNavLink: '帖子' },
  'pages/strategy.html': { oldNavLink: '技术', newNavLink: '闲聊' },
  'pages/gear.html': { oldNavLink: '配装', newNavLink: '攻略' },
};

// 2. For the main pages (index, maps, search, map-editor) also rename nav links
const sharedNavMap = {
  'index.html': { changes: [
    { old: '枪械', new: '帖子' },
    { old: '技巧', new: '闲聊' },
    { old: '配装', new: '攻略' }
  ]},
  'pages/maps.html': { changes: [
    { old: '枪械', new: '帖子' },
    { old: '技术', new: '闲聊' },
    { old: '配装', new: '攻略' }
  ]},
  'search.html': { changes: [
    { old: '枪械', new: '帖子' },
    { old: '技术', new: '闲聊' },
    { old: '配装', new: '攻略' }
  ]},
  'pages/map-editor.html': { changes: [
    { old: '枪械', new: '帖子' },
    { old: '技术', new: '闲聊' },
    { old: '配装', new: '攻略' }
  ]}
};

// 3. For the renamed pages themselves (weapons/strategy/gear), they become module pages
// weapons.html -> 帖子 pages
// strategy.html -> 闲聊 pages  
// gear.html -> 攻略 pages

const pagesDir = 'F:\\暗区突围网站';

// Process navigations
[...Object.entries(sharedNavMap), ...Object.entries(renameNavMap).map(([k,v]) => [k, { changes: [
  { old: v.oldNavLink, new: v.newNavLink }
]}])].forEach(([file, config]) => {
  const fullPath = path.join(pagesDir, file);
  if (!fs.existsSync(fullPath)) {
    console.log(file + ': NOT FOUND');
    return;
  }
  let c = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  config.changes.forEach(({ old, new: newText }) => {
    // Find nav link by the text between > and </a>
    // Pattern: <a href="...">旧标签</a>
    const regex = new RegExp(`(<a[^>]*>)\\s*${old}\\s*(<\\/a>)`, 'g');
    if (regex.test(c)) {
      c = c.replace(regex, `$1${newText}$2`);
      changed = true;
      console.log(`${file}: '${old}' -> '${newText}'`);
    }
  });

  // Also rename page titles
  if (file === 'pages/weapons.html') {
    c = c.replace('<title>枪械', '<title>帖子');
    changed = true;
  } else if (file === 'pages/strategy.html') {
    c = c.replace('<title>技术', '<title>闲聊');
    changed = true;
  } else if (file === 'pages/gear.html') {
    c = c.replace('<title>配装', '<title>攻略');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, c);
  }
});

// Also update the buttons on index (英雄卡片)
const indexHtml = fs.readFileSync(path.join(pagesDir, 'index.html'), 'utf8');
let idx = indexHtml;
idx = idx.replace(/枪械/g, '帖子').replace(/配装/g, '攻略');
// 技巧 is only in index, change to 闲聊
idx = idx.replace(/技巧/g, '闲聊');
// Also the <title>
idx = idx.replace('<title>暗区突围', '<title>暗区突围');
fs.writeFileSync(path.join(pagesDir, 'index.html'), idx);

console.log('\nDone. All nav labels updated.');
