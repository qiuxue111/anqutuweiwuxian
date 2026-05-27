files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

new_fn = """function previewPinCommentFiles(input){
  var preview=document.getElementById('pdcFilePreview');
  var count=document.getElementById('pdcFileCount');
  if(!preview||!input)return;
  preview.innerHTML='';
  if(!input.files||input.files.length===0){
    if(count)count.textContent='\\u672a\\u9009\\u62e9\\u56fe\\u7247';
    return;
  }
  if(count)count.textContent='\\u5df2\\u9009\\u62e9 '+input.files.length+' \\u5f20\\u56fe\\u7247';
  for(var i=0;i<input.files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        var img=document.createElement('img');
        img.src=e.target.result;
        img.style.cssText='width:50px;height:50px;object-fit:cover;border-radius:4px;';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    })(input.files[i]);
  }
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    # Add function before submitPinComment
    idx = c.find('async function submitPinComment')
    if idx >= 0:
        c = c[:idx] + new_fn + '\n\n' + c[idx:]
        print(f'{fp.split("/")[-1]}: added previewPinCommentFiles')
        open(fp, 'w', encoding='utf8').write(c)

# Verify
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp}")
