const fs = require('fs');
const path = require('path');
const pagesDir = 'F:\\暗区突围网站';
const files = [
  'index.html', 'search.html',
  ...fs.readdirSync(pagesDir + '\\pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f)
];

const brokenPattern = /\?\/([a-z]+)>/g;
const fixes = [
  [/\?<\//g, '</'],
  [/\?\/strong>/g, '</strong>'],
  [/\?\/span>/g, '</span>'],
  [/\?\/li>/g, '</li>'],
  [/\?\/div>/g, '</div>'],
  [/\?\/h3>/g, '</h3>'],
  [/\?\/a>/g, '</a>'],
  [/\?\/p>/g, '</p>'],
  [/\?\/h2>/g, '</h2>'],
  [/\?\/h1>/g, '</h1>'],
  [/\?\/title>/g, '</title>'],
];

files.forEach(rel => {
  const full = pagesDir + '\\' + rel.replace(/\//g, '\\');
  let c = fs.readFileSync(full, 'utf8');
  const broken = (c.match(brokenPattern) || []).length;
  if (broken > 0) {
    fixes.forEach(([re, replacement]) => { c = c.replace(re, replacement); });
    fs.writeFileSync(full, c);
    console.log(`${rel}: fixed ${broken} broken tags`);
  } else {
    console.log(`${rel}: clean`);
  }
});
