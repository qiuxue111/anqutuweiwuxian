var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');
// 找到 function supabase 那行，替换整个字符串
// 旧: ...}function supabase(...token)...;}function getIconUrl...
// 新: GET不加Authorization, 只有POST才加

var idx=c.indexOf('function supabase');
var endIdx=c.indexOf('function getIconUrl');
var oldCode=c.substring(idx, endIdx-1); // includes trailing comma

var newCode = "\"function supabase(t,m,b,f){var u='https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+t;var o={method:m||'GET',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok','Content-Type':'application/json'}};if(b){o.body=JSON.stringify(b);if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');}if(f)u+='?'+f;return fetch(u,o).then(function(r){if(r.status===204)return{id:null};if(r.status>=400)throw new Error(r.status);return r.json();});}";

console.log('Old code length:', oldCode.length);
console.log('New code length:', newCode.length);
console.log('Found:', c.indexOf(oldCode)>=0);
if(c.indexOf(oldCode)>=0){
  c=c.replace(oldCode, newCode);
  fs.writeFileSync('F:\\暗区突围网站\\_mod01_basics.cjs',c);
  console.log('REPLACED');
} else {
  console.log('Old code not found exactly. Trying to find it...');
  console.log('Index range:', idx, '-', endIdx);
  console.log('Extracted:', c.substring(idx, idx+100));
}
