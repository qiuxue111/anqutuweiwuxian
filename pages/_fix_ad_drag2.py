maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    old_script = '''<script>
var adCard=document.getElementById('adCard');
var adDragging=false,adStartX,adStartY;
if(adCard){adCard.addEventListener('mousedown',function(e){adDragging=false;adStartX=e.clientX;adStartY=e.clientY;});
adCard.addEventListener('mousemove',function(e){if(Math.abs(e.clientX-adStartX)>5||Math.abs(e.clientY-adStartY)>5)adDragging=true;});
adCard.addEventListener('mouseup',function(e){if(adDragging)e.preventDefault();adDragging=false;});
adCard.querySelector('a').addEventListener('click',function(e){if(adDragging){e.preventDefault();adDragging=false;}});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
var adDragging=false,adStartX,adStartY;
if(adCard){adCard.addEventListener('mousedown',function(e){adDragging=false;adStartX=e.clientX;adStartY=e.clientY;});
adCard.addEventListener('mousemove',function(e){if(Math.abs(e.clientX-adStartX)>5||Math.abs(e.clientY-adStartY)>5)adDragging=true;});
adCard.addEventListener('mouseup',function(e){if(adDragging){e.stopPropagation();e.stopImmediatePropagation();}adDragging=false;});
adCard.querySelector('a').addEventListener('click',function(e){if(adDragging)e.stopPropagation();});}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: drag fix v2')
