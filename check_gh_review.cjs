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
  const idx = c.indexOf('supabase("pins","POST"');
  if (idx < 0) { console.log('NOT FOUND - checking gh-pages...'); return; }
  console.log('FOUND at', idx);
  console.log(c.substring(idx, idx + 400));
})();
