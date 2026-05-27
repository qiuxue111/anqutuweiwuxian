const https = require('https');
https.get('https://qiuxue111.github.io/anqutuweiwuxian/pages/map-farm.html', function(r) {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', function() {
    const m = d.match(/SUPABASE_ANON_KEY="([^"]+)"/);
    console.log('GitHub Pages key:', m ? m[1].substring(0, 40) + '...' : 'NOT FOUND');
    console.log('Status:', r.statusCode);
    if (m) {
      // Test this key
      https.get('https://hanrfbciinkhgcumvous.supabase.co/rest/v1/pins?limit=1', {
        headers: {
          apikey: m[1],
          Authorization: 'Bearer ' + m[1]
        }
      }, function(r2) {
        let d2 = '';
        r2.on('data', c => d2 += c);
        r2.on('end', () => console.log('Key test:', r2.statusCode, d2.substring(0, 100)));
      });
    }
  });
});
