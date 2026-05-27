anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"
import urllib.request

# Check post_comments table schema
r = urllib.request.Request("https://hanrfbciinkhgcumvous.supabase.co/rest/v1/post_comments?limit=1", headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon
})
try:
    resp = urllib.request.urlopen(r)
    print("post_comments:", resp.read().decode('utf8')[:500])
except urllib.error.HTTPError as e:
    print(f"post_comments Error {e.code}: {e.read().decode('utf8')[:500]}")

print()

# Check map_posts table schema
r2 = urllib.request.Request("https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_posts?limit=1", headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon
})
try:
    resp2 = urllib.request.urlopen(r2)
    print("map_posts:", resp2.read().decode('utf8')[:1000])
except urllib.error.HTTPError as e2:
    print(f"map_posts Error {e2.code}: {e2.read().decode('utf8')[:500]}")
