import urllib.request, json

anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok'

url = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_comments?limit=1'
req = urllib.request.Request(url)
req.add_header('apiKey', anon)
req.add_header('Authorization', 'Bearer ' + anon)
try:
    resp = urllib.request.urlopen(req, timeout=5)
    data = json.loads(resp.read())
    if data and len(data) > 0:
        print('map_comments columns:', list(data[0].keys()))
    else:
        print('No rows, try post_comments')
except Exception as e:
    print(f'Error: {e}')
