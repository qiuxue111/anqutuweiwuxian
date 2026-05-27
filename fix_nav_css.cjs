const fs = require('fs');

const css = fs.readFileSync('F:\\暗区突围网站\\style.css', 'utf8');
// Revert back to flex-based approach with explicit nav structure
const newNavbar = `.navbar {
  position: fixed; top: 0; width: 100%;
  background: rgba(10,10,15,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,200,50,0.15);
  z-index: 999;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 60px;
}
.navbar .nav-links {
  display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0;
}
.navbar #loginBtn {
  flex-shrink: 0;
}`;

fs.writeFileSync('F:\\暗区突围网站\\style.css', css.replace(/\.navbar[\s\S]*?(?=\.|$)/, newNavbar));
console.log('CSS updated');
