var fs=require('fs');
// 模块1: 全局状态 + zoom/pan + helpers
var code = [
  "var scaleM=1,panX=0,panY=0,mode='browse',pins=[],mapComments=[],curPinIdx=null,touchStartDist=0,touchStartScale=1;",
  // 登录状态获取用户名（自动兼容旧格式）
  "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}",
  "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.user_metadata&&u.user_metadata.user_name||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}",
  // 页面加载时更新登录 UI
  "(function(){normalizeUser();var t=localStorage.getItem('abi_token');var un=document.getElementById('userName');var lb=document.getElementById('loginBtn');var rb=document.getElementById('reviewBtnMM');if(t&&un){un.style.display='inline';un.textContent=getUserName();}if(t&&lb)lb.style.display='none';if(rb)rb.style.display=t?'block':'none';setTimeout(function(){normalizeUser();var t2=localStorage.getItem('abi_token');var un2=document.getElementById('userName');var lb2=document.getElementById('loginBtn');var rb2=document.getElementById('reviewBtnMM');if(t2&&un2){un2.style.display='inline';un2.textContent=getUserName();}if(t2&&lb2)lb2.style.display='none';if(rb2)rb2.style.display=t2?'block':'none';},500);})();",
  // Auth 回调处理 — 同时支持 # 和 ?，统一 JSON 格式
  "if((window.location.hash||'').indexOf('access_token')>=0||(window.location.search||'').indexOf('access_token')>=0){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/,'');var p={};raw.split('&').forEach(function(s){var kv=s.split('=');p[kv[0]]=decodeURIComponent(kv[1]||'');});if(p.access_token){localStorage.setItem('abi_token',p.access_token);try{var b64=p.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');while(b64.length%4)b64+='=';var u=JSON.parse(atob(b64));localStorage.setItem('abi_user',JSON.stringify(u));}catch(e){localStorage.setItem('abi_user','{\"user_metadata\":{\"preferred_username\":\"User\"}}');}history.replaceState(null,'',window.location.pathname+window.location.search);window.location.href=window.location.pathname+window.location.search;}}catch(e){console.error('Auth err',e);}}",
  "var mapNameEng='MAP_ENG',mapNameCN='MAP_CN',cloudPins=[],cloudComments=[];",
  // 全局审核入口显示
  "function checkReviewBtn(){var rb=document.getElementById('reviewBtnMM');if(!rb)return;if(localStorage.getItem('abi_token')){rb.style.display='block';}else{rb.style.display='none';}}",
  "var iconUrls="+JSON.stringify({
    "保险箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%BF%9D%E9%99%A9.png",
    "滴滴保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%BB%B4%E6%BB%B4%E4%BF%9D%E9%99%A9.png",
    "电子保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%94%B5%E5%AD%90%E4%BF%9D%E9%99%A9.png",
    "收银机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%94%B6%E9%93%B6%E6%9C%BA.png",
    "家用机箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AE%B6%E7%94%A8%E6%9C%BA%E7%AE%B1.png",
    "军用主机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%86%9B%E7%94%A8%E4%B8%BB%E6%9C%BA.png",
    "普通物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%BD%AE%E7%89%A9%E7%AE%B1.png",
    "高级物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%BB%91%E7%BD%AE%E7%89%A9%E7%AE%B1.png",
    "子弹箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AD%90%E5%BC%B9%E7%AE%B1.png",
    "手雷箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%89%8B%E9%9B%B7%E7%AE%B1.png",
    "医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E7%BA%A7%E5%8C%BB%E7%96%97.png",
    "高级医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%8C%BB%E7%96%97.png",
    "工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B7%A5%E5%85%B7%E7%AE%B1.png",
    "高级工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%B7%A5%E5%85%B7%E7%AE%B1.png",
    "文件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%96%87%E4%BB%B6%E7%AE%B1.png",
    "大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E8%A1%A3.png",
    "蓝色大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%93%9D%E9%A2%86.png",
    "衣服":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E8%A1%A3%E6%9C%8D.png",
    "抽屉":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%8A%BD%E5%B1%89.png",
    "刮刮乐":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%88%AE%E5%88%AE%E4%B9%90.png",
    "运动包":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%BF%90%E5%8A%A8%E5%8C%85.png",
    "旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png",
    "白色旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%99%BD%E6%97%85.png",
    "商务旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png",
    "大型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
    "中型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
    "木质武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%9C%A8%E8%B4%A8%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
    "武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
    "高级武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
    "配件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%85%8D%E4%BB%B6%E7%AE%B1.png"
  })+";",
  "function getIconUrl(n){var u=iconUrls[n]||'';return u;}",
  // supabase: GET uses only apikey, POST/PATCH adds Bearer token if logged in
  "function supabase(t,m,b,f){var u='https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+t;var o={method:m||'GET',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok','Content-Type':'application/json'}};if(b){o.body=JSON.stringify(b);if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');}if(f)u+='?'+f;return fetch(u,o).then(function(r){if(r.status>=400)throw new Error(r.status);return r.text().then(function(t){if(!t)return{};return JSON.parse(t);});});}",
  // Supabase Auth: GitHub OAuth (handles the callback itself, no backend needed)
  "function loginGitHub(){var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var isMap=i>=0;var cb=window.location.origin+(isMap?p.substring(0,i+1):p.replace(/index\.html$/,''))+'index.html';window.location.href='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);}",
  // 退出登录
  "function logout(){localStorage.removeItem('abi_token');localStorage.removeItem('abi_user');window.location.reload();}",
  "function ut(){var el=document.getElementById('mv');if(!el)return;el.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';try{renderMarkers();}catch(e){}}",
  "function zoom(f,cx,cy){if(cx===void 0||cy===void 0){scaleM*=f;if(scaleM<0.1)scaleM=0.1;if(scaleM>10)scaleM=10;ut();return;}var prev=scaleM;scaleM*=f;if(scaleM<0.1)scaleM=0.1;if(scaleM>10)scaleM=10;var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/prev,imgY=(my-panY)/prev;panX=mx-imgX*scaleM;panY=my-imgY*scaleM;ut();}",
  "function zoomTo(v,cx,cy){v=v/100;if(v<0.1)v=0.1;if(v>10)v=10;if(cx!==void 0&&cy!==void 0){var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/scaleM,imgY=(my-panY)/scaleM;panX=mx-imgX*v;panY=my-imgY*v;}scaleM=v;ut();}",
  "function resetView(){scaleM=1;panX=0;panY=0;var e=document.getElementById('mv');if(e)e.style.transform='translate(0px,0px) scale(1)';var zr=document.getElementById('zr');if(zr)zr.value=100;var zl=document.getElementById('zl');if(zl)zl.textContent='100%';}"
];

var full=code.join('\n');
var op=(full.match(/\(/g)||[]).length;
var cp=(full.match(/\)/g)||[]).length;
var ob=(full.match(/\{/g)||[]).length;
var cb=(full.match(/\}/g)||[]).length;
console.log('module1: ('+op+'='+cp+') {'+ob+'='+cb+'} '+(op===cp&&ob===cb?'OK':'FAIL'));
if(op!==cp||ob!==cb){console.log('FAIL - abort');process.exit(1);}

var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
var mapEngs={'map-farm':'farm','map-beishan':'beishan','map-valley':'valley','map-armory':'armory','map-airport':'airport','map-tvstation':'tvstation'};
var mapCns={'map-farm':'农场','map-beishan':'北山','map-valley':'山谷','map-armory':'军械库','map-airport':'电视台','map-tvstation':'阿贾克斯港口'};

maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  var inject=full
    .replace("mapNameEng='MAP_ENG'", "mapNameEng='"+mapEngs[m]+"'")
    .replace("mapNameCN='MAP_CN'", "mapNameCN='"+mapCns[m]+"'");
  c=c.replace('</script>', inject+'\n</script>');
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('module1 DONE');
