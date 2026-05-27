files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix 1: containerId -> 'mcList' in renderMapComments
    c = c.replace("deleteMapComment(\"' + c.id + '\",\"" + "+containerId", "deleteMapComment(" + "' + c.id + " + ",'mcList'")
    
    # Actually let me see what's in the file now
    idx = c.find('renderMapComments')
    start = idx
    depth = 0
    i = start
    while i < len(c):
        if c[i] == '{': depth += 1
        elif c[i] == '}':
            depth -= 1
            if depth == 0:
                print(f'{fp.split("/")[-1]} renderMapComments (lines {start}-{i}):')
                print(c[start:i+1][:200])
                print()
                break
        i += 1
    
    # Fix renderPinComments curPinIdx -> it's a number in the onclick
    idx2 = c.find('renderPinComments')
    if idx2 >= 0:
        i2 = idx2
        depth = 0
        while i2 < len(c):
            if c[i2] == '{': depth += 1
            elif c[i2] == '}':
                depth -= 1
                if depth == 0:
                    print(f'{fp.split("/")[-1]} renderPinComments:')
                    print(c[idx2:i2+1][:200])
                    print()
                    break
            i2 += 1
