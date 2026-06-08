path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Replace old script with a simpler one: wrap entire card with onclick via JS
old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adSX,adDist;
adCard.addEventListener('pointerdown',function(e){adSX=e.clientX;adDist=0;});
adCard.addEventListener('pointermove',function(e){if(adSX!==undefined)adDist=Math.max(adDist,Math.abs(e.clientX-adSX));});
adCard.querySelector('a').addEventListener('click',function(e){if(adDist>5)e.preventDefault();});}
</script>'''

new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adSX,adDist,adMoved=false;
adCard.addEventListener('pointerdown',function(e){adSX=e.clientX;adDist=0;adMoved=false;});
adCard.addEventListener('pointermove',function(e){if(adSX!==undefined){var d=Math.abs(e.clientX-adSX);if(d>5)adMoved=true;adDist=Math.max(adDist,d);}});
adCard.querySelector('a').addEventListener('click',function(e){if(adMoved){e.stopPropagation();e.preventDefault();}});}
</script>'''

t = t.replace(old_script, new_script)

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
