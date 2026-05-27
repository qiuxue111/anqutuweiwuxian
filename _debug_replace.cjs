var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');
// find the replace lines
var idx=c.indexOf('MAP_ENG');
if(idx<0){
  console.log('MAP_ENG missing from source file!');
} else {
  console.log('MAP_ENG found at', idx);
  // find the .replace lines
  var replaceIdx=c.indexOf('.replace');
  while(replaceIdx>=0){
    console.log('REPLACE at',replaceIdx,':',c.substring(replaceIdx, replaceIdx+120));
    replaceIdx=c.indexOf('.replace',replaceIdx+1);
  }
}
