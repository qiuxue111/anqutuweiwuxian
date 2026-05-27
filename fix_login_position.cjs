const fs = require('fs');
const pages = ['pages/maps.html','pages/weapons.html','pages/strategy.html','pages/gear.html','pages/help.html','search.html'];
const fixes = [];

pages.forEach(f => {
  const c = fs.readFileSync('F:\\暗区突围网站\\' + f, 'utf8');
  // Check if loginBtn is before nav-links
  const navLinksIdx = c.indexOf('<ul class="nav-links">');
  const loginIdx = c.indexOf('id="loginBtn"');
  const afterNavLinks = c.lastIndexOf('</ul>', c.indexOf('</nav>'));
  
  if (loginIdx > 0 && loginIdx < navLinksIdx) {
    // Find the full login button HTML
    const btnStart = c.lastIndexOf('<button', loginIdx);
    const btnEnd = c.indexOf('</button>', btnStart) + 9;
    const btnHtml = c.substring(btnStart, btnEnd);
    
    // Remove it from current position
    let newC = c.substring(0, btnStart) + c.substring(btnEnd);
    
    // Find the </ul> before </nav>
    const ulClose = newC.lastIndexOf('</ul>', newC.indexOf('</nav>'));
    
    // Insert login button after </ul> with margin-left:auto
    const insertBtn = btnHtml.replace('margin-right:0.5rem', 'margin-left:auto;flex-shrink:0').replace('margin-right:0.3rem', 'margin-left:auto;flex-shrink:0');
    newC = newC.substring(0, ulClose + 5) + '\n    ' + insertBtn + '\n  ' + newC.substring(ulClose + 5);
    
    fs.writeFileSync('F:\\暗区突围网站\\' + f, newC);
    fixes.push(f + ': moved login after nav-links');
  } else {
    // Already after nav-links or no login, skip
    if (loginIdx > 0) {
      fixes.push(f + ': login already after nav-links');
    } else {
      fixes.push(f + ': no login button');
    }
  }
});

console.log(fixes.join('\n'));
