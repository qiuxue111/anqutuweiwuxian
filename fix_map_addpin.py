import re

with open('F:\\暗区突围网站\\pages\\map-farm.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Replace addPin function with the version that has process feedback
old_addpin = '''function addPin(tid){
  if(!currentUser){login();return;}
  if(!pp)return;
  var sdata={x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[],admin_passed:false,votes:0,voters:[]};
supabase("pending_pins","POST",sdata).then(function(){
    var el=document.getElementById("ab");
    if(el)el.innerHTML="<span style='color:#9e9;font-size:14px;margin-left:10px'>投稿成功，等待审核<"+LS+">";
    setTimeout(function(){if(el)el.innerHTML="";},3000);
  })["catch"](function(){
    var el=document.getElementById("ab");
    if(el)el.innerHTML="<span style='color:#e99;font-size:14px;margin-left:10px'>投稿失败，请重试<"+LS+">";
    setTimeout(function(){if(el)el.innerHTML="";},3000);
  });
  pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});
  savePins();renderMarkers();
  pp=null;document.getElementById("cv").textContent="未选择";document.getElementById("ab").style.display="none";closePicker();
}'''

new_addpin = '''function addPin(tid){
  if(!currentUser){login();return;}
  if(!pp)return;
  var sdata={x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[],admin_passed:false,votes:0,voters:[]};
  // Show "submitting" state
  var el=document.getElementById("ab");
  if(el){el.innerHTML="<span style='color:#ffc832;font-size:14px'>\\u23f3 \\u63d0\\u4ea4\\u4e2d...</span>";el.disabled=true;}
supabase("pending_pins","POST",sdata).then(function(){
    var el=document.getElementById("ab");
    if(el){el.innerHTML="<span style='color:#9e9;font-size:14px'>\\u2705 \\u6295\\u7a3f\\u6210\\u529f\\uff0c\\u7b49\\u5f85\\u5ba1\\u6838</span>";el.disabled=false;}
    setTimeout(function(){if(el){el.innerHTML="\\u9009\\u62e9\\u5bb9\\u5668\\u7c7b\\u578b \\u2192";el.style.display="";}},4000);
  pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});
  savePins();renderMarkers();
  pp=null;document.getElementById("cv").textContent="\\u672a\\u9009\\u62e9";closePicker();
  })["catch"](function(){
    var el=document.getElementById("ab");
    if(el){el.innerHTML="<span style='color:#e99;font-size:14px'>\\u274c \\u6295\\u7a3f\\u5931\\u8d25\\uff0c\\u8bf7\\u91cd\\u8bd5</span>";el.disabled=false;}
    setTimeout(function(){if(el){el.innerHTML="\\u9009\\u62e9\\u5bb9\\u5668\\u7c7b\\u578b \\u2192";}},4000);
  });
}'''

# Replace only first occurrence of old_addpin
c = c.replace(old_addpin, new_addpin, 1)

# 2. Fix the "删除申请" alert text (第563行附近)
old_del_alert = '''alert("\\u5220\\u9664\\u7533\\u8bf7\\u5df2\\u63d0\\u4ea4\\uff0c\\u7b49\\u5f85\\u6295\\u7968\\u3002");'''
new_del_alert = '''alert("\\u5220\\u9664\\u7533\\u8bf7\\u5df2\\u63d0\\u4ea4\\uff0c\\u7b49\\u5f85\\u5ba1\\u6838");'''

# 3. Verify no balance issues by checking braces and parens
opens = c.count('{') + c.count('(')
closes = c.count('}') + c.count(')')
print(f"Before write: open_brackets:{c.count('{')} close_brackets:{c.count('}')} open_parens:{c.count('(')} close_parens:{c.count(')')}")

# Extract script and check
m = re.search(r'<script>([\s\S]*?)</script>', c)
if m:
    s = m.group(1)
    print(f"JS open_brackets:{s.count('{')} close_brackets:{s.count('}')}")
    print(f"JS open_parens:{s.count('(')} close_parens:{s.count(')')}")
    closes_js = re.findall(r'<\x2F[a-z]', s)
    print(f"closing_tags in JS: {len(closes_js)}")
    try:
        compile(s, '<string>', 'exec')
        print("JS: Syntax OK")
    except Exception as e:
        print(f"JS: Syntax ERROR: {e}")

with open('F:\\暗区突围网站\\pages\\map-farm.html', 'w', encoding='utf-8') as f:
    f.write(c)
print("Written.")
