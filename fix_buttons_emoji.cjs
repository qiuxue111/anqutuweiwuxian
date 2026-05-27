const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find all button-like patterns and fix their emoji
const btnPattern = /"font-size:0\.9rem;">([^<]+)<\/a>/g;
let match;
const replacements = [];
while ((match = btnPattern.exec(c)) !== null) {
  const content = match[1];
  if (!content.includes('🗺')) {
    console.log(`Missing emoji: "${content}" at ${match.index}`);
    replacements.push({ idx: match.index, old: content, new: '🗺 ' + content.trim() });
  }
}

// Apply fixes in reverse order (from end to start)
replacements.reverse().forEach(r => {
  c = c.slice(0, r.idx + 18) + r.new + c.slice(r.idx + 18 + r.old.length);
});

// Also fix indentation
c = c.replace(/\n {16}<div style="margin-top:1rem;">/g, '\n      <div style="margin-top:1rem;">');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Final check
const btns = c.match(/"font-size:0\.9rem;">[^<]+<\/a>/g) || [];
btns.forEach((b, i) => {
  const hasEmoji = b.includes('🗺');
  const emojiStatus = hasEmoji ? '✅' : '❌';
  console.log(`${emojiStatus} Button ${i+1}: ${b}`);
});
