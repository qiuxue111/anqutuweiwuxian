const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 把所有中文 alert 和 confirm 替换为简单英文
// 规则：alert('...中文...') → alert('OK')
var newc = '';
var i = 0;
while (i < c.length) {
  var idxAlert = c.indexOf("alert('", i);
  var idxConfirm = c.indexOf("confirm('", i);
  
  // 先处理更早出现的
  var idx;
  if (idxAlert >= 0 && (idxConfirm < 0 || idxAlert < idxConfirm)) idx = idxAlert;
  else if (idxConfirm >= 0) idx = idxConfirm;
  else { newc += c.substring(i); break; }
  
  newc += c.substring(i, idx);
  var funcName = c[idx] === 'a' ? "alert(" : "confirm(";
  i = idx + (funcName === "alert(" ? "alert('".length : "confirm('".length);
  
  // 找到字符串结束的 )
  var strEnd = c.indexOf("')", i);
  if (strEnd < 0) { newc += c.substring(idx); break; }
  
  var strContent = c.substring(i, strEnd);
  // 检查是否是中文
  var hasChinese = false;
  for (var k = 0; k < strContent.length; k++) {
    var code = strContent.charCodeAt(k);
    if (code > 127) { hasChinese = true; break; }
  }
  
  if (hasChinese) {
    // 检查字符串内是否包含 )
    var closer = c.indexOf(")", strEnd - 2);
    // 用简单英文
    newc += funcName + "'OK')";
    i = strEnd + 2;
  } else {
    // 保留英文 alert
    newc += funcName + "'" + strContent + "')";
    i = strEnd + 2;
  }
}

fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', newc);
console.log('Done - replaced all Chinese alerts/confirms with OK');
