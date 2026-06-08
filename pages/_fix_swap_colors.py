# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Swap color in getPinColor: 弹药 → #424242 (灰色), 武器 → #81c784 (绿色)
    t = t.replace("if(k==='弹药')return '#81c784';", "if(k==='弹药')return '#424242';")
    t = t.replace("if(k==='武器')return '#424242';", "if(k==='武器')return '#81c784';")
    
    # Swap in getMatColor too
    t = t.replace("if(k==='弹药')return{color:'#81c784',bg:'rgba(129,199,132,0.12)'};", "if(k==='弹药')return{color:'#424242',bg:'rgba(66,66,66,0.12)'};")
    t = t.replace("if(k==='武器')return{color:'#424242',bg:'rgba(66,66,66,0.12)'};", "if(k==='武器')return{color:'#81c784',bg:'rgba(129,199,132,0.12)'};")
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: swapped weapon/ammo colors')
