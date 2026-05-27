files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

new_form_css = '''
    .post-form .form-row{display:flex;gap:8px;align-items:center;margin-bottom:0.8rem;}
    .post-form .form-row input{flex:1;margin-bottom:0;}
    .post-form .form-row select{margin-bottom:0;}
    .post-form .file-btn{width:36px;height:36px;border-radius:50%;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);font-size:1.3rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;}
    .post-form .file-btn:hover{background:rgba(255,200,50,0.2);}
    .post-form .file-preview{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:0.8rem;}
    .post-form .file-preview img{width:60px;height:60px;border-radius:6px;object-fit:cover;border:1px solid #1e1e2a;}
    .post-form .submit-row{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:0.5rem;}
    .post-form .submit-row .char-count{color:#555;font-size:0.75rem;}
    .post-form .submit-row button{padding:0.5rem 1.5rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:6px;cursor:pointer;font-weight:600;}
    .post-form .submit-row button:hover{background:#ffd84a;}
'''

new_form_html = '''  <div id="postForm" class="post-form" style="display:none;">
    <h3>发布帖子</h3>
    <div class="form-row">
      <input id="postTitle" type="text" placeholder="标题">
      <select id="postCategory">
        <option value="general">杂谈</option>
        <option value="question">问答</option>
        <option value="guide">攻略</option>
        <option value="showoff">炫耀</option>
      </select>
    </div>
    <textarea id="postContent" placeholder="内容..." oninput="document.getElementById('postCharCount').textContent=this.value.length"></textarea>
    <div class="file-preview" id="filePreview"></div>
    <div class="form-row">
      <button class="file-btn" onclick="document.getElementById('postImages').click()" title="添加图片">+</button>
      <input id="postImages" type="file" accept="image/*" multiple style="display:none;" onchange="previewFiles(this)">
      <span style="color:#666;font-size:0.75rem;margin-left:4px;" id="fileCount">未选择图片</span>
    </div>
    <div class="submit-row">
      <span class="char-count" id="postCharCount">0</span>
      <button onclick="submitPost()">发布</button>
    </div>
  </div>
'''

# Preview files function
preview_js = '''
function previewFiles(input){
  var preview=document.getElementById('filePreview');
  var count=document.getElementById('fileCount');
  if(!input.files||!input.files.length){
    preview.innerHTML='';
    if(count)count.textContent='未选择图片';
    return;
  }
  preview.innerHTML='';
  for(var i=0;i<input.files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        var img=document.createElement('img');
        img.src=e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    })(input.files[i]);
  }
  if(count)count.textContent='已选择 '+input.files.length+' 张图片';
}
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. Replace post form CSS
    old_css = "    .post-form input, .post-form textarea, .post-form select {"
    new_css_marker = "    .post-form .form-row{"
    if new_css_marker not in c:
        # Find the old post-form CSS block and replace it
        st = c.index("    .post-form { background:#12121a")
        en = c.index("    .post-card { background:#12121a", st)
        old_block = c[st:en]
        c = c.replace(old_block, new_form_css)
    
    # 2. Replace the post form HTML
    old_form_start = '<div id="postForm" class="post-form" style="display:none;">'
    old_form_end = '  </div>'
    # Find the old form
    st = c.index(old_form_start)
    # Find the closing of this specific form
    # Count from st to find matching </div>
    depth = 0
    i = st
    while i < len(c):
        if c[i:i+5] == '<div ' or c[i:i+4] == '<div':
            depth += 1
        elif c[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                old_form = c[st:i+6]
                c = c.replace(old_form, new_form_html)
                break
        i += 1
    
    # 3. Add previewFiles function before loadPosts
    old_load = "function loadPosts(){"
    c = c.replace(old_load, preview_js + '\n' + old_load)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': form UI updated')

print('DONE')
