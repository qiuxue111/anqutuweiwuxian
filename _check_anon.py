c = open('F:/暗区突围网站/pages/strategy.html', 'r', encoding='utf8').read()
idx = c.find('SUPABASE_ANON=')
# Find closing quote
idx2 = c.find("'", idx+14)
print('Full anon key:')
print(c[idx:idx2+1])
print('Length:', idx2 - idx - 14)
