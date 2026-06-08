import re

maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Find and remove the entire block that creates dynamic closeBtn with ad-close-btn class
    # Pattern: var closeBtn...closeBtn.className = 'ad-close-btn';...card.appendChild(closeBtn);
    # Use a simple approach: find the exact text by positions
    
    # Find start: 'var closeBtn = document.createElement('span');'
    # Find end: 'card.appendChild(closeBtn);'
    idx = t.find("closeBtn.className = 'ad-close-btn'")
    if idx >= 0:
        # Go backwards to find var closeBtn
        start = t.rfind('var closeBtn', 0, idx)
        end = t.find('card.appendChild(closeBtn);', idx) + len('card.appendChild(closeBtn);')
        if start >= 0 and end > start:
            old_block = t[start:end]
            print(f'{m}: removing block from {start} to {end} ({len(old_block)} chars)')
            # Verify it contains the right content
            if 'ad-close-btn' in old_block and 'closeBtn' in old_block:
                t = t.replace(old_block, '')
                print(f'{m}: removed')
            else:
                print(f'{m}: suspicious block, skipping')
        else:
            print(f'{m}: start={start} end={end}')
    else:
        print(f'{m}: ad-close-btn class not found')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
