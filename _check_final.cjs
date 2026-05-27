var fs=require('fs');
var files = ['maps.html','gear.html','strategy.html','weapons.html','search.html'];
var base = 'F:/暗区突围网站/';
files.forEach(function(f){
  var fp = base + (f==='search.html'?'':'pages/') + f;
  var c = fs.readFileSync(fp, 'utf8');
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    var s=ms[0].replace(/<\/?script>/g,'');
    var ob=s.split('{').length-1, cb=s.split('}').length-1;
    var op=s.split('(').length-1, cp=s.split(')').length-1;
    var ok = ob===cb && op===cp;
    console.log(f+': {'+ob+'}={\''+cb+'} ('+op+')='+cp+' '+(ok?'OK':'FAIL'));
  }
  console.log('  bubbleMenu: '+(c.indexOf('bubbleMenu')>=0)+' sideMenu: '+(c.indexOf('sideMenu')>=0));
  console.log('  home: '+(c.indexOf('首页')>=0||c.indexOf('index.html')>=0)+' reviewBtn: '+(c.indexOf('reviewBtn')>=0));
});
