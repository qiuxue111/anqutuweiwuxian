# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Find the zoom slider onChange/onInput that calls zoom() without cx,cy
    # Search for the slider event
    old = '''function zoom(f,cx,cy){if(cx===void 0||cy===void 0){scaleM*=f;if(scaleM<0.1)scaleM=0.1;if(scaleM>22)scaleM=22;ut();return;}var prev=scaleM;scaleM*=f;if(scaleM<0.1)scaleM=0.1;if(scaleM>22)scaleM=22;var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/prev,imgY=(my-panY)/prev;panX=mx-imgX*scaleM;panY=my-imgY*scaleM;ut();}'''
    
    new = '''function zoom(f,cx,cy){
  if(cx===void 0||cy===void 0){
    // 无锚点时以屏幕中心为锚点
    var wrap=document.querySelector('.map-wrap');
    if(wrap){
      var wr=wrap.getBoundingClientRect();
      cx=wr.left+wr.width/2;
      cy=wr.top+wr.height/2;
    }
  }
  var prev=scaleM;scaleM*=f;
  if(scaleM<0.1)scaleM=0.1;if(scaleM>22)scaleM=22;
  if(cx!==void 0&&cy!==void 0){
    var wrap=document.querySelector('.map-wrap');
    if(!wrap)return;
    var wr=wrap.getBoundingClientRect();
    var mx=cx-wr.left,my=cy-wr.top;
    var imgX=(mx-panX)/prev,imgY=(my-panY)/prev;
    panX=mx-imgX*scaleM;panY=my-imgY*scaleM;
  }
  ut();
}'''
    
    if old in t:
        t = t.replace(old, new)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: fixed zoom center')
    else:
        print(f'{m}: old not found')
