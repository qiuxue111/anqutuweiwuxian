var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
// 在代码数组中精确查找
var target='"function placePin(tp){';
var idx=c.indexOf(target);
if(idx<0){
  console.log('NOT FOUND with double quote');
  // try without
  var idx2=c.indexOf('placePin(tp){if(!');
  console.log('Simple search at', idx2, ':', c.substring(idx2, idx2+50));
}
else{
  console.log('Found at', idx);
}
