process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const https = require('https');
https.get('https://qiuxue111.github.io/anqutuweiwuxian/pages/review.html', {rejectUnauthorized:false}, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const fs = require('fs');
    fs.writeFileSync('C:\\Users\\Administrator\\AppData\\Local\\Temp\\gh_review2.html', d, 'utf-8');
    const idx = d.indexOf('pins","POST"');
    if (idx >= 0) {
      const hasFloor = d.includes('floor:a.floor');
      console.log('GH Pages has floor:a.floor:', hasFloor ? 'YES' : 'NO');
      console.log('POST body:', d.substring(idx, idx + 300));
      
      // 也检查 map 页面的 placePin 中 floor:cf 是否存在
      console.log('\nContains floor:cf in page:', d.includes('floor:cf'));
    } else {
      console.log('pins POST not found');
      // 显示文件开头判断是不是 review.html
      console.log('First 200 chars:', d.substring(0, 200));
    }
  });
}).on('error', e => console.log('Error:', e.message));
