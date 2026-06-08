maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Remove ALL old ad-close-btn CSS (the small inline style version)
    # Old version: .ad-close-btn{opacity:0;transition:opacity .15s}
    # And: .ad-close-btn:hover{color:#aaa!important}
    import re
    t = re.sub(r'\.ad-close-btn\{opacity:0;transition:opacity \.15s\}', '', t)
    t = re.sub(r'\.ad-close-btn:hover\{color:#aaa!important\}', '', t)
    
    # Also remove any extra .ad-card:hover .ad-close-btn{opacity:1} from old CSS
    t = re.sub(r'\.ad-card:hover \.ad-close-btn\{opacity:1\}', '', t)
    
    # Clean empty lines
    t = re.sub(r'\n\s*\n\s*\n', '\n\n', t)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: cleaned old ad-close-btn CSS')
