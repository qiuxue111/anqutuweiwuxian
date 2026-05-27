const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find all map-XXX.html links and check for emoji
['beishan','valley','armory','airport','tvstation','farm'].forEach(k => {
  const re = new RegExp('map-' + k + '\\.html"[^>]*></a>', 'g');
  let m;
  while ((m = re.exec(c)) !== null) {
    // Go back to see the full tag
    const tagStart = c.lastIndexOf('<a ', m.index);
    const tagEnd = m.index + m[0].length;
    const fullTag = c.substring(tagStart, tagEnd);
    const hasEmoji = fullTag.includes('🗺');
    const textStart = fullTag.indexOf('">') + 2;
    const text = fullTag.substring(textStart, fullTag.lastIndexOf('</a>'));
    console.log(`${k}: ${hasEmoji ? '✅' : '❌'} text="${text}"`);
    console.log(`  Tag: ${fullTag.substring(0, 80)}...`);
    
    // Fix if missing
    if (!hasEmoji && text.trim()) {
      const insertPos = tagEnd - '</a>'.length - text.length;
      const emojiInsert = c.indexOf('">', insertPos) + 2;
      if (emojiInsert > insertPos) {
        c = c.slice(0, emojiInsert) + '🗺 ' + c.slice(emojiInsert);
        console.log('  -> Fixed!');
      }
    }
  }
});

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone, verifying again...');

// Verify
['beishan','valley','armory','airport','tvstation','farm'].forEach(k => {
  const re = new RegExp('map-' + k + '\\.html"[^>]*></a>', 'g');
  let m;
  while ((m = re.exec(c)) !== null) {
    const tagStart = c.lastIndexOf('<a ', m.index);
    const tagEnd = m.index + m[0].length;
    const fullTag = c.substring(tagStart, tagEnd);
    const hasEmoji = fullTag.includes('🗺');
    const textStart = fullTag.indexOf('">') + 2;
    const text = fullTag.substring(textStart, fullTag.lastIndexOf('</a>'));
    console.log(`${k}: ${hasEmoji ? '✅' : '❌'} "${text}"`);
  }
});
