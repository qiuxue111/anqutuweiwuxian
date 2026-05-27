const fs = require('fs');
const root = 'F:\\暗区突围网站';
const pages = ['index.html', 'search.html', 'pages/maps.html', 'pages/weapons.html', 'pages/strategy.html', 'pages/gear.html',
  'pages/map-farm.html', 'pages/map-beishan.html', 'pages/map-valley.html', 'pages/map-armory.html', 'pages/map-airport.html', 'pages/map-tvstation.html'];

pages.forEach(function(fp) {
  fp = root + '\\' + fp.replace(/\//g, '\\');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');

  // Add a safety check 500ms after page load
  var safetyCode = `
  // Safety: force check login state after 500ms
  setTimeout(function(){
    var token=localStorage.getItem('abi_token');
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(token){
      if(un){un.style.display='';un.textContent=localStorage.getItem('abi_user')||'已登录';}
      if(lb)lb.style.display='none';
    }else{
      if(un)un.style.display='none';
      if(lb)lb.style.display='';
    }
  },500);
`;

  // Insert before closing script tag
  var closeIdx = c.lastIndexOf('</script>');
  if (closeIdx >= 0) {
    c = c.substring(0, closeIdx) + safetyCode + c.substring(closeIdx);
  }

  fs.writeFileSync(fp, c);
  console.log(fp + ': safety check added');
});

console.log('Done');
