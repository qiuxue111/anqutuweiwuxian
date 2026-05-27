var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
var mapEngs={'map-farm':'farm','map-beishan':'beishan','map-valley':'valley','map-armory':'armory','map-airport':'airport','map-tvstation':'tvstation'};
var mapCNs={'map-farm':'农场','map-beishan':'北山','map-valley':'河谷','map-armory':'军港','map-airport':'机场','map-tvstation':'电视台'};

// 所有模块代码（不含 </script> 字面量——使用 unicode 转义绕开）
var _lt = '\\x3C'; // <
var _fs = '\\/';   // /

// 方法：把模块代码 stringify 进 JSON，确保没有 </ 字面量
function safe(str) {
  // 替换所有 </ 为 <\/
  return str.replace(/<\//g, '<' + _fs);
}

// 模块代码（直接从各 _mod*.cjs 的 code 变量拼接）
var codeLines=[];

// ====== module1 - basics ======
var mod1=require('./_mod01_basics.cjs');
// 不再require，直接提取
['mod01_basics','mod02_events','mod03_picker','mod04_markers','mod05_details','mod06_layers','mod07_cloud'].forEach(function(mn){
  var src=fs.readFileSync('F:\\暗区突围网站\\_'+mn+'.cjs','utf8');
  // 找到 var code = [...] 的位置
  var start=src.indexOf('var code = [');
  if(start<0) return;
  // 用 Node 在 Separate context 中 evaluate
  var patched=src.substring(0, src.lastIndexOf('];\n')+3) + '\nmodule.exports=code;\n';
  try {
    var mod={exports:{}};
    // 用新 Function 执行（独立作用域）
    var fn=new Function('require','module','exports','__dirname','__filename',
      patched
    );
    fn(function(){return require;}, mod, mod.exports, '', '');
    var code=mod.exports;
    if(Array.isArray(code)){
      code.forEach(function(l){codeLines.push(safe(l));});
      console.log(mn+':', code.length, 'lines OK');
    }else{
      // fallback: 直接读文件替换占位符并拼接
      console.log(mn+': not array, skipping');
    }
  }catch(e){
    console.log(mn+': eval failed:', e.message);
  }
});

// 生成最终代码字符串
var rawCode=codeLines.join('\n');

// 替换占位符
rawCode=rawCode.replace(/MAP_ENG/g, function(){return 'MAP_ENG_PLACEHOLDER';});

// 对每个地图生成的代码
maps.forEach(function(m){
  var eng=mapEngs[m];
  var cn=mapCNs[m];
  // 读取 iconUrls 对象（在模块数据中）
  var iconUrls=JSON.parse(fs.readFileSync('F:\\暗区突围网站\\pages\\'+m+'.html','utf8').match(/iconUrls=(\{[\s\S]*?\});/)? function(m){ 
    // 懒人方法：直接用字符串替换
    var c=fs.readFileSync('F:\\暗区突围网站\\pages\\'+m+'.html','utf8');
    // 读原本的 iconUrls 定义（如果有）
    return {};  
  }() : '{}');
});

// 清理：用最简单的直接注入法
maps.forEach(function(m){
  var eng=mapEngs[m];
  var cn=mapCNs[m];
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  // 移除所有 <script>...</script>
  c=c.replace(/<script>[\s\S]*?<\/script>/g, '');
  // 注入新代码
  var code=rawCode
    .replace(/MAP_ENG/g, eng)
    .replace(/MAP_CN/g, cn);
  c=c.replace('</body>', '<script>\n'+code+'\n</script>\n</body>');
  fs.writeFileSync(fp, c);
  console.log(m+': INJECTED ('+code.length+' bytes)');
});

// 验证结构
var vc=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var tagS=(vc.split('<script>').length-1);
var tagE=(vc.split('</script>').length-1);
console.log('Structure: <script>='+tagS+' </script>='+tagE, tagS===tagE?'OK':'FAIL');
if(tagS===1&&tagE===1){
  var ms=vc.match(/<script>([\s\S]*?)<\/script>/);
  if(ms){
    var codeText=ms[1];
    var checks=['loginGitHub','checkReviewBtn','jumpToFromUrl','getIconUrl','supabase','placePin','renderMarkers','deleteCurrentPin','loadCloudPins','toggleMenu','renderLayers'];
    checks.forEach(function(f){var cnt=(codeText.split(f).length-1);console.log('  '+f+':',cnt,cnt>1?'⚠':'',cnt===0?'❌':'');});
    var bra=(codeText.match(/\{/g)||[]).length;
    var brc=(codeText.match(/\}/g)||[]).length;
    console.log('  Braces: {',bra,'=',brc,'- diff:',bra-brc);
    var pa=(codeText.match(/\(/g)||[]).length;
    var pc=(codeText.match(/\)/g)||[]).length;
    console.log('  Parens: (',pa,'=',pc,'- diff:',pa-pc);
    try{new Function(codeText);console.log('  FULL PARSE OK!');}catch(e){console.log('  PARSE ERROR:',e.message);}
  }else{console.log('  NO SCRIPT BLOCK!');}
}else{console.log('  TAG MISMATCH');}
