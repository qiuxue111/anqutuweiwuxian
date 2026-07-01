"""农场地图切成4×4=16块，用于区块化加载"""
from PIL import Image
import os

src = r'F:\暗区突围网站\assets\maps\farm_bg.jpg'
outdir = r'F:\暗区突围网站\assets\maps\tiles\farm'
os.makedirs(outdir, exist_ok=True)

img = Image.open(src)
w, h = img.size
print(f'原图尺寸: {w}x{h}')

cols, rows = 4, 4
tw, th = w // cols, h // rows
print(f'每块尺寸: {tw}x{th}')

for r in range(rows):
    for c in range(cols):
        left = c * tw
        upper = r * th
        right = left + tw
        lower = upper + th
        # 最后一行/列补全剩余像素
        if r == rows - 1:
            lower = h
        if c == cols - 1:
            right = w
        tile = img.crop((left, upper, right, lower))
        fname = f'farm_{r}_{c}.jpg'
        tile.save(os.path.join(outdir, fname), quality=85)
        print(f'  {fname}: {tile.size}')

print(f'完成！共{cols*rows}块，保存在 {outdir}')
