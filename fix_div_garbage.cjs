const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find the garbage between armory's end and farm's start
// Pattern: armory </div> + stray button text + extra </div></div> + farm
const armoryClose = '    </div>';
const farmComment = '<!-- 农场 -->';
const armoryEnd = c.lastIndexOf(armoryClose, c.indexOf(farmComment));

if (armoryEnd >= 0) {
  const garbageStart = armoryEnd + armoryClose.length;
  const farmStart = c.indexOf(farmComment);
  
  if (garbageStart < farmStart) {
    const garbage = c.substring(garbageStart, farmStart);
    console.log('Garbage to remove:', JSON.stringify(garbage.substring(0, 200)));
    
    c = c.substring(0, garbageStart) + '\n\n    ' + c.substring(farmStart);
    console.log('Removed garbage of length:', garbage.length);
    
    // Also check for extra </div></div> before farm section
    // The stray button text contains: "style=..." + "\n      </div>\n    </div>"
    // After that there's probably farm section. Need to count div depth.
  }
}

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Done. File size:', c.length);
