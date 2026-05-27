import subprocess, json

url = "https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_comments?map_name=eq.%E5%86%9C%E5%9C%BA&pin_id=is.null&order=created_at.asc"
anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"

# Test GET
import urllib.request
req = urllib.request.Request(url, headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon
})
try:
    resp = urllib.request.urlopen(req)
    print(f"GET status: {resp.status}")
    print(resp.read().decode('utf8')[:500])
except urllib.error.HTTPError as e:
    print(f"GET status: {e.code}")
    print(e.read().decode('utf8')[:500])
except Exception as e:
    print(f"GET error: {e}")

print()

# Test POST
import urllib.request
data = json.dumps({"map_name": "农场", "content": "test", "author": "test"}).encode('utf8')
req2 = urllib.request.Request("https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_comments", data=data, headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
})
try:
    resp2 = urllib.request.urlopen(req2)
    print(f"POST status: {resp2.status}")
except urllib.error.HTTPError as e:
    print(f"POST status: {e.code}")
    print(e.read().decode('utf8')[:500])
except Exception as e:
    print(f"POST error: {e}")
