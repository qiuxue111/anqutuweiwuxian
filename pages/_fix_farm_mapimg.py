"""修复 mapImg: 保留一个且 visibility:hidden"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 找到第二处 mapImg（在 })();\n    </script> 之后）
idx = c.find('保留mapImg', c.find('保留mapImg') + 10)
# 从这到下一个 <script> 或 <div>
end = c.find('<', idx + 200)
old_second = c[idx:end]

# 移除第二处
c = c.replace(old_second, '')

# 第一处改为 visibility:hidden
c = c.replace('display:none;position:absolute;left:0;top:0;width:100%;height:auto;z-index:0;pointer-events:none',
              'position:absolute;left:0;top:0;width:100%;height:auto;z-index:0;pointer-events:none;visibility:hidden')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
print('mapImg 数量:', c.count('id="mapImg"'))
print('display:none 在 mapImg 附近:', 'display:none' in c[c.find('mapImg')-30:c.find('mapImg')+100] if 'mapImg' in c else 'N/A')
