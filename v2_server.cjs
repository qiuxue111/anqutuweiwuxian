const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'F:\\暗区突围网站\\v2';
const mime = {'html':'text/html','js':'text/javascript','css':'text/css','png':'image/png','jpg':'image/jpeg','ico':'image/x-icon'};

http.createServer(function(req, res) {
  try {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';
    if (url.endsWith('/')) url += 'index.html';
    
    const fp = root + url.replace(/\//g, '\\');
    const c = fs.readFileSync(fp);
    const ext = path.extname(fp).slice(1);
    res.writeHead(200, {
      'Content-Type': mime[ext] || 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(c);
    console.log('200', req.url);
  } catch(e) {
    res.writeHead(404);
    res.end('Not Found: ' + req.url);
    console.log('404', req.url);
  }
}).listen(8086, function() {
  console.log('✅ v2 server running at http://localhost:8086');
});
