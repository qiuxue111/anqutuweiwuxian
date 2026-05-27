fp = 'F:/暗区突围网站/pages/map-farm.html'
c = open(fp, 'r', encoding='utf8').read()

# The supabase function currently has:
# if(b){o.body=JSON.stringify(b);if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');}
# Change to always use anon key for Authorization
old = "if(b){o.body=JSON.stringify(b);if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');}"
new = "if(b){o.body=JSON.stringify(b);o.headers['Authorization']='Bearer '+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';}"

c = c.replace(old, new)

open(fp, 'w', encoding='utf8').write(c)
print("map-farm.html: supabase function now uses anon key for writes")

# Also check map-editor.html etc  
import os, glob
for fn in ['map-editor.html', 'map-farm.html']:
    fp2 = f'F:/暗区突围网站/pages/{fn}'
    if os.path.exists(fp2):
        c2 = open(fp2, 'r', encoding='utf8').read()
        if "Bearer '+localStorage.getItem('abi_token')" in c2:
            print(f"  {fn} also has JWT token ref")
