files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']

# Replace the body construction to be conditional
old_pattern = """body:JSON.stringify({
        title:title, content:content, category:category,
        author:author
      })"""

# Replace with conditional images inclusion
new_pattern = """body:(function(){
        var body={title:title,content:content,category:category,author:author};
        if(images.length)body.images=JSON.stringify(images);
        return JSON.stringify(body);
      })()"""

for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    if old_pattern in c:
        c = c.replace(old_pattern, new_pattern)
        open(fp,'w',encoding='utf8').write(c)
        print(fp.split('/')[-1] + ': conditional body added')
    else:
        print(fp.split('/')[-1] + ': pattern not found')
        # debug: show the actual pattern around author
        idx = c.index('author:author')
        print('  context:', c[idx:idx+50])
