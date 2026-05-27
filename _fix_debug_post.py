files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']

# Modify submitPost to show actual HTTP status and response on failure
old = """    if(!r.ok){var err=await r.json();alert('发布失败: '+(err.message||r.status));return;}"""
new = """    console.log('POST status:',r.status,'response:',await r.text().catch(function(){}));
    if(!r.ok){var err;try{err=await r.json();}catch(e){err={message:await r.text()}};alert('发布失败('+r.status+'): '+(err.message||err));return;}"""

for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    if old in c:
        c = c.replace(old, new)
        open(fp,'w',encoding='utf8').write(c)
        print(fp.split('/')[-1] + ': debug logging added')
    else:
        print(fp.split('/')[-1] + ': pattern not found')

print('DONE')
