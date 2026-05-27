import urllib.request, json

anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok'

# Test pins table
url = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/pins?map_name=eq.%E5%86%9C%E5%9C%BA&limit=1'
req = urllib.request.Request(url)
req.add_header('apiKey', anon)
req.add_header('Authorization', 'Bearer ' + anon)

try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    print(f'pins: {resp.status} {len(data)} results')
except Exception as e:
    print(f'pins Error: {e}')
    if hasattr(e, 'read'):
        print(e.read().decode())

# Test map_comments
url2 = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_comments?map_name=eq.%E5%86%9C%E5%9C%BA&limit=1'
req2 = urllib.request.Request(url2)
req2.add_header('apiKey', anon)
req2.add_header('Authorization', 'Bearer ' + anon)

try:
    resp2 = urllib.request.urlopen(req2)
    data2 = json.loads(resp2.read())
    print(f'map_comments: {resp2.status} {len(data2)} results')
except Exception as e:
    print(f'map_comments Error: {e}')
    if hasattr(e, 'read'):
        print(e.read().decode())
