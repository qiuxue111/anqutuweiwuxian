# 把图片复制到网站 assets 目录
import shutil, os
os.makedirs('F:/暗区突围网站/assets/ads', exist_ok=True)
shutil.copy('G:/QQ/杂物/1780913986789.png', 'F:/暗区突围网站/assets/ads/ad-3x3.png')
print('Copied')
