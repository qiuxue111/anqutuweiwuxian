const fs = require('fs');
['beishan','tvstation','armory','airport'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf('function loadCloudPins');
  const end = c.indexOf('\nfunction', idx + 20);
  const fn = c.substring(idx, end > idx ? end : idx + 4000);
  
  // 找到 pins 数据处理的地方
  const supabaseIdx = fn.indexOf('supabase');
  if (supabaseIdx >= 0) {
    // 看 then 里面怎么赋值 floor
    const after = fn.substring(supabaseIdx, fn.length);
    // 找 floor 相关
    const dataIdx = after.indexOf('data.forEach');
    if (dataIdx >= 0) console.log(`${eng} data.forEach:`, after.substring(dataIdx, dataIdx + 300));
  }
});
