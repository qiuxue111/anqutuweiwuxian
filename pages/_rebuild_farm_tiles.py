"""重建农场地图为瓦片结构：低清+4层高清，全部懒加载"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 替换从 <div id="mapTileGrid" 到 </div>\n    <!-- 保留mapImg... 的整个区域
old_start = c.find('<div id="mapTileGrid"')
old_end = c.find('loading="lazy">\n    <img src="../assets/maps/farm_hd_')
# 向前找到上一个img的结束
old_end = c.rfind('</div>', 0, old_end)
old_end = c.find('\n', old_end)  # 换行

old_block = c[old_start:old_end]

new_grid = """    <div id="mapTileGrid" class="tile-grid" style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);width:100%;position:relative;z-index:1">
      <!-- 低清底图 + 4层高清图块，由JS动态生成 -->
    </div>
    <!-- 保留mapImg用于JS获取图片尺寸（隐藏） -->
    <img src="../assets/maps/farm_bg.jpg" id="mapImg" style="display:none;position:absolute;left:0;top:0;width:100%;height:auto;z-index:0;pointer-events:none" loading="lazy">
    <script>
    // 生成瓦片：低清 + 4层高清，全部懒加载
    (function(){
      var grid = document.getElementById('mapTileGrid');
      if(!grid) return;
      var COLS = 4, ROWS = 4;
      var tiles = {};
      // 为每个图块创建容器
      for(var r = 0; r < ROWS; r++){
        for(var c = 0; c < COLS; c++){
          var wrap = document.createElement('div');
          wrap.className = 'tile-cell';
          wrap.style.cssText = 'position:relative;overflow:hidden;width:100%;height:100%';
          // 低清图块
          var bg = document.createElement('img');
          bg.className = 'tile-img tile-lazy';
          bg.setAttribute('data-src', '../assets/maps/tiles/farm/farm_'+r+'_'+c+'.jpg');
          bg.style.cssText = 'display:block;width:100%;height:auto;object-fit:cover;background:#1a1a2e;position:relative;z-index:1';
          bg.loading = 'lazy';
          wrap.appendChild(bg);
          // 4层高清图块
          for(var h = 1; h <= 4; h++){
            var hd = document.createElement('img');
            hd.className = 'tile-hd tile-lazy hd-'+h;
            hd.setAttribute('data-src', '../assets/maps/tiles/farm/farm_hd_'+h+'_'+r+'_'+c+'.png');
            hd.style.cssText = 'display:block;width:100%;height:auto;object-fit:cover;position:absolute;left:0;top:0;z-index:'+(h+1)+';pointer-events:none;opacity:0;transition:opacity .3s';
            hd.loading = 'lazy';
            wrap.appendChild(hd);
          }
          grid.appendChild(wrap);
        }
      }
      // 图块懒加载 IntersectionObserver
      if(window.IntersectionObserver){
        var observer = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting){
              var img = entry.target;
              var src = img.getAttribute('data-src');
              if(src && (!img.src || img.src.indexOf('data:')===0)){
                img.src = src;
                img.onload = function(){ this.style.background = ''; };
                img.onerror = function(){ this.src = ''; };
              }
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '400px' });
        // 等DOM更新后开始观察
        setTimeout(function(){
          document.querySelectorAll('.tile-lazy').forEach(function(img){
            observer.observe(img);
          });
        }, 50);
      }
      // 在缩放变化时切换高清可见性（缩放>=3 显示高清）
      function refreshHD(){
        var sm = window.scaleM || 1;
        var showHD = sm >= 3;
        document.querySelectorAll('.tile-hd').forEach(function(img){
          img.style.opacity = showHD ? '1' : '0';
        });
      }
      // 挂到ut上，每次缩放/平移时调用
      var _origRefreshHD = window._refreshHD;
      window._refreshHD = refreshHD;
      var orig_ut = window.ut;
      window.ut = function(){
        if(typeof orig_ut === 'function') orig_ut();
        setTimeout(function(){
          if(window._refreshHD) window._refreshHD();
        }, 50);
      };
      // 初始调用
      setTimeout(refreshHD, 100);
    })();
    </script>
    <img src="../assets/maps/farm_hd_1.png" draggable="false" class="hd-layer" style="display:block;width:100%;position:absolute;left:0;top:0;z-index:2;pointer-events:none" loading="lazy">"""

# 替换
c = c[:old_start] + new_grid + c[old_end:]

# 移除之前的懒加载脚本（如果有重复）
# 清理多余的空行
import re
c = re.sub(r'\n{3,}', '\n\n', c)

with open(path,'w',encoding='utf-8') as f:
    f.write(c)

print('Done')
print('tile-cell:', c.count('tile-cell'))
print('tile-lazy:', c.count('tile-lazy'))
print('hd-1:', c.count('hd-1'))
print('缩放显示高清:', 'sm >= 3' in c)
