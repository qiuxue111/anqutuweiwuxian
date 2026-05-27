files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Change db() to use apikey for DELETE (not token)
    old_db_call = "var useToken=(method==='POST'||method==='PATCH'||method==='DELETE');"
    new_db_call = "var useToken=(method==='POST'||method==='PATCH');"  # DELETE uses anon key
    c = c.replace(old_db_call, new_db_call)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
