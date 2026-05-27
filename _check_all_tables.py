anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"
import urllib.request, json

tables = ['map_posts', 'post_comments', 'post_likes', 'pins', 'pending_pins', 'deletion_requests', 'map_comments', 'pin_images', 'pin_likes']
for t in tables:
    r = urllib.request.Request(f"https://hanrfbciinkhgcumvous.supabase.co/rest/v1/{t}?limit=1", headers={
        'apiKey': anon, 'Authorization': 'Bearer ' + anon
    })
    try:
        resp = urllib.request.urlopen(r)
        d = resp.read().decode('utf8')
        print(f"{t}: EXISTS - {d[:100]}")
    except urllib.error.HTTPError as e:
        print(f"{t}: {e.code} {e.read().decode()[:100]}")
