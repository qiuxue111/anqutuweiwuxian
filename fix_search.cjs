const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\search.html', 'utf8');

const cleanScript = `<script>
    // 页面加载后自动显示所有分类作为预览
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        renderResults(searchIndex.slice(0, 8), "search-results");
      }, 300);
    });

function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u="https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to="+encodeURIComponent(cb);
  window.location.href=u;
}
(function authCheck(){
  var h=window.location.hash;
  if(h&&h.includes("access_token=")){
    var p=new URLSearchParams(h.replace("#",""));
    var t=p.get("access_token");
    if(t){
      try{
        var payload=JSON.parse(atob(t.split(".")[1]));
        localStorage.setItem("abi_token",t);
        localStorage.setItem("abi_user",payload.email||payload.user_metadata?.email||"");
        history.replaceState(null,"",window.location.pathname);
      }catch(err){}
    }
  }
  var token=localStorage.getItem("abi_token");
  if(token){
    document.querySelectorAll("#loginBtn").forEach(function(b){b.style.display="none"});
  }
})();
  </script>`;

const sIdx = c.indexOf('<script>');
const eIdx = c.indexOf('</script>', sIdx) + 9;
c = c.substring(0, sIdx) + cleanScript + c.substring(eIdx);
fs.writeFileSync('F:\\暗区突围网站\\search.html', c);
console.log('search.html fixed');

// Validate all scripts
['F:\\暗区突围网站\\index.html','F:\\暗区突围网站\\search.html'].forEach(fp => {
  const c2 = fs.readFileSync(fp, 'utf8');
  const scripts = c2.match(/<script>([\s\S]*?)<\/script>/g) || [];
  scripts.forEach(s => {
    try { new Function(s.replace('<script>','').replace('</script>','')); console.log(fp + ': VALID'); }
    catch(e) { console.log(fp + ': ERROR - ' + e.message.substring(0,80)); }
  });
});
