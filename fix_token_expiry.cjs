const fs = require('fs');

function fixSupabase(fp) {
  let c = fs.readFileSync(fp, 'utf8');
  
  // Replace the token line: if token exists AND hasn't expired, use it; otherwise use anon key
  const old = 'var token=localStorage.getItem("abi_token")||SUPABASE_ANON_KEY;';
  const nu = `var tk=localStorage.getItem("abi_token");
  var token=SUPABASE_ANON_KEY;
  if(tk){
    try{
      var p=JSON.parse(atob(tk.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
      if(p.exp&&p.exp*1000>Date.now())token=tk;
    }catch(e){}
  }`;
  
  if (c.includes(old)) {
    c = c.replace(old, nu);
    fs.writeFileSync(fp, c);
    console.log(fp.split('\\').pop() + ': fixed');
  } else {
    console.log(fp.split('\\').pop() + ': pattern not found');
  }
}

fixSupabase('F:\\暗区突围网站\\pages\\map-farm.html');
fixSupabase('F:\\暗区突围网站\\pages\\review.html');
