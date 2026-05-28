const fs = require('fs');
['farm','beishan','valley','armory','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const title = c.match(/<title>([^<]+)<\/title>/);
  const h1 = c.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log(`${e}: title="${title?.[1]}" h1="${h1?.[1]}"`);
});
