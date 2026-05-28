const fs = require('fs');

// 检查所有地图页面的全套 floor 相关代码
const pages = ['farm','beishan','valley','armory','airport','tvstation'];
const withFloor = ['beishan','armory','airport','tvstation'];

console.log('=== 1. currentFloor 初始化 ===');
withFloor.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('var currentFloor');
  const semicolon = c.indexOf(';', idx);
  console.log(e, ':', c.substring(idx, semicolon + 1));
});

console.log('\n=== 2. switchFloor 函数 ===');
withFloor.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('function switchFloor');
  const end = c.indexOf('}', c.indexOf('}', idx) + 1);
  const fn = c.substring(idx, end+1);
  // 检查 currentFloor 赋值
  const hasAssign = fn.includes('currentFloor =');
  // 检查过滤方式
  const hasFilter = fn.includes('filterPinsByFloor');
  const hasInline = fn.includes('pf===');
  console.log(e, ':', hasAssign ? '✅ 赋值' : '❌ 赋值', hasFilter ? '✅ filterPinsByFloor' : '', hasInline ? '✅ 内联' : '');
});

console.log('\n=== 3. placePin 中的 var cf=  ===');
withFloor.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('function placePin');
  const fnEnd = c.indexOf('function renderMarkers', idx);
  const fn = c.substring(idx, fnEnd > idx ? fnEnd : idx + 5000);
  const cfIdx = fn.indexOf('var cf=');
  if (cfIdx >= 0) {
    const semi = fn.indexOf(';', cfIdx);
    console.log(e, ':', fn.substring(cfIdx, semi+1));
  } else {
    console.log(e, ':', '❌ 无 var cf=');
    // 直接找 floor:cf
    const flIdx = fn.indexOf('floor:cf');
    if (flIdx >= 0) console.log(e, '  floor:cf附近:', fn.substring(Math.max(0,flIdx-30), flIdx+20));
  }
});

console.log('\n=== 4. pending_pins POST 中是否包含 floor ===');
pages.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf("pending_pins','POST'");
  const end = c.indexOf("})", idx);
  const block = c.substring(idx, end+3);
  const hasFloor = block.includes('floor');
  console.log(e, ':', hasFloor ? '✅ 有 floor' : '❌ 无 floor');
  if (hasFloor) {
    // 提取具体的 floor 值
    const flIdx = block.indexOf('floor');
    console.log('  floor来源:', block.substring(flIdx, flIdx+15));
  }
});

console.log('\n=== 5. 提交成功后的跳转URL是否带floor ===');
pages.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf("deletion_requests','POST'");
  const end = c.indexOf("})", idx);
  const block = c.substring(idx, end+3);
  // 在 then 回调后找 var u=
  const after = c.substring(idx, idx + 2000);
  const vu = after.indexOf('var u=');
  if (vu >= 0) {
    const semi = after.indexOf(';', vu);
    const url = after.substring(vu, semi);
    const hasFloor = url.includes('floor');
    const correctMap = url.includes('map-'+e+'.html');
    console.log(e, ':', correctMap ? '✅ 地图正确' : '❌ 地图', hasFloor ? '✅ 有floor' : '❌ 无floor');
  }
});

console.log('\n=== 6. loadCloudPins → cloudPins = d ===');
withFloor.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('function loadCloudPins');
  const end = c.indexOf('\nfunction', idx + 20);
  const fn = c.substring(idx, end > idx ? end : idx + 3000);
  const hasPinSet = fn.includes('cloudPins=d');
  console.log(e, ':', hasPinSet ? '✅ cloudPins=d' : '❌');
});

console.log('\n=== 7. loadCloudMarkers → pins.push 是否带 floor ===');
withFloor.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('function loadCloudMarkers');
  const end = c.indexOf('\nfunction', idx + 20);
  const fn = c.substring(idx, end > idx ? end : idx + 3000);
  const pushIdx = fn.indexOf('.push(');
  if (pushIdx >= 0) {
    const pushEnd = fn.indexOf(');', pushIdx);
    const pushBlock = fn.substring(pushIdx, pushEnd + 3);
    const hasFloor = pushBlock.includes('floor:');
    console.log(e, ':', hasFloor ? '✅ 有 floor:' : '❌ 无 floor');
    // 显示完整的 push
    console.log('  ', pushBlock);
  }
});

console.log('\n=== 8. renderMarkers 中 pf 赋值 ===');
withFloor.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('function renderMarkers');
  const end = c.indexOf('function showPinDetail', idx);
  const fn = c.substring(idx, end > idx ? end : idx + 5000);
  const pfIdx = fn.indexOf('pf=');
  if (pfIdx >= 0) {
    const semi = fn.indexOf(';', pfIdx);
    const assign = fn.substring(pfIdx, semi+1);
    console.log(e, ':', assign);
  }
  // 检查 display=pf=== 的写法
  const dpIdx = fn.indexOf('display=pf===');
  if (dpIdx >= 0) {
    const semi2 = fn.indexOf(';', dpIdx);
    console.log(e, '  display:', fn.substring(dpIdx, semi2+1));
  }
});
