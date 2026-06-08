maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDrag=false,adSX,adSY;
adCard.addEventListener('pointerdown',function(e){adDrag=false;adSX=e.clientX;adSY=e.clientY;});
adCard.addEventListener('pointermove',function(e){if(Math.abs(e.clientX-adSX)>5||Math.abs(e.clientY-adSY)>5)adDrag=true;});
adCard.addEventListener('pointerup',function(e){setTimeout(function(){adDrag=false;},50);});
adCard.querySelector('a').addEventListener('click',function(e){if(adDrag)e.preventDefault();});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDrag=false;
adCard.addEventListener('pointerdown',function(){adDrag=false;});
adCard.addEventListener('pointermove',function(e){if(e.pressure>0)adDrag=true;});
adCard.addEventListener('click',function(e){if(adDrag){e.preventDefault();adDrag=false;}});}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: simplified drag detection')
