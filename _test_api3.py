import urllib.request
import json

# Try with no auth to see table exists
url = "https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_posts?select=count&limit=0"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok",
    "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok",
    "Prefer": "count=exact"
}
req = urllib.request.Request(url, headers=headers)
resp = urllib.request.urlopen(req)
print("Status:", resp.status)
print("Headers:", dict(resp.headers))
print("Body:", resp.read().decode()[:500])

# Try to see columns
print("\n--- Schema check ---")
url2 = "https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_posts?select=*&limit=1"
req2 = urllib.request.Request(url2, headers=headers)
try:
    resp2 = urllib.request.urlopen(req2)
    print("Body:", resp2.read().decode()[:500])
except Exception as e:
    print(f"Error: {e}")
