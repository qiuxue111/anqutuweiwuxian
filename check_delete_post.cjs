const fs = require('fs');
// 检查所有地图页面的删除请求POST
['beishan','tvstation','armory','airport','farm','valley'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf("deletion_requests','POST'");
  if (idx < 0) { console.log(eng + ': no POST'); return; }
  const end = c.indexOf("})", idx);
  console.log(eng + ':', c.substring(idx, end + 3));
});
