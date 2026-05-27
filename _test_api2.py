import urllib.request
import json

url = "https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_posts?limit=10"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok",
    "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"
}
req = urllib.request.Request(url, headers=headers)
resp = urllib.request.urlopen(req)
data = resp.read().decode()
print(data)

# Also try to see if there's a different table
# Check available endpoints
print("\n--- Trying different tables ---")
for table in ['posts', 'forum_posts', 'user_posts', 'discussions']:
    try:
        url2 = f"https://hanrfbciinkhgcumvous.supabase.co/rest/v1/{table}?limit=1"
        req2 = urllib.request.Request(url2, headers=headers)
        resp2 = urllib.request.urlopen(req2)
        d2 = resp2.read().decode()
        print(f"  {table}: {d2[:200]}")
    except Exception as e:
        print(f"  {table}: {e}")
