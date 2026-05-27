files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # Remove the <script> injection from template
    old_inline = """'</div>'+
        '<script>loadComments('+pId+',\\''+cId+'\\');<' + '/script>';"""
    new_inline = """'</div>';"""
    c = c.replace(old_inline, new_inline)
    
    # Add post-render comment loading: after el.innerHTML = ..., call loadComments for each post
    # Find the closing of el.innerHTML assignment
    old_join = """    }).join('');
  }catch(e){"""
    new_join = """    }).join('');
    // Load comments for each post
    posts.forEach(function(p){
      var cId='comments_'+p.id;
      loadComments(p.id, cId);
    });
  }catch(e){"""
    c = c.replace(old_join, new_join)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': fixed')

print('DONE')
