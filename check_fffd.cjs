const fs = require('fs');
const { execSync } = require('child_process');

const repoDir = 'F:\\暗区突围网站';
const base = execSync(`git -C "${repoDir}" show 83c97c8:pages/maps.html`).toString('utf8');

// Find all FFFD and their context
let idx = -1;
let count = 0;
while ((idx = base.indexOf('\ufffd', idx + 1)) >= 0 && count < 20) {
  count++;
  const ctx = base.substring(Math.max(0, idx - 30), idx + 30);
  console.log(`#${count} at ${idx}: "${ctx.replace(/\ufffd/g, '�')}"`);
  if (count >= 10) { console.log('... (showing 10/116)'); break; }
}
