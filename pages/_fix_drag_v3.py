maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Replace with simpler approach: track down and up positions, if they differ > 10px it's a drag
    old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adSX,adDist;
adCard.addEventListener('pointerdown',function(e){adSX=e.clientX;adDist=0;});
adCard.addEventListener('pointermove',function(e){if(adSX!==undefined)adDist=Math.max(adDist,Math.abs(e.clientX-adSX));});
adCard.querySelector('a').addEventListener('click',function(e){if(adDist>10)e.preventDefault();});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDX,adDY,dragged=0;
adCard.addEventListener('pointerdown',function(e){adDX=e.clientX;adDY=e.clientY;dragged=0;});
adCard.addEventListener('pointermove',function(e){if(adDX!==undefined&&(Math.abs(e.clientX-adDX)>10||Math.abs(e.clientY-adDY)>10))dragged=1;});
adCard.addEventListener('pointerup',function(){dragged=0;});
adCard.addEventListener('click',function(e){if(dragged){e.preventDefault();}});}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: pointerup reset + XY check')
