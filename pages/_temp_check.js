
/* 彩虹加载条动画 */
(function(){
  var bar = document.getElementById('loadingBar');
  if(!bar) return;
  var pos = 0;
  setInterval(function(){
    pos = (pos + 5) % 400;
    bar.style.backgroundPosition = pos + '% 0%';
  }, 30);
})();
