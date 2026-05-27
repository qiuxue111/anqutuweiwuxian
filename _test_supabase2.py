import urllib.request, json

anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok'

# Test 1: read post_comments
url = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/post_comments?post_id=eq.30&order=created_at.asc'
req = urllib.request.Request(url)
req.add_header('apiKey', anon)
req.add_header('Authorization', 'Bearer ' + anon)

try:
    resp = urllib.request.urlopen(req)
    print('GET post_comments:', resp.status)
    data = json.loads(resp.read())
    print('Count:', len(data))
except Exception as e:
    print('GET post_comments Error:', e)
    if hasattr(e, 'read'):
        print(e.read().decode())

# Test 2: Check if post_likes table exists
url2 = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/post_likes?limit=1'
req2 = urllib.request.Request(url2)
req2.add_header('apiKey', anon)
req2.add_header('Authorization', 'Bearer ' + anon)

try:
    resp2 = urllib.request.urlopen(req2)
    print('GET post_likes:', resp2.status)
except Exception as e2:
    print('GET post_likes Error:', e2)
