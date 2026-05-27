import re

titles = {
    'gear.html': '配装推荐 - 暗区突围攻略',
    'help.html': '帮助指南 - 暗区突围攻略',
    'map-editor.html': '地图编辑 - 暗区突围攻略',
    'map-farm.html': '农场地图 - 暗区突围攻略',
    'maps.html': '地图列表 - 暗区突围：无限攻略站',
    'review.html': '审核中心 - 暗区突围攻略',
    'strategy.html': '战术攻略 - 暗区突围攻略',
    'weapons.html': '枪械改装 - 暗区突围：无限攻略站',
}
index_title = '暗区突围：无限 - 攻略站'

for fn, title in titles.items():
    fp = 'F:\\暗区突围网站\\pages\\' + fn
    c = open(fp, 'r', encoding='utf-8').read()
    c = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', c)
    # Also check for broken version with unicode replacement chars
    open(fp, 'w', encoding='utf-8').write(c)
    print(f'{fn}: <title>{title}</title>')

c = open('F:\\暗区突围网站\\index.html', 'r', encoding='utf-8').read()
c = re.sub(r'<title>.*?</title>', f'<title>{index_title}</title>', c)
open('F:\\暗区突围网站\\index.html', 'w', encoding='utf-8').write(c)
print('index.html:', index_title)
