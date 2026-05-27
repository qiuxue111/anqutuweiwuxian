var fs = require('fs');
var filePath = process.argv[2];
var src = fs.readFileSync(filePath, 'utf8');
var idx = src.indexOf('var code = [');
if (idx < 0) { console.log('NOT FOUND'); process.exit(1); }

// Parse the array: push when we hit " at depth 0, collect until matching "
var items = [];
var i = idx + 12; // skip "var code = ["
while (i < src.length) {
  // skip whitespace and comments
  while (i < src.length && (src[i] === ' ' || src[i] === '\n' || src[i] === '\r' || src[i] === '\t' || src[i] === ',')) i++;
  if (i >= src.length) break;
  // line comment
  if (src[i] === '/' && src[i+1] === '/') { while(i < src.length && src[i] !== '\n') i++; continue; }
  // block comment
  if (src[i] === '/' && src[i+1] === '*') { i += 2; while(i < src.length && !(src[i] === '*' && src[i+1] === '/')) i++; i += 2; continue; }
  if (src[i] === ']') break;
  if (src[i] === '"') {
    i++;
    var cur = '';
    while (i < src.length) {
      if (src[i] === '\\' && src[i+1] === '"') { cur += '"'; i += 2; continue; }
      if (src[i] === '"') break;
      cur += src[i];
      i++;
    }
    items.push(cur);
    i++;
    continue;
  }
  i++;
}

console.log(items.length + ' items');
items.forEach(function(item, idx) {
  // Strip map placeholders
  console.log(idx + ': ' + item.substring(0, 80).replace(/\n/g, '\\n'));
});
