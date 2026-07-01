"""强制高清图块立即加载（不懒加载），确认HD系统工作"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 把高清图块的 IntersectionObserver 逻辑改成直接加载
# 找到 observer 生成部分的结尾，在它后面立即加载所有高清
old = """})();
      }
      // 高清可见性控制"""
new = """})();
        // 强制所有高清图块立即加载（不依赖懒加载）
        document.querySelectorAll('.tile-hd').forEach(function(img){
          var src = img.getAttribute('data-src');
          if(src && !img.src){
            img.src = src;
          }
        });
        // 1秒后刷新HD状态
        setTimeout(function(){ if(window._refreshHD) window._refreshHD(); }, 1000);
      }
      // 高清可见性控制"""
# 注意：需要精确匹配，注意缩进
c = c.replace(old, new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done:', '强制所有高清图块' in c)
