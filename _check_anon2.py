c = open('F:/暗区突围网站/pages/strategy.html', 'r', encoding='utf8').read()
idx = c.find('SUPABASE_URL=')
idx2 = c.find("'", idx+13)
if idx >= 0:
    print('URL:', c[idx:idx2+1])
else:
    print('No SUPABASE_URL found')

idx = c.find('SUPABASE_ANON=')
idx3 = c.find('\n', idx+14)
print(f'ANON range: {idx}-{idx3}')
print(f'  Value: {c[idx:idx3]}')
