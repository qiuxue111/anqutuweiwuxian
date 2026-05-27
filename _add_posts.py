import re

files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

common_js = '''
var SUPABASE_URL='https://hanrfbciinkhgcumvous.supabase.co';
var SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';

function db(method,table,body,query){
  return fetch(SUPABASE_URL+'/rest/v1/'+table+(query?'?'+query:''),{
    method:method,
    headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}

function esc(s){
  if(!s)return'';
  var d=document.createElement('div');
  d.appendChild(document.createTextNode(s||''));
  return d.innerHTML;
}

async function loadPosts(){
  try{
    var r=await db('GET','map_posts',null,'order=created_at.desc&limit=50');
    if(!r.ok)throw new Error(r.status);
    var posts=await r.json();
    var el=document.getElementById('postList');
    if(!posts||posts.length===0){
      el.innerHTML='<div class="no-posts">暂无帖子，快点来发第一条吧！</div>';
      return;
    }
    el.innerHTML=posts.map(function(p){
      var prev=(p.content||'').substring(0,150);
      var cat=p.category||'general';
      var catNames={'general':'杂谈','question':'问答','guide':'攻略','showoff':'炫耀'};
      var cn=catNames[cat]||'杂谈';
      var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
      var imgs = p.images ? JSON.parse(p.images) : [];
      var imgHTML = imgs.length ? '<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">'+imgs.map(function(url){
        return '<img src="'+url+'" style="max-width:200px;max-height:150px;border-radius:6px;object-fit:cover;cursor:pointer;" onclick="window.open(this.src)">';
      }).join('')+'</div>' : '';
      return '<div class="post-card"><h3><a href="#">'+esc(p.title||'无标题')+'</a></h3>'+
        '<div class="meta"><span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:'+hue+'22;color:'+hue+';">'+cn+'</span>'+
        '<span>'+esc(p.author||'匿名')+'</span>'+
        '<span>'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span></div>'+
        '<div class="preview">'+esc(prev)+(prev.length>=150?'...':'')+'</div>'+
        imgHTML+'</div>';
    }).join('');
  }catch(e){
    var el2=document.getElementById('postList');
    if(el2)el2.innerHTML='<div class="no-posts">加载失败，请刷新重试</div>';
  }
}

async function submitPost(){
  var title=document.getElementById('postTitle').value.trim();
  var content=document.getElementById('postContent').value.trim();
  if(!title||!content){alert('标题和内容不能为空');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var user=localStorage.getItem('abi_user');
  var author='匿名';
  try{author=JSON.parse(user).user_metadata.preferred_username||JSON.parse(user).email||'匿名';}catch(e){}
  
  // Upload images if any
  var fileInput=document.getElementById('postImages');
  var images=[];
  if(fileInput&&fileInput.files.length>0){
    for(var i=0;i<fileInput.files.length;i++){
      var f=fileInput.files[i];
      if(!f.type.startsWith('image/')){alert('只支持图片文件');return;}
      if(f.size>5*1024*1024){alert('单张图片不能超过5MB');return;}
      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+Date.now()+'_'+f.name,{
          method:'POST',
          headers:{'Authorization':'Bearer '+token,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+Date.now()+'_'+f.name);
        }
      }catch(e){console.error('Upload failed',e);}
    }
  }
  
  try{
    var cat=document.getElementById('postCategory');
    var category=cat?cat.value:'general';
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts',{
      method:'POST',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({
        title:title, content:content, category:category,
        author:author, images:images.length?JSON.stringify(images):null
      })
    });
    if(!r.ok){var err=await r.json();alert('发布失败: '+(err.message||r.status));return;}
    document.getElementById('postTitle').value='';
    document.getElementById('postContent').value='';
    if(fileInput)fileInput.value='';
    var pf=document.getElementById('postForm');
    if(pf)pf.style.display='none';
    loadPosts();
  }catch(e){alert('发布失败: '+e.message);}
}

function fabOpenPostForm(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var pf=document.getElementById('postForm');
  if(pf)pf.style.display=pf.style.display==='none'?'block':'none';
}

// Auto-load on DOM ready
document.addEventListener('DOMContentLoaded',function(){
  var token=localStorage.getItem('abi_token');
  var hint=document.getElementById('loginHint');
  var fab=document.querySelector('[id^=fabBtn]');
  if(hint)hint.style.display=token?'none':'block';
  if(fab)fab.style.display=token?'inline-flex':'none';
  loadPosts();
});
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. Check if already has the JS added
    if 'SUPABASE_URL' in c and c.index('SUPABASE_URL') < c.index('</script>'):
        print(fp.split('/')[-1] + ': already has post JS - skip')
        continue
    
    # 2. Find the script block and append JS before </script>
    # There should be only one <script> block at the end
    scripts = re.findall(r'<script>([\s\S]*?)</script>', c)
    if not scripts:
        print(fp.split('/')[-1] + ': no script found - skip')
        continue
    
    last_script = scripts[-1]
    script_start = c.rfind('<script>')
    script_end = c.rfind('</script>')
    
    # Append our common JS inside the last script
    c = c[:script_end] + '\n' + common_js + '\n' + c[script_end:]
    
    # 3. Add image input to the post form
    old_form_end = '<button onclick="submitPost()">发布</button>\n  </div>'
    new_form_end = '<input id="postImages" type="file" accept="image/*" multiple style="padding:0.4rem;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:6px;margin-bottom:0.8rem;font-size:0.85rem;">\n    <button onclick="submitPost()">发布</button>\n  </div>'
    c = c.replace(old_form_end, new_form_end)
    
    # 4. Add post-images CSS
    img_css = '.post-card .post-images{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}\n    .post-card .post-images img{max-width:180px;max-height:140px;border-radius:6px;object-fit:cover;cursor:pointer;border:1px solid #1e1e2a;}\n    .post-card .post-images img:hover{border-color:#ffc832;}'
    # Insert before </style> if exists
    st_idx = c.rfind('</style>')
    if st_idx >= 0:
        c = c[:st_idx] + img_css + '\n  ' + c[st_idx:]
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': post system added')

print('ALL DONE')
