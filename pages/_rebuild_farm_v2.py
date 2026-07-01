"""重建农场瓦片，去掉旧的整图 HD 图层"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 找到旧HD图层的4个img标签并移除
# 查找 <img src="../assets/maps/farm_hd_1.png" ... 到最后一个hd-layer的结束
import re

# 移除所有独立的hd-layer img（不是动态生成的）
# 样式: <img src="../assets/maps/farm_hd_1.png" ... class="hd-layer" ...>
for i in range(1, 5):
    pattern = r'\s*<img[^>]*farm_hd_' + str(i) + r'\.png[^>]*hd-layer[^>]*>\s*'
    c = re.sub(pattern, '\n', c, count=1)

# 同时去掉旧的懒加载脚本如果在注释后有重复
# 清理多余空行
c = re.sub(r'\n{3,}', '\n\n', c)

with open(path,'w',encoding='utf-8') as f:
    f.write(c)

# JS校验
import subprocess, json
# 提取script内容
scripts = []
in_script = False
script_buf = ''
for line in c.split('\n'):
    if '<script>' in line:
        in_script = True
        script_buf = line.split('<script>')[-1] + '\n'
        continue
    if in_script:
        if '</script>' in line:
            script_buf += line.split('</script>')[0]
            scripts.append(script_buf)
            in_script = False
            script_buf = ''
        else:
            script_buf += line + '\n'

# 检查所有脚本中的 不安全 </
for i, s in enumerate(scripts):
    bad = re.findall(r'<(?!/(?:script|option))', s)
    if bad:
        print(f'脚本块{i}: {len(bad)}个不安全 </ 出现')
    else:
        print(f'脚本块{i}: 安全')

# 检查大括号
print(f'大括号平衡: {{={c.count(chr(123))} }}={c.count(chr(125))}')

print('Done')
print('hd-layer剩:', c.count('hd-layer'))
print('tile-cell:', c.count('tile-cell'))
print('IntersectionObserver:', 'IntersectionObserver' in c)
