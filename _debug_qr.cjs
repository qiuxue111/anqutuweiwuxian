var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');

// 删除重复的 supabase 定义（第一个保留新版，删除旧的）
// 当前有两个 supabase 定义：
// 新版: function supabase(t,m,b,f){...if(b){o.body=...;if(token)add auth}...}  
// 旧版: function supabase(t,m,b,f){...if(b)o.body=...if(token)add auth...

// 方法：找到第一个 supabase 到第二个 supabase 之间的结尾
var firstSup=c.indexOf('function supabase');
var secondSup=c.indexOf('function supabase', firstSup+5);
// 旧函数应该在第二处定义，直到逗号结束。往后找最近的连续 `}, `（代码数组元素结尾）
// 旧版 supabase 结尾是: ...});}",
var oldEnd=c.indexOf('});}"', secondSup)+5;
// 删除从 secondSup-1（前一个逗号）到 oldEnd+1（包含后面的逗号）
// 实际上旧版 supabase 后面紧跟着 ", 即 ...});}",\n"
// 第二处 def 是从: ,"function supabase..." 开始
var startOfDup=c.indexOf(',"function supabase', firstSup);
if(startOfDup>=0){
  // 找到旧版 supabase 结束位置
  var endOfOld=c.indexOf('"}",', secondSup);
  if(endOfOld<0) endOfOld=c.indexOf('",' , secondSup+50);
  console.log('Dup from', startOfDup, 'to', endOfOld+2);
  var deleted=c.substring(startOfDup+1, endOfOld+2);
  c=c.replace(deleted, '');
  console.log('Deleted length:', deleted.length);
}

// 确认 getIconUrl 没了，重新插入
if(c.indexOf('getIconUrl')<0){
  var supIdx=c.indexOf('function supabase');
  // 在 supabase 后面插入 getIconUrl
  // 寻找 supabase 定义结束: ...});}"
  var sEnd=c.indexOf('"},"', supIdx);
  if(sEnd<0) sEnd=c.indexOf('",\n"', supIdx+50);
  if(sEnd<0) sEnd=c.indexOf('",', supIdx+100)+2;
  console.log('Insert getIconUrl at', sEnd);
  var insert='",\n  "function getIconUrl(n){var u=iconUrls[n]||\\'\\';return u;}"';
  c=c.substring(0, sEnd) + insert + c.substring(sEnd);
}

// write back
fs.writeFileSync('F:\\暗区突围网站\\_mod01_basics.cjs',c);
console.log('DONE');

// verify
var c2=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');
console.log('supabase count:',(c2.match(/function supabase/g)||[]).length);
console.log('getIconUrl:',c2.indexOf('getIconUrl')>=0?'YES':'NO');
