import re

c = open('F:\\暗区突围网站\\pages\\map-farm.html', 'r', encoding='utf-8').read()

# Find map-wrap HTML
idx = c.find('map-wrap')
print('=== map-wrap structure ===')
print(c[max(0, idx-100):idx+300])

print('\n=== mapImg references ===')
for m in re.finditer(r'mapImg\s*=?\s*["\']?(.*?)["\'\s;]', c):
    print(m.group())

# Find the HTML around map-wrap
print('\n=== HTML around map-wrap, expanding ===')
end_idx = c.find('</div>', c.find('</div>', c.find('</div>', idx)+1)+1)
print(c[max(0, idx-30):end_idx+6])

# Find the map image URL
print('\n=== Image URLs ===')
for m in re.finditer(r'["\'](farm\.(?:png|jpg|webp))["\']', c, re.I):
    print('Farm map:', m.group(0))

for m in re.finditer(r'["\'](images/[^"\']+)["\']', c):
    print('Images:', m.group(1))
