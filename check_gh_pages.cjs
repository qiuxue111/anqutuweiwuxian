process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const https = require('https');
function get(url) {
  return new Promise((res, rej) => {
    https.get(url, {rejectUnauthorized:false}, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
      r.on('error', rej);
    });
  });
}
(async () => {
  const c = await get('https://qiuxue111.github.io/anqutuweiwuxian/pages/review.html');
  const idx = c.indexOf('pins","POST"');
  if (idx < 0) { console.log('not found'); return; }
  const fIdx = c.lastIndexOf('floor', idx);
  console.log('GH Pages review (near pins POST):');
  console.log(c.substring(Math.max(0, idx - 50), idx + 300));
  
  // 检查是否有 floor: 字段
  const hasFloor = c.includes('floor:a.floor');
  console.log('\nhas floor:a.floor:', hasFloor ? '✅' : '❌');
  
  // 检查 renderDels 中是否有 data-floor
  const delsIdx = c.indexOf('renderDels');
  const delsCode = c.substring(delsIdx, delsIdx + 4000);
  const hasDF = delsCode.includes('data-floor');
  const hasDM = delsCode.includes('data-mapname');
  console.log('renderDels data-floor:', hasDF ? '✅' : '❌');
  console.log('renderDels data-mapname:', hasDM ? '✅' : '❌');
})();
