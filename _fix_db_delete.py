files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix db() to use token for DELETE
    old_db = """function db(method,table,body,query){
  return fetch(SUPABASE_URL+'/rest/v1/'+table+(query?'?'+query:''),{
    method:method,
    headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}"""
    
    new_db = """function db(method,table,body,query){
  var token=localStorage.getItem('abi_token');
  var useToken=(method==='POST'||method==='PATCH'||method==='DELETE');
  var auth=useToken&&token?'Bearer '+token:'Bearer '+SUPABASE_ANON;
  return fetch(SUPABASE_URL+'/rest/v1/'+table+(query?'?'+query:''),{
    method:method,
    headers:{'Authorization':auth,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}"""
    
    c = c.replace(old_db, new_db)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed db()")

print('DONE')
