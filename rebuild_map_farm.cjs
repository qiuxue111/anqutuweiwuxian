const fs = require('fs');
const fp = 'F:\\暗区突围网站\\pages\\map-farm.html';
let c = fs.readFileSync(fp, 'utf8');

// 1. Add favicon
c = c.replace('<head>', '<head>\n  <link rel="icon" href="../favicon.ico" type="image/jpeg">');

// 2. Default layerSt to true
c = c.replace(
  'var layerSt={};ALL_ITEMS.forEach(function(t){layerSt[t.id]=false;});',
  'var layerSt={};ALL_ITEMS.forEach(function(t){layerSt[t.id]=true;});'
);

// 3. addPinImages async fix
c = c.replace(
  'function addPinImages(files){\n  if(curPinIdx===null||!files.length)return;\n  for(var i=0;i<files.length;i++){\n    (function(file){\n      var reader=new FileReader();\n      reader.onload=function(e){\n        pins[curPinIdx].images.push(e.target.result);\n        if(i===files.length-1){savePins();renderPinImages();}\n      };\n      reader.readAsDataURL(file);\n    })(files[i]);\n  }\n}',
  'function addPinImages(files){\n  if(curPinIdx===null||!files.length)return;\n  var done=0,total=files.length;\n  for(var i=0;i<files.length;i++){\n    (function(file){\n      var reader=new FileReader();\n      reader.onload=function(e){\n        pins[curPinIdx].images.push(e.target.result);\n        done++;\n        if(done===total){savePins();renderPinImages();}\n      };\n      reader.readAsDataURL(file);\n    })(files[i]);\n  }\n}'
);

// 4. Remove pin_type/pin_x/pin_y from map_comments POST
c = c.replace(
  'supabase("map_comments","POST",{pin_type:"map",pin_x:0,pin_y:0,text:text,time:tz});',
  'supabase("map_comments","POST",{text:text,time:tz});'
);
c = c.replace(
  'supabase("map_comments","POST",{pin_type:p.type,pin_x:p.x,pin_y:p.y,text:text,time:tz});',
  'supabase("map_comments","POST",{text:text,time:tz});'
);

// 5. postMapComment with user_name
c = c.replace(
  'function postMapComment(){\n  var input=document.getElementById("mcInput");\n  var text=input.value.trim();\n  if(!text)return;\n  var now=new Date();\n  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});\n  supabase("map_comments","POST",{text:text,time:tz});\n  mapComments.push({text:text,time:tz});\n  savePins();renderMapComments();\n  input.value="";\n}',
  'function postMapComment(){\n  var input=document.getElementById("mcInput");\n  var text=input.value.trim();\n  if(!text)return;\n  var now=new Date();\n  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});\n  var userName=currentUser&&currentUser.user_metadata&&(currentUser.user_metadata.user_name||currentUser.user_metadata.preferred_username||currentUser.user_metadata.name)||"匿名";\n  supabase("map_comments","POST",{text:text,time:tz,user_name:userName});\n  mapComments.push({text:text,time:tz,user_name:userName});\n  savePins();renderMapComments();\n  input.value="";\n}'
);

// 6. renderMapComments with user_name
c = c.replace(
  'function renderMapComments(){\n  var list=document.getElementById("mcList");list.innerHTML="";\n  mapComments.forEach(function(c){\n    var item=document.createElement("div");item.className="mc-item";\n    var time=document.createElement("span");time.className="mc-time";time.textContent=c.time;\n    var text=document.createElement("span");text.textContent=c.text;\n    item.appendChild(text);item.appendChild(time);list.appendChild(item);\n  });\n}',
  'function renderMapComments(){\n  var list=document.getElementById("mcList");list.innerHTML="";\n  mapComments.forEach(function(c){\n    var item=document.createElement("div");item.className="mc-item";\n    var time=document.createElement("span");time.className="mc-time";time.textContent=c.time;\n    var user=c.user_name?"<strong style=\'color:#ffc832\'>"+c.user_name+"<\\/strong> ":"";\n    item.innerHTML=user+c.text;\n    item.appendChild(time);list.appendChild(item);\n  });\n}'
);

// 7. postPinComment with user_name
c = c.replace(
  'function postPinComment(){\n  if(curPinIdx===null)return;\n  var input=document.getElementById("pdcInput");\n  var text=input.value.trim();\n  if(!text)return;\n  var now=new Date();\n  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});\n  var p=pins[curPinIdx];\n  if(p.id){\n    supabase("map_comments","POST",{text:text,time:tz});\n  }\n  p.comments.push({text:text,time:tz});\n  savePins();renderPinComments();\n  input.value="";\n}',
  'function postPinComment(){\n  if(curPinIdx===null)return;\n  var input=document.getElementById("pdcInput");\n  var text=input.value.trim();\n  if(!text)return;\n  var now=new Date();\n  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});\n  var userName=currentUser&&currentUser.user_metadata&&(currentUser.user_metadata.user_name||currentUser.user_metadata.preferred_username||currentUser.user_metadata.name)||"匿名";\n  var p=pins[curPinIdx];\n  if(p.id){\n    supabase("map_comments","POST",{text:text,time:tz,user_name:userName});\n  }\n  p.comments.push({text:text,time:tz,user_name:userName});\n  savePins();renderPinComments();\n  input.value="";\n}'
);

// 8. renderPinComments with user_name
c = c.replace(
  'function renderPinComments(){\n  var list=document.getElementById("pdcList");list.innerHTML="";\n  if(curPinIdx===null)return;\n  var comments=pins[curPinIdx].comments||[];\n  comments.forEach(function(c){\n    var item=document.createElement("div");item.className="pdc-item";\n    var time=document.createElement("span");time.className="pdc-time";time.textContent=c.time;\n    var text=document.createElement("span");text.textContent=c.text;\n    item.appendChild(text);item.appendChild(time);list.appendChild(item);\n  });\n}',
  'function renderPinComments(){\n  var list=document.getElementById("pdcList");list.innerHTML="";\n  if(curPinIdx===null)return;\n  var comments=pins[curPinIdx].comments||[];\n  comments.forEach(function(c){\n    var item=document.createElement("div");item.className="pdc-item";\n    var time=document.createElement("span");time.className="pdc-time";time.textContent=c.time;\n    var user=c.user_name?"<strong style=\'color:#ffc832\'>"+c.user_name+"<\\/strong> ":"";\n    item.innerHTML=user+c.text;\n    item.appendChild(time);list.appendChild(item);\n  });\n}'
);

// 9. Fix supabase auth header to use logged-in token
c = c.replace(
  'var o={method:m||"GET",headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+SUPABASE_ANON_KEY,"Content-Type":"application/json","Prefer":"return=representation"}};',
  'var o={method:m||"GET",headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+token,"Content-Type":"application/json","Prefer":"return=representation"}};'
);

// 10. Replace addPin with toast version
c = c.replace(
  'supabase("pending_pins","POST",sdata).then(function(){\n    var el=document.getElementById("ab");\n    if(el)el.innerHTML="<span style=\'color:#9e9;font-size:14px;margin-left:10px\'>投稿成功，等待审核<"+LS+">";\n    setTimeout(function(){if(el)el.innerHTML="";},3000);\n  pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});\n  savePins();renderMarkers();\n  pp=null;document.getElementById("cv").textContent="未选择";document.getElementById("ab").style.display="none";closePicker();\n  })["catch"](function(){\n    var el=document.getElementById("ab");\n    if(el)el.innerHTML="<span style=\'color:#e99;font-size:14px;margin-left:10px\'>投稿失败，请重试<"+LS+">";\n    setTimeout(function(){if(el)el.innerHTML="";},3000);\n  });',
  'supabase("pending_pins","POST",sdata).then(function(){\n    pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});\n    savePins();renderMarkers();\n    pp=null;document.getElementById("cv").textContent="未选择";closePicker();\n    // Show success toast card\n    var toast=document.createElement("div");\n    toast.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.96);border:1px solid #1e1e2a;border-radius:16px;padding:32px 48px;text-align:center;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,.6)";\n    toast.innerHTML="<div style=\'font-size:48px;margin-bottom:12px\'>\\u2705<\\"+"/div><div style=\'color:#9e9;font-size:18px;font-weight:600;margin-bottom:6px\'>\\u6295\\u7a3f\\u6210\\u529f<\\"+"/div><div style=\'color:#999;font-size:14px;margin-bottom:16px\'>\\u8bf7\\u7b49\\u5f85\\u7ba1\\u7406\\u5458\\u5ba1\\u6838<\\"+"/div><button onclick=\'this.parentElement.remove()\' style=\'padding:8px 28px;background:#ffc832;color:#0a0a0f;border:none;border-radius:8px;font-size:15px;cursor:pointer;font-weight:600\'>\\u77e5\\u9053\\u4e86<\\"+"/button>";\n    document.body.appendChild(toast);\n    // Auto-remove after 5s\n    setTimeout(function(){if(toast.parentElement)toast.remove();},5000);\n  })["catch"](function(){\n    var el=document.getElementById("ab");\n    if(el){el.innerHTML="<span style=\'color:#e99;font-size:14px\'>\\u274c \\u6295\\u7a3f\\u5931\\u8d25\\uff0c\\u8bf7\\u91cd\\u8bd5<"+LS+">";el.disabled=false;}\n    setTimeout(function(){if(el){el.innerHTML="\\u9009\\u62e9\\u5bb9\\u5668\\u7c7b\\u578b \\u2192";}},4000);\n  });'
);

fs.writeFileSync(fp, c);

// Verify
const s = c.match(/<script>([\s\S]*?)<\/script>/)[1];
console.log(`{ ${s.match(/\{/g).length}, }: ${s.match(/\}/g).length}`);
try { new Function(s); console.log('Syntax OK'); } catch(e) { console.log('ERROR:', e.message); }
const closes = s.match(/<\x2F[a-z]/g);
console.log('closing tags in strings:', closes ? closes.length : 0);
if (closes) closes.forEach(t => console.log('  ', t));
