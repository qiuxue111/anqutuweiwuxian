maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # The real problem: pointer events fire on any movement.
    # Use a more reliable approach: track distance moved
    old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDrag=false;
adCard.addEventListener('pointerdown',function(){adDrag=false;});
adCard.addEventListener('pointermove',function(){adDrag=true;});
adCard.querySelector('a').addEventListener('click',function(e){if(adDrag){e.preventDefault();adDrag=false;}});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adSX,adDist;
adCard.addEventListener('pointerdown',function(e){adSX=e.clientX;adDist=0;});
adCard.addEventListener('pointermove',function(e){if(adSX!==undefined)adDist=Math.max(adDist,Math.abs(e.clientX-adSX));});
adCard.querySelector('a').addEventListener('click',function(e){if(adDist>5)e.preventDefault();});}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: distance-based detection')
