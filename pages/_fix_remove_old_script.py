path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Remove the OLD adCard script (the one with AD_LINK and mousedown/touchstart)
# It starts with: (function(){var card = document.getElementById('adCard');
# It ends with: })();\n\n</script>
import re

# Find and remove the old script block
idx = t.find('var AD_LINK')
start = t.rfind('<script>', 0, idx)
end = t.find('</script>', idx) + 9

old_block = t[start:end]
print(f'Removing OLD block ({len(old_block)} chars):')
print(old_block[:200])
print('...')

t = t.replace(old_block, '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('\nRemoved!')
