files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # Change: return '<div class="post-card" id="post_'+pId+'"><h3><a href="javascript:void(0)" onclick="openPostModal('+pId+')">... to make the whole card clickable
    # Replace the opening div: add onclick + cursor pointer style
    old_card_open = "return '<div class=\"post-card\" id=\"post_'+pId+'\"><h3>"
    new_card_open = "return '<div class=\"post-card\" id=\"post_'+pId+'\" style=\"cursor:pointer;\" onclick=\"openPostModal('+pId+')\"><h3>"
    c = c.replace(old_card_open, new_card_open)
    
    # Remove the old onclick from <a> to avoid double-trigger
    old_a = "onclick=\"openPostModal('+pId+')\">'+esc(p.title||'无标题')+'</a></h3>"
    new_a = "href=\"javascript:void(0)\">'+esc(p.title||'无标题')+'</a></h3>"
    c = c.replace(old_a, new_a)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': fixed')

print('DONE')
