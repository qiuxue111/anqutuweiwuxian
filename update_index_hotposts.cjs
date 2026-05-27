const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');

// 1. Find the weapons section (now 帖子) and replace with hot posts
const weaponsStart = c.indexOf('id="weapons"');
const weaponsEnd = c.indexOf('id="gear"');
const weaponsSection = c.substring(weaponsStart, weaponsEnd);

console.log('Weapons section found at', weaponsStart, 'length', weaponsSection.length);

const hotPostsHTML = `id="hot-posts">
  <h2>📌 热门帖子</h2>
  <p class="subtitle">最新的帖子动态</p>
  <div id="hotPostList" style="display:flex;flex-direction:column;gap:0.8rem;margin-bottom:2rem;">
    <div style="text-align:center;color:#666;padding:2rem;">加载中...</div>
  </div>
  <div style="text-align:center;margin-top:1rem;">
    <a href="pages/weapons.html" style="display:inline-block;padding:0.5rem 1.5rem;background:#1a1a22;color:#ffc832;border:1px solid #333;border-radius:8px;text-decoration:none;font-size:0.9rem;">查看全部帖子 →</a>
  </div>`;

c = c.substring(0, weaponsStart) + hotPostsHTML + c.substring(weaponsEnd);

// 2. Replace the gear section title
c = c.replace('攻略推荐', '装备推荐');

// 3. Replace hero text
c = c.replace('帖子改装 · 战术闲聊 · 攻略推荐', '热门帖子 · 闲聊 · 攻略');

// 4. Add supabase.js before </body> if not there
if (!c.includes('supabase.js')) {
  c = c.replace('</body>', '<script src="supabase.js"></script>\n</body>');
}

// 5. Add inline script for hot posts loading
const scriptTag = `<script>
async function loadHotPosts(){
  try{
    var key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
    var r=await fetch('https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_posts?order=created_at.desc&limit=5',{
      headers:{'Authorization':'Bearer '+key,'apiKey':key}
    });
    if(!r.ok)throw new Error(r.status);
    var posts=await r.json();
    if(!Array.isArray(posts)||posts.length===0){
      document.getElementById('hotPostList').innerHTML='<div style="text-align:center;color:#666;padding:2rem;">还没有帖子，<a href="pages/weapons.html" style="color:#ffc832;">去发布第一条</a></div>';
      return;
    }
    var html='';
    posts.forEach(function(p){
      var preview=(p.content||'').substring(0,150);
      if((p.content||'').length>150)preview+='...';
      html+='<div style="background:#12121a;border:1px solid #1e1e2a;border-radius:10px;padding:1rem;">'+
        '<h3 style="margin:0 0 0.3rem 0;font-size:1rem;"><a href="pages/weapons.html" style="color:#ffc832;text-decoration:none;">'+esc(p.title||'无标题')+'</a></h3>'+
        '<div style="color:#666;font-size:0.8rem;margin-bottom:0.4rem;display:flex;gap:1rem;">'+
        '<span>'+esc(p.author||'匿名')+'</span><span>'+esc(p.category||'杂谈')+'</span>'+
        '<span>'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span></div>'+
        '<div style="color:#aaa;font-size:0.85rem;line-height:1.5;">'+esc(preview)+'</div></div>';
    });
    document.getElementById('hotPostList').innerHTML=html;
  }catch(e){
    document.getElementById('hotPostList').innerHTML='<div style="text-align:center;color:#666;padding:2rem;">加载失败</div>';
  }
}
function esc(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s||''));return d.innerHTML;}
document.addEventListener('DOMContentLoaded',loadHotPosts);
</script>`;

c = c.replace('</body>', scriptTag + '\n</body>');

fs.writeFileSync('F:\\暗区突围网站\\index.html', c);
console.log('index.html updated. Size:', c.length);
