import re

fp = 'F:\\暗区突围网站\\pages\\map-farm.html'
with open(fp, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add favicon
c = c.replace('<head>', '<head>\n  <link rel="icon" href="../favicon.ico" type="image/jpeg">')

# 2. Default layerSt to true
c = c.replace(
    'var layerSt={};ALL_ITEMS.forEach(function(t){layerSt[t.id]=false;});',
    'var layerSt={};ALL_ITEMS.forEach(function(t){layerSt[t.id]=true;});'
)

# 3. addPinImages async fix (i closure -> done counter)
c = c.replace(
    'function addPinImages(files){\n  if(curPinIdx===null||!files.length)return;\n  for(var i=0;i<files.length;i++){\n    (function(file){\n      var reader=new FileReader();\n      reader.onload=function(e){\n        pins[curPinIdx].images.push(e.target.result);\n        if(i===files.length-1){savePins();renderPinImages();}\n      };\n      reader.readAsDataURL(file);\n    })(files[i]);\n  }\n}',
    'function addPinImages(files){\n  if(curPinIdx===null||!files.length)return;\n  var done=0,total=files.length;\n  for(var i=0;i<files.length;i++){\n    (function(file){\n      var reader=new FileReader();\n      reader.onload=function(e){\n        pins[curPinIdx].images.push(e.target.result);\n        done++;\n        if(done===total){savePins();renderPinImages();}\n      };\n      reader.readAsDataURL(file);\n    })(files[i]);\n  }\n}'
)

# 4. Remove pin_type/pin_x/pin_y from supabase map_comments POST
c = c.replace(
    'supabase("map_comments","POST",{pin_type:"map",pin_x:0,pin_y:0,text:text,time:tz});',
    'supabase("map_comments","POST",{text:text,time:tz});'
)
c = c.replace(
    'supabase("map_comments","POST",{pin_type:p.type,pin_x:p.x,pin_y:p.y,text:text,time:tz});',
    'supabase("map_comments","POST",{text:text,time:tz});'
)

# 5. postMapComment with user_name
c = c.replace(
    'var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});\n  supabase("map_comments","POST",{text:text,time:tz});\n  mapComments.push({text:text,time:tz});',
    'var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});\n  var userName=currentUser&&currentUser.user_metadata&&(currentUser.user_metadata.user_name||currentUser.user_metadata.preferred_username||currentUser.user_metadata.name)||"匿名";\n  supabase("map_comments","POST",{text:text,time:tz,user_name:userName});\n  mapComments.push({text:text,time:tz,user_name:userName});'
)

# 6. renderMapComments with user_name
old_rmc = '''function renderMapComments(){
  var list=document.getElementById("mcList");list.innerHTML="";
  mapComments.forEach(function(c){
    var item=document.createElement("div");item.className="mc-item";
    var time=document.createElement("span");time.className="mc-time";time.textContent=c.time;
    var text=document.createElement("span");text.textContent=c.text;
    item.appendChild(text);item.appendChild(time);list.appendChild(item);
  });
}'''
new_rmc = '''function renderMapComments(){
  var list=document.getElementById("mcList");list.innerHTML="";
  mapComments.forEach(function(c){
    var item=document.createElement("div");item.className="mc-item";
    var time=document.createElement("span");time.className="mc-time";time.textContent=c.time;
    var user=c.user_name?"<strong style='color:#ffc832'>"+c.user_name+"<\\/strong> ":"";
    item.innerHTML=user+c.text;
    item.appendChild(time);list.appendChild(item);
  });
}'''
c = c.replace(old_rmc, new_rmc)

# 7. postPinComment with user_name
old_ppc = '''function postPinComment(){
  if(curPinIdx===null)return;
  var input=document.getElementById("pdcInput");
  var text=input.value.trim();
  if(!text)return;
  var now=new Date();
  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});
  var p=pins[curPinIdx];
  if(p.id){
    supabase("map_comments","POST",{text:text,time:tz});
  }
  p.comments.push({text:text,time:tz});
  savePins();renderPinComments();
  input.value="";
}'''
new_ppc = '''function postPinComment(){
  if(curPinIdx===null)return;
  var input=document.getElementById("pdcInput");
  var text=input.value.trim();
  if(!text)return;
  var now=new Date();
  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});
  var userName=currentUser&&currentUser.user_metadata&&(currentUser.user_metadata.user_name||currentUser.user_metadata.preferred_username||currentUser.user_metadata.name)||"\\u533f\\u540d";
  var p=pins[curPinIdx];
  if(p.id){
    supabase("map_comments","POST",{text:text,time:tz,user_name:userName});
  }
  p.comments.push({text:text,time:tz,user_name:userName});
  savePins();renderPinComments();
  input.value="";
}'''
c = c.replace(old_ppc, new_ppc)

# 8. renderPinComments with user_name
old_rpc = '''function renderPinComments(){
  var list=document.getElementById("pdcList");list.innerHTML="";
  if(curPinIdx===null)return;
  var comments=pins[curPinIdx].comments||[];
  comments.forEach(function(c){
    var item=document.createElement("div");item.className="pdc-item";
    var time=document.createElement("span");time.className="pdc-time";time.textContent=c.time;
    var text=document.createElement("span");text.textContent=c.text;
    item.appendChild(text);item.appendChild(time);list.appendChild(item);
  });
}'''
new_rpc = '''function renderPinComments(){
  var list=document.getElementById("pdcList");list.innerHTML="";
  if(curPinIdx===null)return;
  var comments=pins[curPinIdx].comments||[];
  comments.forEach(function(c){
    var item=document.createElement("div");item.className="pdc-item";
    var time=document.createElement("span");time.className="pdc-time";time.textContent=c.time;
    var user=c.user_name?"<strong style='color:#ffc832'>"+c.user_name+"<\\/strong> ":"";
    item.innerHTML=user+c.text;
    item.appendChild(time);list.appendChild(item);
  });
}'''
c = c.replace(old_rpc, new_rpc)

# 9. Fix supabase auth header to use token
c = c.replace(
    '"Authorization":"Bearer "+SUPABASE_ANON_KEY,',
    '"Authorization":"Bearer "+token,'
)

# 10. Replace addPin success handler with toast
old_addpin_success = '''supabase("pending_pins","POST",sdata).then(function(){
    var el=document.getElementById("ab");
    if(el)el.innerHTML="<span style='color:#9e9;font-size:14px;margin-left:10px'>\\u6295\\u7a3f\\u6210\\u529f\\uff0c\\u7b49\\u5f85\\u5ba1\\u6838<"+LS+">";
    setTimeout(function(){if(el)el.innerHTML="";},3000);
  pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});
  savePins();renderMarkers();
  pp=null;document.getElementById("cv").textContent="\\u672a\\u9009\\u62e9";document.getElementById("ab").style.display="none";closePicker();
  })["catch"](function(){
    var el=document.getElementById("ab");
    if(el)el.innerHTML="<span style='color:#e99;font-size:14px;margin-left:10px'>\\u6295\\u7a3f\\u5931\\u8d25\\uff0c\\u8bf7\\u91cd\\u8bd5<"+LS+">";
    setTimeout(function(){if(el)el.innerHTML="";},3000);
  });'''

new_addpin = '''supabase("pending_pins","POST",sdata).then(function(){
    pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});
    savePins();renderMarkers();
    pp=null;document.getElementById("cv").textContent="\\u672a\\u9009\\u62e9";closePicker();
    // Show success toast card
    var toast=document.createElement("div");
    toast.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.96);border:1px solid #1e1e2a;border-radius:16px;padding:32px 48px;text-align:center;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,.6)";
    toast.innerHTML="<div style='font-size:48px;margin-bottom:12px'>\\u2705<\\"+"/div><div style='color:#9e9;font-size:18px;font-weight:600;margin-bottom:6px'>\\u6295\\u7a3f\\u6210\\u529f<\\"+"/div><div style='color:#999;font-size:14px;margin-bottom:16px'>\\u8bf7\\u7b49\\u5f85\\u7ba1\\u7406\\u5458\\u5ba1\\u6838<\\"+"/div><button onclick='this.parentElement.remove()' style='padding:8px 28px;background:#ffc832;color:#0a0a0f;border:none;border-radius:8px;font-size:15px;cursor:pointer;font-weight:600'>\\u77e5\\u9053\\u4e86<\\"+"/button>";
    document.body.appendChild(toast);
    // Auto-remove after 5s
    setTimeout(function(){if(toast.parentElement)toast.remove();},5000);
  })["catch"](function(){
    var el=document.getElementById("ab");
    if(el){el.innerHTML="<span style='color:#e99;font-size:14px'>\\u274c \\u6295\\u7a3f\\u5931\\u8d25\\uff0c\\u8bf7\\u91cd\\u8bd5<"+LS+">";el.disabled=false;}
    setTimeout(function(){if(el){el.innerHTML="\\u9009\\u62e9\\u5bb9\\u5668\\u7c7b\\u578b \\u2192";}},4000);
  });'''
c = c.replace(old_addpin_success, new_addpin)

# Verify script syntax
m = re.search(r'<script>([\s\S]*?)</script>', c)
if m:
    s = m.group(1)
    print(f"Script braces: open={s.count('{')} close={s.count('}')}")
    print(f"Script parens: open={s.count('(')} close={s.count(')')}")
    try:
        compile(s, '<string>', 'exec')
        print("Syntax OK")
    except Exception as e:
        print(f"Syntax ERROR: {e}")
    closes = len(re.findall(r'<\x2F[a-z]', s))
    print(f"closing tags in strings: {closes}")
else:
    print("ERROR: no <script> found!")

with open(fp, 'w', encoding='utf-8') as f:
    f.write(c)
print("Written OK")
