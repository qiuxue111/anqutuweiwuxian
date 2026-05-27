var fs=require('fs');
var fp='F:/暗区突围网站/pages/gear.html';
var c=fs.readFileSync(fp,'utf8');

// 1. Fix db(): add Authorization Bearer for authenticated POST/PATCH
c=c.replace(
  "headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}",
  "headers:{'Authorization':'Bearer '+(localStorage.getItem('abi_token')||SUPABASE_ANON),'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}"
);

// 2. Fix submitPost author: use getUserName()
c=c.replace(
  "author:localStorage.getItem('abi_user')||'匿名'",
  "author:getUserName()||'匿名'"
);

// 3. Verify
var ms=c.match(/<script>[\s\S]*?<\/script>/g);
var ok=true;
(ms||[]).forEach(function(m,i){
  try{new Function(m.replace(/<\/?script>/g,''));}
  catch(e){console.log('Script '+i+': FAIL - '+e.message);ok=false;}
});
if(ok) console.log('gear.html: ALL PARSE OK');

fs.writeFileSync(fp,c,'utf8');
console.log('gear.html: FIXED');
