const fs = require('fs');
const maps = ['map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const root = 'F:\\暗区突围网站\\pages\\';

maps.forEach(function(name) {
  var fp = root + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  
  // 1. Add onclick to mdBtn
  c = c.replace('<button id="mdBtn" class="mode">', '<button id="mdBtn" class="mode" onclick="toggleMode()">');
  
  // 2. Fix zoom formula
  c = c.replace(
    'function zoom(f,cx,cy){\n  if(cx===void 0||cy===void 0){scaleM*=f;}\n  else{var prev=scaleM;scaleM*=f;panX=cx-(cx-panX)*scaleM/prev;panY=cy-(cy-panY)*scaleM/prev;}\n  if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();\n}',
    'function zoom(f,cx,cy){\n  if(cx===void 0||cy===void 0){scaleM*=f;if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();return;}\n  var prev=scaleM,newScale=scaleM*f;\n  if(newScale<0.2)newScale=0.2;if(newScale>8)newScale=8;\n  var img=document.getElementById("mapImg");if(!img)return;\n  var imgW=img.naturalWidth||img.clientWidth,imgH=img.naturalHeight||img.clientHeight;\n  var mv=document.getElementById("mv");if(!mv)return;\n  var mvR=mv.getBoundingClientRect();\n  var imgX=(cx-panX)/prev,imgY=(cy-panY)/prev;\n  panX=cx-imgX*newScale;panY=cy-imgY*newScale;\n  scaleM=newScale;ut();\n}'
  );
  
  // 3. Fix zoomTo
  c = c.replace(
    'if(cx!==void 0&&cy!==void 0){var r=v/scaleM;panX=cx-(cx-panX)/r;panY=cy-(cy-panY)/r;}',
    'if(cx!==void 0&&cy!==void 0){\n    var img=document.getElementById("mapImg");if(!img)return;\n    var imgX=(cx-panX)/scaleM,imgY=(cy-panY)/scaleM;\n    panX=cx-imgX*v;panY=cy-imgY*v;\n  }'
  );
  
  // 4. Replace empty layerData
  c = c.replace('var layerData={};', 'var layerData={物资:["普通物资箱","高级物资箱"],弹药:["子弹箱","手雷箱"],医疗:["医疗箱"],工具:["工具箱"],容器:["旅行箱","运动包","保险箱","专业军备箱","大型武器箱","战术配件箱"],钥匙:["通用钥匙"],密室:["密码门","密室"],敌人:["普通敌人","精英敌人","游荡者","首领"],衣物:["大衣"],家具:["抽屉"],文档:["文件柜"],贵重:["保险箱"],武器:["大型武器箱","专业军备箱"],配件:["战术配件箱"],BOSS:["首领"],其他:["其他"]};');
  
  fs.writeFileSync(fp, c);
  
  // Validate
  var c2 = fs.readFileSync(fp, 'utf8');
  var m = c2.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    try {
      new Function(m[1]);
      console.log(name + ': VALID');
    } catch(e) {
      console.log(name + ': ERROR - ' + e.message.substring(0,50));
    }
  }
});
