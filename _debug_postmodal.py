c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Check what's after hue in openPostModal
idx = c.index("catEl.style.color=hue;")
print(c[idx:idx+400])
