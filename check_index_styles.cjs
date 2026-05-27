const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');
const head = c.substring(0, c.indexOf('</head>'));
const links = [...head.matchAll(/<link[^>]*>/g)].map(m => m[0]);
console.log('CSS links in index.html:');
console.log(links.join('\n'));
// Check inline styles
const styleTags = [...head.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)];
styleTags.forEach(s => console.log('Inline style:', s[0].substring(0, 80)));
