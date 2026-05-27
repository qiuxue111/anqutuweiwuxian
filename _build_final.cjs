var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
var mapEngs={'map-farm':'farm','map-beishan':'beishan','map-valley':'valley','map-armory':'armory','map-airport':'airport','map-tvstation':'tvstation'};
var mapCNs={'map-farm':'农场','map-beishan':'北山','map-valley':'河谷','map-armory':'军港','map-airport':'机场','map-tvstation':'电视台'};

// 1. 从每个模块文件读取 code = [...]，用 eval 提取
var allLines=[];
['_mod01_basics','_mod02_events','_mod03_picker','_mod04_markers','_mod05_details','_mod06_layers','_mod07_cloud'].forEach(function(mn){
  var src=fs.readFileSync('F:\\暗区突围网站\\'+mn+'.cjs','utf8');
  // 找到 code 数组
  var start=src.indexOf('var code = [');
  if(start<0){console.log(mn+': no code array');return;}
  var arrStart=src.indexOf('[',start+10);
  // 找到匹配的 ]
  var depth=0,i=arrStart;
  while(i<src.length){
    if(src[i]==='['||src[i]==='{')depth++;
    if(src[i]===']'||src[i]==='}')depth--;
    if(src[i]===']'&&depth<0)break;
    i++;
  }
  var arrStr=src.substring(arrStart, i+1);
  try{
    // 安全 eval code 数组
    var fn=new Function('return '+arrStr+';');
    var arr=fn();
    console.log(mn+':', arr.length, 'items');
    arr.forEach(function(item){allLines.push(item);});
  }catch(e){
    console.log(mn+': eval error:', e.message);
  }
});

console.log('Total:', allLines.length, 'lines');

// 2. 安全处理：将 JS 代码中每个 </ 转义为 <\\/
function escapeScript(s){
  return s.replace(/<\//g, '<\\/');
}

// 3. 注入每个地图
maps.forEach(function(m){
  var eng=mapEngs[m];
  var cn=mapCNs[m];
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var html=fs.readFileSync(fp,'utf8');
  
  // 替换占位符
  var code=allLines.map(function(l){
    return l.replace(/MAP_ENG/g, eng).replace(/MAP_CN/g, cn);
  }).join('\n');
  
  // 清空所有 script 标签
  html=html.replace(/<script>[\s\S]*?<\/script>/g, '');
  // 注入
  html=html.replace('</body>', '<script>\n'+escapeScript(code)+'\n</script>\n</body>');
  fs.writeFileSync(fp, html);
  console.log(m+': DONE ('+code.length+' bytes)');
});

// 4. 验证
var html=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var tagS=(html.split('<script>').length-1);
var tagE=(html.split('</script>').length-1);
console.log('Structure:', tagS+'/'+tagE, tagS===tagE?'OK':'FAIL');
var ms=html.match(/<script>([\s\S]*?)<\/script>/);
if(ms){
  var codeText=ms[1].replace(/<\//g, '</'); // un-escape
  var checks=['loginGitHub','checkReviewBtn','jumpToFromUrl','getIconUrl','supabase','placePin','renderMarkers','deleteCurrentPin','loadCloudPins','toggleMenu','renderLayers'];
  checks.forEach(function(f){
    var cnt=codeText.split(f).length-1;
    var s=cnt>1?'⚠':cnt===0?'❌':'';
    if(cnt!==1) console.log(f+': '+cnt+' '+s);
  });
  try{new Function(codeText);console.log('PARSE OK');}catch(e){console.log('PARSE ERROR:',e.message);}
}
