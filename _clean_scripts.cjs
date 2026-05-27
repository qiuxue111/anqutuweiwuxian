var fs=require('fs');
// 为每一张地图：删除所有<script>标签，只保留干净的HTML骨架
// 然后一个一个功能模块插入
function cleanupMap(fp){
  var c=fs.readFileSync(fp,'utf8');
  // 删掉所有 <script>...</script> 块
  c=c.replace(/<script>[\s\S]*?<\/script>/g,'');
  // 在 </body> 前面插入空script占位
  c=c.replace('</body>','<script>\n</script>\n</body>');
  fs.writeFileSync(fp,c);
}

var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  cleanupMap('F:\\暗区突围网站\\pages\\'+m+'.html');
  console.log(m+' cleaned');
});
console.log('ALL CLEAN');
