maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Replace the whole drag script with pure JS navigation
    old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDX,adDY,dragged=0;
adCard.addEventListener('pointerdown',function(e){adDX=e.clientX;adDY=e.clientY;dragged=0;});
adCard.addEventListener('pointermove',function(e){if(adDX!==undefined&&(Math.abs(e.clientX-adDX)>10||Math.abs(e.clientY-adDY)>10))dragged=1;});
adCard.addEventListener('pointerup',function(){setTimeout(function(){dragged=0;},100);});
adCard.querySelector('a').addEventListener('click',function(e){if(dragged)e.preventDefault();});}
</script>'''
    
    new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adDX,adDY;
adCard.addEventListener('pointerdown',function(e){adDX=e.clientX;adDY=e.clientY;});
adCard.addEventListener('pointerup',function(e){if(adDX!==undefined&&(Math.abs(e.clientX-adDX)<=10&&Math.abs(e.clientY-adDY)<=10))window.open('https://qm.qq.com/q/YWswLAYuoU','_blank');});}
</script>'''
    
    t = t.replace(old_script, new_script)
    
    # Also remove href from <a> tag to prevent native navigation
    old_a = '<a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">'
    new_a = '<a>'
    t = t.replace(old_a, new_a)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: pure JS nav')
