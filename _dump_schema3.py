import json
anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"
# Try fetching a row first to see columns
import urllib.request
r = urllib.request.Request("https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_comments?limit=1", headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon
})
try:
    resp = urllib.request.urlopen(r)
    text = resp.read().decode('utf8')
    print(text[:2000])
except urllib.error.HTTPError as e:
    err = e.read().decode('utf8')
    print(f"Error {e.code}: {err[:1000]}")
