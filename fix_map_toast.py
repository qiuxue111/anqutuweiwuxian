import re

with open('F:\\暗区突围网站\\pages\\map-farm.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Find addPin function by marker
idx = c.index('function addPin(tid){')
end_idx = c.index('function savePins', idx)
old = c[idx:end_idx]

new = '''function addPin(tid){
  if(!currentUser){login();return;}
  if(!pp)return;
  var sdata={x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[],admin_passed:false,votes:0,voters:[]};
  // Show "submitting" state
  var el=document.getElementById("ab");
  if(el){el.innerHTML="<span style='color:#ffc832;font-size:14px'>\\u23f3 \\u63d0\\u4ea4\\u4e2d...</span>";el.disabled=true;}
supabase("pending_pins","POST",sdata).then(function(){
    pins.push({x:pp.x,y:pp.y,name:TYPE[tid].name,type:tid,ic:TYPE[tid].ic,note:"",images:[],comments:[]});
    savePins();renderMarkers();
    pp=null;document.getElementById("cv").textContent="\\u672a\\u9009\\u62e9";closePicker();
    // Show success toast card
    var toast=document.createElement("div");
    toast.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.96);border:1px solid #1e1e2a;border-radius:16px;padding:32px 48px;text-align:center;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,.6)";
    toast.innerHTML="<div style='font-size:48px;margin-bottom:12px'>\\u2705<"+"/div><div style='color:#9e9;font-size:18px;font-weight:600;margin-bottom:6px'>\\u6295\\u7a3f\\u6210\\u529f<"+"/div><div style='color:#999;font-size:14px;margin-bottom:16px'>\\u8bf7\\u7b49\\u5f85\\u7ba1\\u7406\\u5458\\u5ba1\\u6838<"+"/div><button onclick='this.parentElement.remove()' style='padding:8px 28px;background:#ffc832;color:#0a0a0f;border:none;border-radius:8px;font-size:15px;cursor:pointer;font-weight:600'>\\u77e5\\u9053\\u4e86<"+"/button>";
    document.body.appendChild(toast);
    // Auto-remove after 5s
    setTimeout(function(){if(toast.parentElement)toast.remove();},5000);
  })["catch"](function(){
    var el=document.getElementById("ab");
    if(el){el.innerHTML="<span style='color:#e99;font-size:14px'>\\u274c \\u6295\\u7a3f\\u5931\\u8d25\\uff0c\\u8bf7\\u91cd\\u8bd5<"+LS+">";el.disabled=false;}
    setTimeout(function(){if(el){el.innerHTML="\\u9009\\u62e9\\u5bb9\\u5668\\u7c7b\\u578b \\u2192";}},4000);
  });
}
'''

c = c.replace(old, new)

# Verify syntax
m = re.search(r'<script>([\s\S]*?)</script>', c)
if m:
    s = m.group(1)
    print(f"JS brackets: {s.count('{')} == {s.count('}')}")
    print(f"JS parens: {s.count('(')} == {s.count(')')}")
    try:
        compile(s.encode('utf-8'), '<string>', 'exec')
        print("Syntax OK")
    except Exception as e:
        print(f"Syntax ERROR: {e}")
    closes = re.findall(r'<\x2F[a-z]', s)
    print(f"</ in JS: {len(closes)}")

with open('F:\\暗区突围网站\\pages\\map-farm.html', 'w', encoding='utf-8') as f:
    f.write(c)
print("Written OK")
