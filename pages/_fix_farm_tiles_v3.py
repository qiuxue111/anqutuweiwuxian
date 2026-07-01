"""重写农场瓦片JS脚本，修复高清不显示问题"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 找到瓦片生成脚本（从 (function(){ 到最近的 });\n 之后的 </script>）
start = c.find('(function(){')
end = c.find('</script>', start)
old_script = c[start:end]

new_script = """(function(){
      var grid = document.getElementById('mapTileGrid');
      if(!grid) return;
      var COLS = 4, ROWS = 4;
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
          bg.setAttribute('draggable', 'false');
          wrap.appendChild(bg);
          // 4层高清图块（初始隐藏，加载后自动显示）
          for(var h = 1; h <= 4; h++){
            var hd = document.createElement('img');
            hd.className = 'tile-hd tile-lazy hd-'+h;
            hd.setAttribute('data-src', '../assets/maps/tiles/farm/farm_hd_'+h+'_'+r+'_'+c+'.png');
            hd.style.cssText = 'display:block;width:100%;height:auto;object-fit:cover;position:absolute;left:0;top:0;z-index:'+(h+1)+';pointer-events:none;background:transparent';
            hd.loading = 'lazy';
            hd.setAttribute('draggable', 'false');
            // 加载完成后自动设置opacity（由refreshHD控制）
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
                img.onload = function(){
                  this.style.background = '';
                  // 如果是高清图，加载后交给refreshHD控制可见性
                  if(this.classList.contains('tile-hd')){
                    if(window._refreshHD) window._refreshHD();
                  }
                };
                img.onerror = function(){ this.removeAttribute('src'); };
              }
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '400px' });
        setTimeout(function(){
          document.querySelectorAll('.tile-lazy').forEach(function(img){
            observer.observe(img);
          });
        }, 50);
      }
      // 高清可见性控制：默认隐藏，缩放>=1.5显示
      function refreshHD(){
        var sm = window.scaleM || 1;
        var showHD = sm >= 1.5;
        document.querySelectorAll('.tile-hd').forEach(function(img){
          if(img.src && img.complete && img.naturalWidth > 0){
            img.style.opacity = showHD ? '1' : '0';
            img.style.transition = 'opacity .3s ease';
          } else {
            img.style.opacity = '0';
          }
        });
      }
      window._refreshHD = refreshHD;
      // 挂到ut上
      var orig_ut = window.ut;
      window.ut = function(){
        if(typeof orig_ut === 'function') orig_ut();
        setTimeout(function(){
          if(window._refreshHD) window._refreshHD();
        }, 50);
      };
      // 首次调用
      setTimeout(refreshHD, 200);
      // 每秒检查一次（处理异步加载）
      setInterval(function(){
        var sm = window.scaleM || 1;
        if(sm >= 1.5 && document.querySelector('.tile-hd[src]:not([style*=\"opacity: 1\"])')){
          refreshHD();
        }
      }, 1000);
    })()"""

c = c[:start] + new_script + c[end:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('Done')
print('tile-hd:', c.count('tile-hd'))
print('refreshHD:', c.count('refreshHD'))
print('setInterval:', 'setInterval' in c)
print('拖拽:', 'draggable' in c)
