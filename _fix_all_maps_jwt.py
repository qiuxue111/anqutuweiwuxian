files = [
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html'
]

anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    old = "if(b){o.body=JSON.stringify(b);if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');}"
    new = f"if(b){{\"\"+o.body=JSON.stringify(b);o.headers['Authorization']='Bearer "+anon_key+"';}}"
    
    # Simpler approach: just find and replace
    c = c.replace(
        "if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');",
        "o.headers['Authorization']='Bearer '+" + "'" + anon_key + "';"
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Verify
import os
for fn in sorted(os.listdir('F:/暗区突围网站/pages')):
    if not fn.startswith('map-') or not fn.endswith('.html'): continue
    fp = f'F:/暗区突围网站/pages/{fn}'
    c = open(fp, 'r', encoding='utf8').read()
    if "Bearer '+localStorage.getItem('abi_token')" in c:
        print(f"  WARNING: {fn} still has JWT token")
    else:
        print(f"  OK: {fn}")
