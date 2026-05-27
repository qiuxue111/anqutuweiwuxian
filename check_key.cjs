const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
const m = c.match(/SUPABASE_ANON_KEY="([^"]+)"/);
console.log('map-farm key:', m ? m[1].substring(0,40)+'...' : 'NOT FOUND');

const c2 = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf8');
const m2 = c2.match(/SUPABASE_ANON_KEY="([^"]+)"/);
console.log('review key:', m2 ? m2[1].substring(0,40)+'...' : 'NOT FOUND');
// Also check for the anon key in review
var allMatches = c2.match(/SUPABASE_ANON_KEY[^;]+/g);
if (allMatches) allMatches.forEach(function(x,i){ console.log('  match',i,':',x.substring(0,50)); });
