var fs=require('fs');
var pages = [
  {loc: '', name: 'index.html'},
  {loc: 'pages', name: 'maps.html'},
  {loc: 'pages', name: 'gear.html'},
  {loc: 'pages', name: 'strategy.html'},
  {loc: 'pages', name: 'weapons.html'},
  {loc: '', name: 'search.html'},
  {loc: 'pages', name: 'map-farm.html'},
  {loc: 'pages', name: 'map-editor.html'},
  {loc: 'pages', name: 'review.html'}
];

pages.forEach(function(p){
  var fp = 'F:/暗区突围网站/' + p.loc + '/' + p.name;
  var c = fs.readFileSync(fp, 'utf8');
  
  var hasBubble = c.indexOf('bubbleMenu') >= 0;
  var hasSide = c.indexOf('sideMenu') >= 0;
  var hasUserArea = c.indexOf('userArea') >= 0;
  var hasUserAreaOld = c.indexOf('id="userArea"') >= 0 || c.indexOf("id='userArea'") >= 0;
  
  // Find menu container
  var menuType = 'none';
  var menuHTML = '';
  if(hasBubble){
    var st = c.indexOf('bubbleMenu');
    var st2 = c.lastIndexOf('<div', st);
    var end = c.indexOf('</div>', st) + 6;
    menuHTML = c.substring(st2, end);
    menuType = 'bubbleMenu';
  } else if(hasSide){
    var st = c.indexOf('sideMenu');
    var st2 = c.lastIndexOf('<div', st);
    var end = c.indexOf('</div>', st) + 6;
    menuHTML = c.substring(st2, end);
    menuType = 'sideMenu';
  }
  
  var hasHome = menuHTML.indexOf('首页') >= 0 || menuHTML.indexOf('index.html') >= 0;
  var hasLogin = menuHTML.indexOf('登录') >= 0 || menuHTML.indexOf('login') >= 0;
  var hasUserCenter = menuHTML.indexOf('用户中心') >= 0 || menuHTML.indexOf('userCenter') >= 0;
  var hasLogout = menuHTML.indexOf('退出') >= 0 || menuHTML.indexOf('logout') >= 0;
  
  console.log(p.name + ':');
  console.log('  menu: ' + menuType + ' | userArea: ' + (hasUserArea?'yes':'no') + ' | home: ' + (hasHome?'yes':'no'));
  console.log('  menu items - userCenter: ' + (hasUserCenter?'yes':'no') + ' logout: ' + (hasLogout?'yes':'no'));
  if(menuHTML){
    console.log('  menu HTML: ' + menuHTML.replace(/\n/g,'').substring(0,200).replace(/\s+/g,' '));
  }
  console.log('');
});
