files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Add console.log in loadPosts catch block
    old_catch = """  }catch(e){
    var el2=document.getElementById('postList');
    if(el2)el2.innerHTML='<div class="no-posts">加载失败，请刷新重试</div>';
  }"""
    new_catch = """  }catch(e){
    console.error('loadPosts error:',e);
    var el2=document.getElementById('postList');
    if(el2)el2.innerHTML='<div class="no-posts">加载失败: '+e.message+'</div>';
  }"""
    c = c.replace(old_catch, new_catch)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: done")

print('DONE')
