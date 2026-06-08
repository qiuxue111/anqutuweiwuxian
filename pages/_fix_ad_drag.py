maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Add JS to prevent link navigation during drag
    # Find the ad-card related JS and add drag prevention
    # Insert after the ad-card setup
    old = '''<div class="hamburger-menu" id="hamburgerMenu"></div>'''
    new = '''<script>
var adCard=document.getElementById('adCard');
var adDragging=false,adStartX,adStartY;
if(adCard){adCard.addEventListener('mousedown',function(e){adDragging=false;adStartX=e.clientX;adStartY=e.clientY;});
adCard.addEventListener('mousemove',function(e){if(Math.abs(e.clientX-adStartX)>5||Math.abs(e.clientY-adStartY)>5)adDragging=true;});
adCard.addEventListener('mouseup',function(e){if(adDragging)e.preventDefault();adDragging=false;});
adCard.querySelector('a').addEventListener('click',function(e){if(adDragging){e.preventDefault();adDragging=false;}});}
</script>
<div class="hamburger-menu" id="hamburgerMenu"></div>'''
    
    t = t.replace(old, new)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: drag prevention added')
