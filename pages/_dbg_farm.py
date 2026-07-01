with open(r'F:\暗区突围网站\pages\map-farm.html','r',encoding='utf-8') as f:
    c = f.read()
idx = c.find("addEventListener('wheel'")
print(repr(c[idx:idx+300]))
