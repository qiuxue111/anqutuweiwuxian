const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 把 renderMarkers 里的 32px 改成 24/scaleM
var old1 = "style=\"width:32px;height:32px;border-radius:6px;object-fit:cover;border:2px solid rgba(255,200,50,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.5)\"";
var new1 = "style=\"width:\"+(24/scaleM)+'px;height:\"+(24/scaleM)+'px;border-radius:\"+(6/scaleM)+'px;object-fit:cover;border:\"+(2/scaleM)+'px solid rgba(255,200,50,0.6);box-shadow:0 0 \"+(8/scaleM)+'px rgba(0,0,0,0.5)\"";

// 但这太复杂了，直接用字符串拼接
c = c.replace(old1, "' style=\"width:'+(24/scaleM)+'px;height:'+(24/scaleM)+'px;border-radius:'+(6/scaleM)+'px;object-fit:cover;border:'+(2/scaleM)+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+(8/scaleM)+'px rgba(0,0,0,0.5)\"");

// 同样修normal圆点
var oldDot = "style=\"width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)\"";
c = c.replace(oldDot, "' style=\"width:'+(12/scaleM)+'px;height:'+(12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+(2/scaleM)+'px solid #fff;box-shadow:0 0 '+(6/scaleM)+'px rgba(0,0,0,0.5)\"");

// 第二个dot（用于无图标兜底）
var oldDot2 = "style=\"width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)\"";
c = c.replace(oldDot2, "' style=\"width:'+(12/scaleM)+'px;height:'+(12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+(2/scaleM)+'px solid #fff;box-shadow:0 0 '+(6/scaleM)+'px rgba(0,0,0,0.5)\"");

// 修复showPinDetail里的图标大小
var oldPd = "style=\"width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px\"";
c = c.replace(oldPd, "' style=\"width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px\"");

fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Fixed icon sizes');
