var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  c=c.replace('<button id="sb" class="sel-btn">层级</button>','');
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('ALL DONE');
