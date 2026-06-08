maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDrag=false;
adCard.addEventListener('pointerdown',function(){adDrag=false;});
adCard.addEventListener('pointermove',function(e){if(e.pressure>0)adDrag=true;});
adCard.addEventListener('click',function(e){if(adDrag){e.preventDefault();adDrag=false;}});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDrag=false;
adCard.addEventListener('pointerdown',function(){adDrag=false;});
adCard.addEventListener('pointermove',function(){adDrag=true;});
adCard.querySelector('a').addEventListener('click',function(e){if(adDrag){e.preventDefault();adDrag=false;}});}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: a-tag click handler')
