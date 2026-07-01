"""农场 bg + hd_1~4 全部切成 4×4 分块"""
from PIL import Image
import os

base = r'F:\暗区突围网站\assets\maps'
outdir = r'F:\暗区突围网站\assets\maps\tiles\farm'
os.makedirs(outdir, exist_ok=True)

files = [
    ('farm_bg.jpg', 'jpg'),
    ('farm_hd_1.png', 'png'),
    ('farm_hd_2.png', 'png'),
    ('farm_hd_3.png', 'png'),
    ('farm_hd_4.png', 'png'),
]

cols, rows = 4, 4

for fname, ext in files:
    src = os.path.join(base, fname)
    img = Image.open(src)
    w, h = img.size
    tw, th = w // cols, h // rows
    print(f'{fname}: {w}x{h}, 每块 {tw}x{th}')

    name_no_ext = fname.replace('.jpg','').replace('.png','')
    for r in range(rows):
        for c in range(cols):
            left = c * tw
            upper = r * th
            right = left + tw if c < cols - 1 else w
            lower = upper + th if r < rows - 1 else h
            tile = img.crop((left, upper, right, lower))
            out_name = f'{name_no_ext}_{r}_{c}.{ext}'
            out_path = os.path.join(outdir, out_name)
            if ext == 'jpg':
                tile.save(out_path, quality=85)
            else:
                tile.save(out_path)
    img.close()
    print(f'  ✅ {cols*rows} 块已保存')

total_files = sum(1 for f in os.listdir(outdir) if os.path.isfile(os.path.join(outdir, f)))
print(f'\n共 {total_files} 个文件在 {outdir}')
