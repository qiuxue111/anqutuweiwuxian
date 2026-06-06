var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/pages/review.html', 'utf-8');

// 1. var zm=3 → 1300
c = c.replace('var zm=3;', 'var zm=1300;');

// 2. 缩放上限 20 → 1600
c = c.replace(/if\(newZm>20\)newZm=20;/g, 'if(newZm>1600)newZm=1600;');

// 3. resetBtn 的 zm=3 → 1300
c = c.replace("zm=3;offsetX=0;offsetY=0;reposition();", "zm=1300;offsetX=0;offsetY=0;reposition();updatePinSize();");

// 4. 楼层切换的 zm=3;offsetX=0;offsetY=0 → +updatePinSize
c = c.replace("zm=3;offsetX=0;offsetY=0;\n      floorBtns.forEach", "zm=1300;offsetX=0;offsetY=0;updatePinSize();\n      floorBtns.forEach");

// 5. 标注点：硬编码尺寸 → 动态
// 替换 red circle + icon
var oldPinSection = c.substring(
  c.indexOf("// Red circle (always)"),
  c.indexOf("  var label=document.createElement('div');")
);

var newPinSection = 
"  // Red circle (always)\n" +
"  var pinCircle=document.createElement('div');\n" +
"  pinCircle.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:5';\n" +
"  var pcSize=Math.min(18,2000/zm), pcBorder=Math.min(3,300/zm), pcShadow=Math.min(12,1000/zm);\n" +
"  pinCircle.innerHTML='<div style=\"width:'+pcSize+'px;height:'+pcSize+'px;border:'+pcBorder+'px solid #ff3333;border-radius:50%;background:rgba(255,50,50,.15);box-shadow:0 0 '+pcShadow+'px rgba(255,50,50,.5)\"></div>';\n" +
"  pin.appendChild(pinCircle);\n" +
"  // Container icon (if available)\n" +
"  var pinIcon=null;\n" +
"  if(ic){\n" +
"    pinIcon=document.createElement('img');\n" +
"    pinIcon.src=ic;\n" +
"    var piSize=Math.min(48,5000/zm), piBorder=Math.min(2,200/zm);\n" +
"    pinIcon.style.cssText='display:block;margin-left:auto;margin-right:auto;width:'+piSize+'px;height:'+piSize+'px;border-radius:'+Math.min(8,800/zm)+'px;object-fit:cover;border:'+piBorder+'px solid #ffc832;box-shadow:0 0 '+Math.min(10,800/zm)+'px rgba(255,200,50,.5)';\n" +
"    pin.appendChild(pinIcon);\n" +
"  }\n" +
"  // Update pin sizes on zoom\n" +
"  function updatePinSize(){\n" +
"    var pcS=Math.min(18,2000/zm), pcB=Math.min(3,300/zm), pcSh=Math.min(12,1000/zm);\n" +
"    pinCircle.innerHTML='<div style=\"width:'+pcS+'px;height:'+pcS+'px;border:'+pcB+'px solid #ff3333;border-radius:50%;background:rgba(255,50,50,.15);box-shadow:0 0 '+pcSh+'px rgba(255,50,50,.5)\"></div>';\n" +
"    if(pinIcon){\n" +
"      var piS=Math.min(48,5000/zm), piB=Math.min(2,200/zm);\n" +
"      pinIcon.style.width=piS+'px'; pinIcon.style.height=piS+'px';\n" +
"      pinIcon.style.marginTop=-(piS+8)+'px';\n" +
"      pinIcon.style.borderWidth=piB+'px';\n" +
"    }\n" +
"    var fs=Math.min(14,1500/zm);\n" +
"    label.style.fontSize=fs+'px';\n" +
"  }\n" +
"  updatePinSize();\n";

c = c.replace(oldPinSection, newPinSection);

// 6. reposition() 结尾加 updatePinSize
c = c.replace(
  "inner.style.transform='translate('+dx+'px,'+dy+'px) scale('+zm+')';\n  }\n\n  // Wheel zoom",
  "inner.style.transform='translate('+dx+'px,'+dy+'px) scale('+zm+')';\n    updatePinSize();\n  }\n\n  // Wheel zoom"
);

// 7. wheel 事件里 zm= 后面加 updatePinSize
c = c.replace(
  "zm=newZm;\n    inner.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+zm+')';\n  });",
  "zm=newZm;\n    inner.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+zm+')';\n    updatePinSize();\n  });"
);

// 8. zoomInBtn 的 zm=后面加 updatePinSize
c = c.replace(
  "zm=newZm;\n    inner.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+zm+')';\n  };\n  zoomBar.appendChild(zoomInBtn);",
  "zm=newZm;\n    inner.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+zm+')';\n    updatePinSize();\n  };\n  zoomBar.appendChild(zoomInBtn);"
);

// 9. zoomOutBtn 的 zm=后面加 updatePinSize
c = c.replace(
  "zm=newZm;\n    inner.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+zm+')';\n  };\n  zoomBar.appendChild(zoomOutBtn);",
  "zm=newZm;\n    inner.style.transform='translate('+offsetX+'px,'+offsetY+'px) scale('+zm+')';\n    updatePinSize();\n  };\n  zoomBar.appendChild(zoomOutBtn);"
);

fs.writeFileSync('F:/暗区突围网站/pages/review.html', c, 'utf-8');
console.log('done');
