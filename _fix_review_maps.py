c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

old = """function openMapWithParams(x,y,name,type,ic){
  window.open("map-farm.html?x="+x+"&y="+y+"&name="+encodeURIComponent(name||"")+"&type="+(type||"")+"&ic="+encodeURIComponent(ic||""),"mapView");
}"""

new = """function openMapWithParams(x,y,name,type,ic,mapName){
  var mapPage=mapName||"map-farm";
  var mapFiles={"农场":"map-farm","北山":"map-beishan","山谷":"map-valley","军械库":"map-armory","电视台":"map-tvstation","阿贾克斯港口":"map-airport"};
  mapPage=mapFiles[mapPage]||mapFiles[mapName]||"map-farm";
  window.open(mapPage+".html?x="+x+"&y="+y+"&name="+encodeURIComponent(name||"")+"&type="+(type||"")+"&ic="+encodeURIComponent(ic||""),"mapView");
}"""

if old in c:
    c = c.replace(old, new)
    print("Replaced openMapWithParams")
else:
    print("OLD NOT FOUND")
    # Check what's actually at that location
    idx = c.find("window.open(\"map-farm.html")
    print(c[idx-100:idx+250])

open(fp, "w", encoding="utf8").write(c)
