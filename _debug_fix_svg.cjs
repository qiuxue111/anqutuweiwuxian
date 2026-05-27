var fs=require('fs');
var c=fs.readFileSync('F:/暗区突围网站/pages/review.html','utf8');
// Find the Map thumbnail + SVG block and remove it
var start=c.indexOf('// Map thumbnail');
var end=c.indexOf('// Go to map button (renderDels)', start);
if(start>=0&&end>=0){
  var oldBlock=c.substring(start, end);
  c=c.replace(oldBlock, '');
  fs.writeFileSync('F:/暗区突围网站/pages/review.html',c);
  console.log('SVG thumbnail removed');
} else {
  console.log('Not found:', start, end);
}
// verify
var c2=fs.readFileSync('F:/暗区突围网站/pages/review.html','utf8');
console.log('svg viewBox:', c2.indexOf('svg viewBox')>=0?'STILL EXISTS':'REMOVED');
console.log('Map thumbnail:', c2.indexOf('Map thumbnail')>=0?'STILL EXISTS':'REMOVED');
