# -*- coding: utf-8 -*-
"""修复：sessionStorage 注释没生效（缩进不匹配）"""
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']

old_block = """  if (sessionStorage.getItem('adCardClosed_v2')) {
    card.style.display = 'none'; return;
  }"""

new_block = """  /* ad card always visible */
  // if (sessionStorage.getItem('adCardClosed_v2')) {
  //   card.style.display = 'none'; return;
  // }"""

for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    count = t.count(old_block)
    if count:
        t = t.replace(old_block, new_block)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: replaced {count}x')
    else:
        # Try with \r\n
        old_block2 = old_block.replace('\n', '\r\n')
        count2 = t.count(old_block2)
        if count2:
            new_block2 = new_block.replace('\n', '\r\n')
            t = t.replace(old_block2, new_block2)
            with open(path, 'wb') as f:
                f.write(t.encode('utf-8'))
            print(f'{m}: replaced with CRLF {count2}x')
        else:
            # Show actual content
            idx = t.find('adCardClosed')
            print(f'{m}: NOT FOUND, actual:\n{repr(t[max(0,idx-30):idx+100])}')
