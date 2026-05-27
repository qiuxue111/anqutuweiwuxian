c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()
print('First 100 chars:')
print(repr(c[:100]))
print()

# Check if script tag content is wrapped in quotes
idx_s = c.find('<script>')
idx_e = c.rfind('</script>')
if idx_s > 0 and idx_e > idx_s:
    s = c[idx_s+len('<script>'):idx_e]
    print(f'Script starts with: {repr(s[:50])}')
    print(f'Script ends with:   {repr(s[-50:])}')
    
# Count unclosed double quotes before the broken area
lines = c.split('\n')
for i in range(309, 317):
    l = lines[i]
    print(f'{i+1}: {repr(l[:80])}')
