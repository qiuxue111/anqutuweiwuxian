files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

# Post form modal HTML
post_modal_html = '''
<div id="postModalForm" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:10001;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);overflow-y:auto;">
  <div style="max-width:550px;margin:60px auto;background:#12121a;border:1px solid #1e1e2a;border-radius:14px;padding:1.5rem;position:relative;">
    <button style="position:absolute;top:12px;right:14px;background:none;border:none;color:#888;font-size:1.5rem;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;" onclick="closePostFormModal()">✕</button>
    <h3 style="color:#ffc832;margin:0 0 1rem 0;font-size:1.1rem;">📝 发布帖子</h3>
    <input id="postTitleModal" type="text" placeholder="标题" style="width:100%;padding:0.6rem;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:8px;font-size:0.9rem;margin-bottom:0.6rem;box-sizing:border-box;">
    <select id="postCategoryModal" style="width:100%;padding:0.6rem;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:8px;font-size:0.9rem;margin-bottom:0.6rem;">
      <option value="general">杂谈</option>
      <option value="question">问答</option>
      <option value="guide">攻略</option>
      <option value="showoff">炫耀</option>
    </select>
    <textarea id="postContentModal" placeholder="内容..." style="width:100%;padding:0.6rem;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:8px;font-size:0.9rem;min-height:120px;resize:vertical;margin-bottom:0.6rem;box-sizing:border-box;" oninput="document.getElementById('pcCount').textContent=this.value.length"></textarea>
    <div id="filePreviewModal" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:0.6rem;"></div>
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:0.8rem;">
      <button style="width:36px;height:36px;border-radius:50%;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);font-size:1.3rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;" onclick="document.getElementById('postImagesModal').click()" title="添加图片">+</button>
      <input id="postImagesModal" type="file" accept="image/*" multiple style="display:none;" onchange="previewFilesModal(this)">
      <span style="color:#666;font-size:0.75rem;" id="fileCountModal">未选择图片</span>
    </div>
    <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;">
      <span style="color:#555;font-size:0.75rem;" id="pcCount">0</span>
      <button style="padding:0.5rem 1.5rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:8px;cursor:pointer;font-weight:600;" onclick="submitPostModal()">发布</button>
    </div>
  </div>
</div>
'''

# Functions for the modal
post_modal_js = '''
function closePostFormModal(){
  document.getElementById('postModalForm').style.display='none';
}

function openPostFormModal(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  document.getElementById('postModalForm').style.display='block';
}

function previewFilesModal(input){
  var preview=document.getElementById('filePreviewModal');
  var count=document.getElementById('fileCountModal');
  if(!input.files||!input.files.length){preview.innerHTML='';if(count)count.textContent='未选择图片';return;}
  preview.innerHTML='';
  for(var i=0;i<input.files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        var img=document.createElement('img');
        img.style.cssText='width:60px;height:60px;border-radius:6px;object-fit:cover;border:1px solid #1e1e2a;';
        img.src=e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    })(input.files[i]);
  }
  if(count)count.textContent='已选择 '+input.files.length+' 张图片';
}

async function submitPostModal(){
  var title=document.getElementById('postTitleModal').value.trim();
  var content=document.getElementById('postContentModal').value.trim();
  if(!title||!content){alert('标题和内容不能为空');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var author=getUserName();
  var cat=document.getElementById('postCategoryModal');
  var category=cat?cat.value:'general';
  var fileInput=document.getElementById('postImagesModal');
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
    var body={title:title,content:content,category:category,author:author};
    if(images.length)body.images=JSON.stringify(images);
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts',{
      method:'POST',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    console.log('POST status:',r.status);
    if(!r.ok){var err;try{err=await r.json();}catch(e){err={message:await r.text()}};alert('发布失败('+r.status+'): '+(err.message||err));return;}
    alert('\\u2705 发布成功！');
    closePostFormModal();
    document.getElementById('postTitleModal').value='';
    document.getElementById('postContentModal').value='';
    fileInput.value='';
    document.getElementById('filePreviewModal').innerHTML='';
    document.getElementById('fileCountModal').textContent='未选择图片';
    loadPosts();
  }catch(e){alert('发布失败: '+e.message);}
}
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. Remove the old post form HTML
    old_form_start = '<div id="postForm" class="post-form" style="display:none;">'
    if old_form_start in c:
        st = c.index(old_form_start)
        # Find the matching closing </div>
        depth = 0
        i = st
        while i < len(c):
            if c[i:i+5] == '<div ' or c[i:i+4] == '<div':
                depth += 1
            elif c[i:i+6] == '</div>':
                depth -= 1
                if depth == 0:
                    old_form = c[st:i+6]
                    c = c.replace(old_form, '')
                    break
            i += 1
    
    # 2. Remove old related CSS (post-form block)
    old_css_st = c.find('    .post-form { background:#12121a')
    if old_css_st >= 0:
        old_css_en = c.find('    .post-card { background:#12121a', old_css_st)
        if old_css_en < 0:
            old_css_en = c.find('\n\n', old_css_st)
        c = c[:old_css_st] + c[old_css_en:]
    
    # 3. Add post modal HTML before </body>
    c = c.replace('</body>', post_modal_html + '\n</body>')
    
    # 4. Add post modal JS before last </script>
    script_end = c.rfind('</script>')
    c = c[:script_end] + '\n' + post_modal_js + '\n' + c[script_end:]
    
    # 5. Update the FAB button to use modal
    old_fab = "window.fabOpenPostForm()"
    new_fab = "window.openPostFormModal()"
    c = c.replace(old_fab, new_fab)
    
    # 6. Update fabOpenPostForm to use modal (or remove old function if exists)
    old_fab_fn = "async function fabOpenPostForm(){"
    if old_fab_fn in c:
        # Find and replace the function
        fn_st = c.index(old_fab_fn)
        fn_en = c.find('}', fn_st)
        fn_en = c.find('}', fn_en + 1)  # one more for inner block
        if c[fn_en-1] == '}':
            fn_en += 1
        old_fn = c[fn_st:fn_en]
        new_fn = "function fabOpenPostForm(){openPostFormModal();}"
        c = c.replace(old_fn, new_fn)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': modal post form added')

# Check all
print('\n--- Validation ---')
import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_modal = 'postModalForm' in c
    has_submit = 'submitPostModal' in c
    has_fab = 'openPostFormModal' in c
    print(f"{fp.split('/')[-1]}: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok} | modal={has_modal} submit={has_submit} fab={has_fab}")
