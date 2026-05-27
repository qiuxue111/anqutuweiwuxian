import re
c = open('F:\\暗区突围网站\\pages\\maps.html', 'r', encoding='utf-8').read()
chars = set(ch for ch in c if ord(ch) > 127)
print('Non-ASCII chars count:', len(chars))
for code in sorted(ord(ch) for ch in chars):
    print(f'  U+{code:04X} {chr(code)}')
print('Has U+FFFD:', '\ufffd' in c)
idx = c.find('容器')
if idx >= 0:
    print('容器:', repr(c[idx-20:idx+50]))
idx = c.find('主军械库')
if idx >= 0:
    print('主军械库:', repr(c[idx-10:idx+30]))
# Check area user is complaining about
idx2 = c.find('港口')
if idx2 >= 0:
    print('港口:', repr(c[idx2-10:idx2+30]))
# Check near "枪械" garbled
idx3 = c.find('枪械')
if idx3 >= 0:
    print('枪械:', repr(c[idx3-20:idx3+30]))
# Show garbled spots (where \ufffd or broken chars)
for m in re.finditer(r'[\x80-\xff]{2,}', c):
    print('Garbled:', repr(m.group()), 'at', m.start())
