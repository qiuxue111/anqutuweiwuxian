var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  // Add review link after "用户中心", before "退出登录"
  var old='<a href="#" onclick="showUserCenter()" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F464; 用户中心</a>';
  var neww='<a href="review.html" id="reviewBtnMM" style="display:none;padding:10px 12px;color:#88aaff;border-radius:6px;text-decoration:none;font-size:0.95rem;">✅ 审核中心</a>\n        '+old;
  if(c.indexOf(neww)>=0){
    console.log(m+': already has reviewBtn');
    return;
  }
  if(c.indexOf(old)>=0){
    c=c.replace(old, neww);
    fs.writeFileSync(fp,c);
    console.log(m+': added reviewBtn');
  } else {
    console.log(m+': user center not found');
  }
});
console.log('DONE');
