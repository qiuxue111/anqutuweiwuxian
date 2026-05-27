c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

old = """function viewOnMap(x,y,name,type,ic){
  window.open("map-farm.html?x="+x+"&y="+y+"&name="+encodeURIComponent(name||"")+"&type="+(type||"")+"&ic="+encodeURIComponent(ic||""),"mapView");
}"""

new = """function viewOnMap(x,y,name,type,ic,mapName){
  var mapPage=mapName||"map-farm";
  var mapFiles={"\\u519c\\u573a":"map-farm","\\u5317\\u5c71":"map-beishan","\\u5c71\\u8c37":"map-valley","\\u519b\\u68b0\\u5e93":"map-armory","\\u7535\\u89c6\\u53f0":"map-tvstation","\\u963f\\u8d3e\\u514b\\u65af\\u6e2f\\u53e3":"map-airport"};
  mapPage=mapFiles[mapPage]||mapFiles[mapName]||"map-farm";
  window.open(mapPage+".html?x="+x+"&y="+y+"&name="+encodeURIComponent(name||"")+"&type="+encodeURIComponent(type||"")+"&ic="+encodeURIComponent(ic||""),"mapView");
}"""

if old in c:
    c = c.replace(old, new)
    print("Replaced viewOnMap")
else:
    print("OLD NOT FOUND")
    print(f"Looking for function at {c.find('function viewOnMap')}")

# Also update the callers to pass mapName
# Find all places that call viewOnMap
# Option 1: update the click handler
c = c.replace(
    '''viewOnMap(x,y,name,type,ic);''',
    '''viewOnMap(x,y,name,type,ic,mapName);'''
)

# Also update the approve code where it gets map_name
# Find the pending_pins item rendering to add map_name
# Search for where view-on-map-btn is rendered
c = c.replace(
    "p.note||\"\");\n          html.push",
    '''p.note||\"\");\n          var mapName=p.map_name||\"\";\n          html.push'''
)
c = c.replace(
    "p.note||\"\"),encoded=false\n      html.push",
    '''p.note||\"\"),encoded=false\n      var mapName=p.map_name||\"\";\n      html.push'''
)

# Fix the click handler to include mapName
c = c.replace(
    "view-on-map-btn`).forEach(function(el){",
    '''view-on-map-btn`).forEach(function(el){var mapName=el.dataset.mapName||"";'''
)
c = c.replace(
    "var x=parseFloat(btn.dataset.x);",
    '''var x=parseFloat(btn.dataset.x);var mapName=btn.dataset.mapName||"";'''
)
c = c.replace(
    "viewOnMap(x,y,name,type,ic);",
    '''viewOnMap(x,y,name,type,ic,mapName);'''
)

# Add map_name data attribute to the rendered buttons
c = c.replace(
    "data-ic='\"+(p.ic||\"\")+\"'>\\u5728\\u5730\\u56fe\\u4e0a\\u67e5\\u770b</span>",
    "data-ic='\"+(p.ic||\"\")+\"' data-map-name='\"+(p.map_name||\"\")+\"'>\\u5728\\u5730\\u56fe\\u4e0a\\u67e5\\u770b</span>"
)

# Also for pending deletion items
c = c.replace(
    "data-ic='\"+(a.ic||\"\")+\"'>\\u5728\\u5730\\u56fe\\u4e0a\\u67e5\\u770b</span>",
    "data-ic='\"+(a.ic||\"\")+\"' data-map-name='\"+(a.map_name||\"\")+\"'>\\u5728\\u5730\\u56fe\\u4e0a\\u67e5\\u770b</span>"
)

open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8").write(c)
print("Saved")
