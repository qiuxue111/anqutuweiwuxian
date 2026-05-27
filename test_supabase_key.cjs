const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
const key = c.match(/SUPABASE_ANON_KEY="([^"]+)"/)[1];
console.log('Testing key:', key.substring(0,40)+'...');

const https = require('https');
const opts = {
  hostname: 'hanrfbciinkhgcumvous.supabase.co',
  path: '/rest/v1/pins?limit=1',
  method: 'GET',
  headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
};
const req = https.request(opts, function(res) {
  let d = '';
  res.on('data', function(c) { d += c; });
  res.on('end', function() {
    console.log('Status:', res.statusCode, res.statusMessage);
    console.log('Body:', d.substring(0, 300));
  });
});
req.on('error', function(e) { console.log('Error:', e.message); });
req.end();
