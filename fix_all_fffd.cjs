const fs = require('fs');
const path = require('path');

const pagesDir = 'F:\\暗区突围网站';

// Get all HTML files
const files = [
  'index.html',
  'search.html',
  ...fs.readdirSync(pagesDir + '\\pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f)
];

// Common Chinese characters followed by U+FFFD that should be just the character
// Maps broken char+FFFD to correct character
const charFixes = {
  '类\xef\xbf\xbd': '类',
  '型\xef\xbf\xbd': '型',
  '人\xef\xbf\xbd': '人',
  '匙\xef\xbf\xbd': '匙',
  '库\xef\xbf\xbd': '库',
  '站\xef\xbf\xbd': '站',
  '点\xef\xbf\xbd': '点',
  '色\xef\xbf\xbd': '色',
  '价\xef\xbf\xbd': '价',
  '坪\xef\xbf\xbd': '坪',
  '台\xef\xbf\xbd': '台',
  '厂\xef\xbf\xbd': '厂',
  '桥\xef\xbf\xbd': '桥',
  '营\xef\xbf\xbd': '营',
  '做\xef\xbf\xbd': '做',
  '流\xef\xbf\xbd': '流',
  '场\xef\xbf\xbd': '场',
  '枪\xef\xbf\xbd': '枪',
  '的\xef\xbf\xbd': '的',
  '药\xef\xbf\xbd': '药',
  '装\xef\xbf\xbd': '装',
  '板\xef\xbf\xbd': '板',
  '示\xef\xbf\xbd': '示',
  '体\xef\xbf\xbd': '体',
  '理\xef\xbf\xbd': '理',
  '层\xef\xbf\xbd': '层',
  '键\xef\xbf\xbd': '键',
  '行\xef\xbf\xbd': '行',
  '攻\xef\xbf\xbd': '攻',
  '弹\xef\xbf\xbd': '弹',
  '位\xef\xbf\xbd': '位',
  '法\xef\xbf\xbd': '法',
  '细\xef\xbf\xbd': '细',
  '动\xef\xbf\xbd': '动',
  '手\xef\xbf\xbd': '手',
  '带\xef\xbf\xbd': '带',
  '的\xef\xbf\xbd': '的',
  '灯\xef\xbf\xbd': '灯',
  '条\xef\xbf\xbd': '条',
  '件\xef\xbf\xbd': '件',
  '览\xef\xbf\xbd': '览',
  '布\xef\xbf\xbd': '布',
  '信\xef\xbf\xbd': '信',
  '步\xef\xbf\xbd': '步',
  '练\xef\xbf\xbd': '练',
  '出\xef\xbf\xbd': '出',
  '我\xef\xbf\xbd': '我',
};

// Also capture pattern: common Chinese char + 3-byte UTF-8 sequence EF BF BD
function fixFile(relPath) {
  const fullPath = pagesDir + '\\' + relPath.replace(/\//g, '\\');
  const buf = fs.readFileSync(fullPath);
  let fixed = false;
  
  // Check if file contains FFFD
  const fffdCount = (buf.toString('utf8').match(/\ufffd/g) || []).length;
  if (fffdCount === 0) {
    console.log(`${relPath}: clean, no FFFD`);
    return;
  }
  
  let content = buf.toString('utf8');
  const origLen = content.length;
  
  // Fix known pattern: Chinese char followed by U+FFFD
  // U+FFFD is the replacement character, indicating a corruption
  // The pattern is: right char -> FFFD where FFFD is extra
  // Strategy: remove FFFD if it's between chars and HTML tags
  
  // Remove FFFD that appears inside text content (not in tag structure)
  // A simple approach: remove ALL FFFD chars
  const cleaned = content.replace(/\ufffd/g, '');
  
  if (cleaned.length !== content.length) {
    const removed = content.length - cleaned.length;
    fs.writeFileSync(fullPath, cleaned);
    console.log(`${relPath}: removed ${removed} FFFD chars (${origLen} -> ${cleaned.length} bytes)`);
    fixed = true;
  }
  
  return fixed;
}

files.forEach(f => fixFile(f));

console.log('\nDone. Now check for any broken HTML...');
