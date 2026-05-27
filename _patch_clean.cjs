var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_clean.cjs','utf8');

// 1. zoom range 0.1~10
c=c.replace(/if\(scaleM<0\.2\)scaleM=0\.2;if\(scaleM>8\)scaleM=8/g,'if(scaleM<0.1)scaleM=0.1;if(scaleM>10)scaleM=10');
c=c.replace(/if\(v<0\.2\)v=0\.2;if\(v>8\)v=8/g,'if(v<0.1)v=0.1;if(v>10)v=10');
c=c.replace(/min="20"/g,'min="10"');
c=c.replace(/max="800"/g,'max="1000"');

// 2. icon formula
c=c.replace('var s=Math.max(12,24/scaleM);','var s=Math.min(100,60/Math.pow(scaleM,1.176));');
c=c.replace('var ds=Math.max(8,12/scaleM)','var ds=Math.min(60,36/Math.pow(scaleM,1.176))');
c=c.replace('Math.max(3,6/scaleM)','Math.min(10,4/Math.pow(scaleM,1.176))');
c=c.replace('Math.max(1,2/scaleM)','Math.min(3,2/Math.pow(scaleM,1.176))');
c=c.replace('Math.max(4,8/scaleM)','Math.min(12,5/Math.pow(scaleM,1.176))');
c=c.replace('Math.max(3,6/scaleM)','Math.min(10,4/Math.pow(scaleM,1.176))');

// 3. add data-pin-idx
c=c.replace("el.className='pin-marker';","el.className='pin-marker';el.setAttribute('data-pin-idx',i);");

// 4. add layer functions after orders line
c=c.replace(
  "var orders=['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件'];",
  "var orders=['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件'];\n  // layer functions\n  function dispatchLayerCheck(){var hiddenTypes={};var hiddenNames={};var lp=document.getElementById('lp');if(!lp)return;lp.querySelectorAll('input[data-layer]').forEach(function(cb){if(!cb.checked){var t=cb.getAttribute('data-layer');if(!hiddenTypes[t])hiddenTypes[t]=true;}});lp.querySelectorAll('input[data-name]').forEach(function(cb){if(!cb.checked){hiddenNames[cb.getAttribute('data-name')]=true;}};var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){var idx=parseInt(el.getAttribute('data-pin-idx'));if(isNaN(idx)||!pins[idx])return;var p=pins[idx];var hide=false;if(hiddenNames[p.name]){hide=true;}if(!hide){for(var ht in hiddenTypes){if(layerData[ht]&&layerData[ht].indexOf(p.name)>=0){hide=true;break;}}}el.style.display=hide?'none':'';});}\n  function renderLayers(){var lp=document.getElementById('lp');if(!lp)return;var html='<label class=\"all-label\" style=\"display:block;padding:8px;border-bottom:1px solid #222;font-size:14px;color:#ffc832;font-weight:600\"><input type=\"checkbox\" checked onchange=\"toggleAllLayers(this.checked)\" style=\"margin-right:8px\"> 全部显示</label>';orders.forEach(function(k){var items=layerData[k];if(!items||items.length===0)return;html+='<div class=\"ly-card\" style=\"margin:6px 8px;border-bottom:1px solid #1a1a24;padding-bottom:6px\">';html+='<div class=\"ly-card-hdr\" style=\"font-size:12px;color:#888;margin-bottom:4px;font-weight:600\"><input type=\"checkbox\" checked onchange=\"toggleLayer(\\''+k+'\\',this.checked)\" style=\"margin-right:6px\"> '+k+'</div>';html+='<div style=\"display:grid;grid-template-columns:repeat(2,1fr);gap:4px\">';items.forEach(function(item){var ic=getIconUrl(item);if(ic){html+='<label style=\"display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;cursor:pointer;padding:2px 4px;border-radius:4px\" onmouseover=\"this.style.background=\\'rgba(255,255,255,.05)\\'\" onmouseout=\"this.style.background=\\'transparent\\'\"><input type=\"checkbox\" checked data-name=\"'+item+'\" style=\"margin:0\" onchange=\"dispatchLayerCheck()\"><img src=\"'+ic+'\" style=\"width:18px;height:18px;border-radius:3px;object-fit:cover;display:inline\" onerror=\"this.style.display=\\'none\\'\">'+item+'</label>';}else{html+='<label style=\"display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;cursor:pointer;padding:2px 4px;border-radius:4px\" onmouseover=\"this.style.background=\\'rgba(255,255,255,.05)\\'\" onmouseout=\"this.style.background=\\'transparent\\'\"><input type=\"checkbox\" checked data-name=\"'+item+'\" style=\"margin:0\" onchange=\"dispatchLayerCheck()\"><span style=\"display:inline-block;width:18px;height:18px;border-radius:3px;background:#333;text-align:center;line-height:18px;color:#888;font-size:10px\">?</span>'+item+'</label>';}});html+='</div></div>';});var cb=document.createElement('button');cb.textContent='Close';cb.style.cssText='margin-top:8px;padding:6px 12px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:6px;color:#888;cursor:pointer;font-size:13px;width:100%';cb.onclick=function(){lp.classList.remove('show');};lp.appendChild(cb);lp.innerHTML=html;}\n  function toggleAllLayers(c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=c;});dispatchLayerCheck();}\n  function toggleLayer(n,c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[data-layer=\"'+n+'\"]').forEach(function(cb){cb.checked=c;});dispatchLayerCheck();}"
);

// 5. lbb binding in init
c=c.replace("var sb=document.getElementById('sb');if(sb)sb.onclick=function(){",
  "var lb=document.getElementById('lbb');if(lb){lb.onclick=function(e){var lp2=document.getElementById('lp');if(lp2){e.stopPropagation();lp2.classList.toggle('show');if(lp2.classList.contains('show')){renderLayers();}}}document.addEventListener('click',function(ev){var lp3=document.getElementById('lp');if(lp3&&!lp3.contains(ev.target)&&ev.target!==document.getElementById('lbb'))lp3.classList.remove('show');});}var sb=document.getElementById('sb');if(sb)sb.onclick=function(){"
);

fs.writeFileSync('F:\\暗区突围网站\\rebuild_clean.cjs',c);
console.log('DONE');
