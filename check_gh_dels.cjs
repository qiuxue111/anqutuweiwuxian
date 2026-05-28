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
  const c = await get('https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/pages/review.html');
  
  // 找 renderDels 中的 view-on-map-btn
  const rlIdx = c.indexOf('renderDels');
  const renderDels = c.substring(rlIdx, rlIdx + 4000);
  
  const btnIdx = renderDels.indexOf('view-on-map-btn');
  if (btnIdx >= 0) {
    console.log('renderDels btn template:');
    console.log(renderDels.substring(btnIdx - 30, btnIdx + 500));
    
    const hasFloor = renderDels.includes('data-floor');
    const hasMapName = renderDels.includes('data-mapname');
    console.log('\ndata-floor:', hasFloor ? '✅' : '❌');
    console.log('data-mapname:', hasMapName ? '✅' : '❌');
  }
})();
