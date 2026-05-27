import urllib.request, json

url = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/post_comments?post_id=eq.30&order=created_at.asc'
anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjQ4NDcsImV4cCI6MTg1OTEwMDg0N30.1VZQVP4KmfXxEum3ta7Yzr-9AiLQfExSjgQJGUPEBqw'

req = urllib.request.Request(url)
req.add_header('apiKey', anon)
req.add_header('Authorization', 'Bearer ' + anon)

try:
    resp = urllib.request.urlopen(req)
    print('Status:', resp.status)
    data = json.loads(resp.read())
    print('Comments:', len(data))
except Exception as e:
    print('Error:', e)
    if hasattr(e, 'read'):
        print('Body:', e.read().decode())
