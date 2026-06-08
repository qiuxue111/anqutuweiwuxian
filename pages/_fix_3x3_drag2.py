path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Replace the <a> tag to NOT have href, use click handler instead
old_a = '<a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">'
new_a = '<a id="adLink">'

t = t.replace(old_a, new_a)

# Update script to handle navigation manually
old_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adSX,adDist,adMoved=false;
adCard.addEventListener('pointerdown',function(e){adSX=e.clientX;adDist=0;adMoved=false;});
adCard.addEventListener('pointermove',function(e){if(adSX!==undefined){var d=Math.abs(e.clientX-adSX);if(d>5)adMoved=true;adDist=Math.max(adDist,d);}});
adCard.querySelector('a').addEventListener('click',function(e){if(adMoved){e.stopPropagation();e.preventDefault();}});}
</script>'''

new_script = '''<script>
var adCard=document.getElementById('adCard');
if(adCard){var adSX,adMoved=false,adInterval;
adCard.addEventListener('pointerdown',function(e){adSX=e.clientX;adMoved=false;if(adInterval)clearInterval(adInterval);});
adCard.addEventListener('pointermove',function(e){if(adSX!==undefined&&Math.abs(e.clientX-adSX)>5)adMoved=true;});
adCard.addEventListener('pointerup',function(e){if(!adMoved)window.open('https://qm.qq.com/q/YWswLAYuoU','_blank');});}
</script>'''

t = t.replace(old_script, new_script)

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3: manual nav')
