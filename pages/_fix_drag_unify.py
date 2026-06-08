maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Find the existing drag script and replace it
    import re
    
    # Match any variant of the drag prevention script (v1-v7 + 3x3 variant)
    # Remove old script from <!-- Drag fix for adCard to ...
    # Use a pattern that catches all versions
    
    # Find the script block that has adCard pointer event handling
    old_script = ''
    patterns = [
        'adSX,adMoved=false,adInterval;',
        'adSX,adDist;',
        'adDist;',
        'adSX,adDist;adCard',
        'adSX,adDist=0;'
    ]
    
    for pat in patterns:
        if pat in t:
            # Find the script tag containing it
            idx = t.find(pat)
            start = t.rfind('<script>', 0, idx)
            end = t.find('</script>', idx) + 9
            if start >= 0 and end > start:
                old_script = t[start:end]
                break
    
    if old_script:
        print(f'{m}: found old script ({len(old_script)} chars)')
    else:
        print(f'{m}: no old script found')
    
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
    print(f'{m}: unified drag script')
