var fs=require('fs');
// 模块6: 图层筛选 (renderLayers / toggleAllLayers / toggleLayer / dispatchLayerCheck)
// 关键：全部用 createElement 构建面板，不用 innerHTML 拼接

var code = [
  "function dispatchLayerCheck(){var hiddenTypes={};var hiddenNames={};var lp=document.getElementById('lp');if(!lp)return;lp.querySelectorAll('input[data-layer]').forEach(function(cb){if(!cb.checked){var t=cb.getAttribute('data-layer');if(!hiddenTypes[t])hiddenTypes[t]=true;}});lp.querySelectorAll('input[data-name]').forEach(function(cb){if(!cb.checked){hiddenNames[cb.getAttribute('data-name')]=true;}});var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){var idx=parseInt(el.getAttribute('data-pin-idx'));if(isNaN(idx)||!pins[idx])return;var p=pins[idx];var hide=false;if(hiddenNames[p.name]){hide=true;}if(!hide){for(var ht in hiddenTypes){if(layerData[ht]&&layerData[ht].indexOf(p.name)>=0){hide=true;break;}}}el.style.display=hide?'none':'';});}",

  // renderLayers: pure createElement approach
  "function renderLayers(){",
  "  var lp=document.getElementById('lp');if(!lp)return;",
  "  lp.innerHTML='';",
  "  var allLabel=document.createElement('label');",
  "  allLabel.style.cssText='display:block;padding:8px;border-bottom:1px solid #222;font-size:14px;color:#ffc832;font-weight:600';",
  "  var allCb=document.createElement('input');allCb.type='checkbox';allCb.checked=true;",
  "  allCb.style.marginRight='8px';",
  "  allCb.onchange=function(){toggleAllLayers(this.checked);};",
  "  allLabel.appendChild(allCb);",
  "  allLabel.appendChild(document.createTextNode(' All'));",
  "  lp.appendChild(allLabel);",
  "  orders.forEach(function(k){",
  "    var items=layerData[k];if(!items||items.length===0)return;",
  "    var card=document.createElement('div');",
  "    card.style.cssText='margin:6px 8px;border-bottom:1px solid #1a1a24;padding-bottom:6px';",
  "    var hdr=document.createElement('div');",
  "    hdr.style.cssText='font-size:18px;color:#888;margin-bottom:8px;font-weight:600';",
  "    var hdrCb=document.createElement('input');hdrCb.type='checkbox';hdrCb.checked=true;",
  "    hdrCb.style.marginRight='6px';",
  "    hdrCb.onchange=function(ln){return function(c){toggleLayer(ln,c);};}(k);",
  "    hdr.appendChild(hdrCb);",
  "    hdr.appendChild(document.createTextNode(' '+k));",
  "    card.appendChild(hdr);",
  "    var grid=document.createElement('div');",
  "    grid.style.cssText='display:grid;grid-template-columns:1fr;gap:8px';",
  "    items.forEach(function(item){",
  "      var lbl=document.createElement('label');",
  "      lbl.style.cssText='display:flex;align-items:center;gap:12px;font-size:16px;color:#aaa;cursor:pointer;padding:8px 12px;border-radius:8px';",
  "      var cb=document.createElement('input');cb.type='checkbox';cb.checked=true;",
  "      cb.setAttribute('data-name',item);",
  "      cb.onchange=function(){dispatchLayerCheck();};",
  "      lbl.appendChild(cb);",
  "      var ic=getIconUrl(item);",
  "      if(ic){",
  "        var img=document.createElement('img');img.src=ic;",
  "        img.style.cssText='width:72px;height:72px;border-radius:8px;object-fit:cover;display:inline';",
  "        img.onerror=function(){this.style.display='none';};",
  "        lbl.appendChild(img);",
  "      }else{",
  "        var ph=document.createElement('span');",
  "        ph.style.cssText='display:inline-block;width:72px;height:72px;border-radius:8px;background:#333;text-align:center;line-height:72px;color:#888;font-size:24px';",
  "        ph.textContent='?';",
  "        lbl.appendChild(ph);",
  "      }",
  "      lbl.appendChild(document.createTextNode(item));",
  "      grid.appendChild(lbl);",
  "    });",
  "    card.appendChild(grid);",
  "    lp.appendChild(card);",
  "  });",
  "  var closeBtn=document.createElement('button');",
  "  closeBtn.textContent='Close';",
  "  closeBtn.style.cssText='margin-top:8px;padding:6px 12px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:6px;color:#888;cursor:pointer;font-size:13px;width:100%';",
  "  closeBtn.onclick=function(){lp.classList.remove('show');};",
  "  lp.appendChild(closeBtn);",
  "}",

  "function toggleAllLayers(c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=c;});dispatchLayerCheck();}",
  "function toggleLayer(n,c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[data-name]').forEach(function(cb){var t=cb.getAttribute('data-name');if(layerData[n]&&layerData[n].indexOf(t)>=0)cb.checked=c;});dispatchLayerCheck();}"
];

var full=code.join('\n');
var op=(full.match(/\(/g)||[]).length;
var cp=(full.match(/\)/g)||[]).length;
var ob=(full.match(/\{/g)||[]).length;
var cb=(full.match(/\}/g)||[]).length;
console.log('module6: ('+op+'='+cp+') {'+ob+'='+cb+'} '+(op===cp&&ob===cb?'OK':'FAIL'));
if(op!==cp||ob!==cb){console.log('FAIL - abort');process.exit(1);}

var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  c=c.replace('</script>', full+'\n</script>');
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('module6 DONE');
