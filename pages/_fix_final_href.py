maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Restore <a href> for native navigation
    old_a = '<a>'
    new_a = '<a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">'
    t = t.replace(old_a, new_a)
    
    # Replace script: use pointer events but cancel on matchMedia to work with file://
    old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDX,adDY;
adCard.addEventListener('pointerdown',function(e){adDX=e.clientX;adDY=e.clientY;});
adCard.addEventListener('pointerup',function(e){if(adDX!==undefined&&(Math.abs(e.clientX-adDX)<=10&&Math.abs(e.clientY-adDY)<=10))window.open('https://qm.qq.com/q/YWswLAYuoU','_blank');});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){(function(){var dx,dy,drg=0;
adCard.addEventListener('pointerdown',function(e){dx=e.clientX;dy=e.clientY;drg=0;});
adCard.addEventListener('pointermove',function(e){if(dx!==undefined&&(Math.abs(e.clientX-dx)>10||Math.abs(e.clientY-dy)>10))drg=1;});
adCard.addEventListener('pointerup',function(){setTimeout(function(){drg=0;},50);});
adCard.querySelector('a').addEventListener('click',function(e){if(drg){e.preventDefault();e.stopPropagation();}});})();}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: restored href + click intercept')
