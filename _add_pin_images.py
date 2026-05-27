files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

new_submit = """async function submitPinComment(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\u8bf7\u5148\u767b\u5f55');return;}
  if(curPinIdx===null)return;
  var input=document.getElementById('pdcInput');
  var content=input.value.trim();
  var fileInput=document.getElementById('pdcFileInput');
  var images=[];
  if(content==''&&(!fileInput||fileInput.files.length===0)){alert('\u8bf7\u8f93\u5165\u8bc4\u8bba\u5185\u5bb9');return;}
  if(fileInput&&fileInput.files.length>0){
    for(var i=0;i<fileInput.files.length;i++){
      var f=fileInput.files[i];
      if(!f.type.startsWith('image/')){alert('\u53ea\u652f\u6301\u56fe\u7247\u6587\u4ef6');return;}
      if(f.size>5*1024*1024){alert('\u5355\u5f20\u56fe\u7247\u4e0d\u80fd\u8d85\u8fc75MB');return;}
      var imgName=Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg';
      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/map_comment_images/'+imgName,{
          method:'POST',
          headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/map_comment_images/'+imgName);
        }
      }catch(e){console.error('Upload failed',e);}
    }
  }
  var user_name=getUserName()||'\u533f\u540d';
  var body={map_name:mapNameCN,text:content,user_name:user_name,pin_id:pins[curPinIdx].id};
  if(images.length)body.images=JSON.stringify(images);
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    if(r.ok||r.status===204||r.status===201){
      input.value='';
      if(fileInput){fileInput.value='';}
      var preview=document.getElementById('pdcFilePreview');
      if(preview)preview.innerHTML='';
      loadPinComments(curPinIdx);
    }else{
      alert('\u8bc4\u8bba\u5931\u8d25');
    }
  }catch(e){
    alert('\u8bc4\u8bba\u5931\u8d25: '+e.message);
  }
}"""

# Also update renderPinComments to show images
new_render_pin = """function renderPinComments(){
  var list=document.getElementById('pdcList');
  if(!list)return;
  if(curPinIdx===null||!pins[curPinIdx])return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  var cs=pins[curPinIdx].comments||[];
  if(cs.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">\u6682\u65e0\u8bc4\u8bba</div>';
    return;
  }
  var html='';
  for(var i=0;i<cs.length;i++){
    var c=cs[i];
    var un=c.user_name||'\u533f\u540d';
    var txt=c.text||'';
    var time=c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    html+='<div class="c-item"><div class="c-hdr"><span class="c-author">'+un+'</span><span class="c-time">'+time+'</span></div><div class="c-body">'+txt+'</div>';
    if(c.images){
      var imgs=typeof c.images==='string'?JSON.parse(c.images):c.images;
      if(imgs&&imgs.length){
        html+='<div style="display:flex;gap:4px;flex-wrap:wrap;padding:4px 0;">';
        for(var j=0;j<imgs.length;j++){
          html+='<img src="'+imgs[j]+'" style="max-width:60px;max-height:60px;border-radius:4px;object-fit:cover;cursor:pointer;" onclick="window.open(this.src)">';
        }
        html+='</div>';
      }
    }
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deletePinComment('+c.id+','+curPinIdx+')">\u5220\u9664</button></div>';
    }
    html+='</div>';
  }
  list.innerHTML=html;
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Replace submitPinComment
    start = c.find('async function submitPinComment(){')
    if start >= 0:
        depth = 0
        i = start
        while i < len(c):
            if c[i] == '{': depth += 1
            elif c[i] == '}':
                depth -= 1
                if depth == 0:
                    old = c[start:i+1]
                    c = c[:start] + new_submit + c[i+1:]
                    print(f'{fp.split("/")[-1]}: replaced submitPinComment ({len(old)} chars)')
                    break
            i += 1
    
    # Replace renderPinComments
    start = c.find('function renderPinComments(){')
    if start >= 0:
        depth = 0
        i = start
        while i < len(c):
            if c[i] == '{': depth += 1
            elif c[i] == '}':
                depth -= 1
                if depth == 0:
                    old = c[start:i+1]
                    c = c[:start] + new_render_pin + c[i+1:]
                    print(f'{fp.split("/")[-1]}: replaced renderPinComments ({len(old)} chars)')
                    break
            i += 1
    
    # Also need to add file input and preview to the pin detail UI section
    # Check if pdcFileInput already exists
    if 'pdcFileInput' not in c:
        # Add file input + preview + upload button near the comment input area
        # Find the submit button area in pin detail
        c = c.replace(
            'id="pdcBtn"',
            'id="pdcBtn" style="display:none"'
        )
        # Add file upload button before pdcInput
        c = c.replace(
            'id="pdcInput"',
            'id="pdcInput" style="display:inline-block;width:calc(100% - 90px)"'
        )
        # The comment input area HTML - inject file upload elements
        old_html = '<div class="pin-comment-input"'
        if old_html in c:
            print(f'{fp.split("/")[-1]}: found pin-comment-input area')
        else:
            # Try to find the comment area differently
            pass
    
    open(fp, 'w', encoding='utf8').write(c)
