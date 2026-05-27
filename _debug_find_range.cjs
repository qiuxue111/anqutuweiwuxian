var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');
// 找到并替换 supabase 定义，保留 getIconUrl
// 旧结构:
//   "function supabase(t,m,b,f){var u='...';...if(b)o.body=...;if(localStorage.getItem(...))o.headers[...]=...;return fetch(u,o).then(function(r){...});}",
//   "function getIconUrl(n){...}",

// 搜索超长一次性 supabase 定义字符串
var idx=c.indexOf('function supabase');
var idxGIU=c.indexOf('function getIconUrl', idx);
console.log('supabase at', idx, 'getIconUrl at', idxGIU);
console.log('Segment:', c.substring(idx, idxGIU+40));
