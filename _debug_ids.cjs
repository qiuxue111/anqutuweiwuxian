var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ids=['pdX','pdY','pdNote','pd','pdTitle','pdImgGrid','pdSaved','pdcList','pdcInput','pdcBtn','mcList','mcInput','ab','zr','zl','ch','cv','mdBtn','sb','lp','lbb'];
ids.forEach(function(id){
  if(c.indexOf('id="'+id+'"')>=0) console.log(id+': OK');
  else console.log(id+': MISSING');
});
