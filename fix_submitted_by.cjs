const fs = require('fs');
const pages = ['farm','beishan','valley','armory','airport','tvstation'];

pages.forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  
  // 在 pending_pins POST 中加入 submitted_by:uname
  c = c.replace(
    "{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[],floor:cf",
    "{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[],floor:cf,submitted_by:uname"
  );
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(eng + ': ✅ added submitted_by');
});
