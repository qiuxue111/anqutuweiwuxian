"""改成懒加载：data-src + IntersectionObserver"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()
old = c

# 1. src -> data-src
c = c.replace('src="../assets/maps/tiles/farm/', 'data-src="../assets/maps/tiles/farm/')

# 2. 加占位背景 + tile-lazy类
c = c.replace('class="tile-img"', 'class="tile-img tile-lazy" style="display:block;width:100%;height:auto;object-fit:cover;background:#1a1a2e"')

# 3. 注入懒加载脚本（放mapImg隐藏img之后）
lazy_script = '''  
  <script>
  // 图块懒加载 - IntersectionObserver
  (function(){
    if(!window.IntersectionObserver) return;
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var img = entry.target;
          var src = img.getAttribute('data-src');
          if(src && !img.src){
            img.src = src;
            img.onload = function(){ img.style.background = ''; };
            img.onerror = function(){ img.src = ''; };
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('.tile-lazy').forEach(function(img){
      observer.observe(img);
    });
    // 缩放/平移后重新观察（部分图块可能刚进入视口）
    var orig_ut = window.ut;
    window.ut = function(){
      if(typeof orig_ut === 'function') orig_ut();
      setTimeout(function(){
        document.querySelectorAll('.tile-lazy:not([src])').forEach(function(img){
          observer.unobserve(img);
          observer.observe(img);
        });
      }, 100);
    };
  })();
  </script>'''

# 在隐藏的mapImg之后插入
insert_pos = c.find('</div>\n    <!-- 保留mapImg') 
if insert_pos >= 0:
    # 找到这一行的结束
    end_pos = c.find('loading="lazy"', insert_pos)
    end_pos = c.find('\n', end_pos)
    c = c[:end_pos] + lazy_script + c[end_pos:]

with open(path,'w',encoding='utf-8') as f:
    f.write(c)
print('Done:', c!=old)
print('data-src:', c.count('data-src='))
print('tile-lazy:', c.count('tile-lazy'))
print('lazy script:', 'IntersectionObserver' in c)
