const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
console.log('Size:', c.length);
const maps = ['beishan','valley','armory','farm','airport','tvstation'];
maps.forEach(function(m) {
  console.log('  ' + m + ': videos=' + c.includes('id="videos-' + m + '"') + ', btn=' + c.includes("openVideoForm('" + m));
});
console.log('Login btns:', c.split('id="loginBtn"').length - 1);
console.log('军械库:', c.includes('军械库<span'));
console.log('Header subtitle:', c.includes('每张地图'));
console.log('🗺?', c.includes('🗺?'));
