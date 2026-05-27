const fs = require('fs');
var c = fs.readFileSync("F:\\暗区突围网站\\pages\\map-farm.html", 'utf8');
var scripts = [];
var re = /<script>([\s\S]*?)<\/script>/g;
var m;
while ((m = re.exec(c)) !== null) scripts.push({ index: m.index, full: m[0], inner: m[1] });
console.log('Script count:', scripts.length);
scripts.forEach(function(s, i) { console.log('Script #' + i + ':', s.full.length, 'chars'); });
// The last script is the one to replace
var last = scripts[scripts.length - 1];
console.log('Last script starts at:', last.index, 'ends at:', last.index + last.full.length);
// Check if it has the key words
console.log('Has zoom:', last.inner.includes('function zoom'));
console.log('Has showPicker:', last.inner.includes('showPicker'));
console.log('Has supabase:', last.inner.includes('function supabase'));
console.log('Has loginGitHub:', last.inner.includes('loginGitHub'));
