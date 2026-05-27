const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const scriptIdx = c.lastIndexOf('<script');
const scriptEnd = c.lastIndexOf('</script>') + 9;
console.log(c.substring(scriptIdx, scriptEnd));
