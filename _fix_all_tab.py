with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# 1. In loadData, when currentTab is "all", render pins instead of pending
old_load = """if(currentTab==="deletion"){renderDels(dels);return;}"""
new_load = """if(currentTab==="deletion"){renderDels(dels);return;}
    if(currentTab==="all"){renderPins(pins);return;}"""

# Check if already exists
if 'renderPins' in c:
    print("renderPins already exists, checking...")
else:
    c = c.replace(old_load, new_load)
    print("Added renderPins call for 'all' tab")

# 2. Create renderPins function (similar to renderList but for approved pins)
# Find where to insert: right before renderDels or right after loadData
idx = c.find("function renderDels")
insert_point = idx
while c[insert_point-1] not in ["}", "\n"]:
    insert_point -= 1

render_pins_fn = """
function renderPins(pins){
  var html="";
  if(!pins||!pins.length){html="<div class='empty'>没有公开点位<\/div>";}
  pins.forEach(function(p){
    html+="<div class='card'><div class='hdr'>";
    html+="<h3>"+p.name+"</h3>";
    html+="<span style='color:#888;font-size:11px'>地图: "+(p.map_name||"未指定")+"</span>";
    html+="</div>";
    html+="<div class='meta'>坐标: ("+p.x+"%, "+p.y+"%)  | 类型: "+(p.type||"")+"</div>";
    if(p.ic)html+="<div class='meta'>容器: "+p.ic+"</div>";
    html+="<div style='margin:6px 0'><span class='view-on-map-btn' style='cursor:pointer;display:inline-block;padding:4px 12px;background:#1a1a3a;color:#88aaff;border:1px solid #335;border-radius:6px;font-size:12px'>&#x1f4cd; 在地图上查看位置</span></div>";
    if(p.images&&p.images.length>0){
      html+="<div style='display:flex;gap:6px;margin:6px 0;flex-wrap:wrap'>";
      p.images.forEach(function(img){if(img)html+="<img src='"+img+"' style='width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #333;cursor:pointer' onclick='window.open(this.src)'>";});
      html+="</div>";
    }
    html+="</div>";
  });
  document.getElementById("list").innerHTML=html;
  // Set map names from stored data
  setTimeout(function(){
    var __allCards=document.querySelectorAll('.view-on-map-btn');
    __allCards.forEach(function(btn,i){
      if(pins[i])btn.dataset.mapName=pins[i].map_name||'';
    });
  },0);
}

"""

c = c[:insert_point] + render_pins_fn + c[insert_point:]

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
print(f"renderPins: {'OK' if 'function renderPins' in c2 else 'NOT FOUND'}")
all_tab_pat = 'currentTab==="all"'
print(f"all tab: {'OK' if all_tab_pat in c2 else 'NOT FOUND'}")
print(f"View on map btn in renderPins: {'OK' if 'view-on-map-btn' in c2[c2.find('renderPins'):c2.find('renderDels')] else 'NOT FOUND'}")
ob = c2.count("{")
cb = c2.count("}")
print(f"Braces: {{ {ob} }} {cb}")
