c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()

# Check submitMapComment
if 'submitMapComment' in c:
    idx = c.find('submitMapComment')
    print('=== submitMapComment ===')
    print(c[max(0,idx-30):idx+200])
else:
    print('submitMapComment NOT FOUND')

# Check onclick
for name in ['submitMapComment', 'postMapComment']:
    onclick = 'onclick="'+name+'()">' 
    if onclick in c:
        idx = c.find(onclick)
        print(f'{name} onclick found')
    else:
        print(f'{name} onclick NOT FOUND')

# Check function definition text
for name in ['submitMapComment', 'loadMapComments']:
    func_start = 'function '+name
    async_func_start = 'async function '+name
    if func_start in c:
        print(f'{name}: exists as sync function')
    elif async_func_start in c:
        idx = c.find(async_func_start)
        print(f'{name}: exists as async at {idx}')
        print(c[idx:idx+250])
    else:
        print(f'{name}: NOT FOUND in file')
