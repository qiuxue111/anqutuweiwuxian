anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"

import urllib.request, json
url = "https://hanrfbciinkhgcumvous.supabase.co/rest/v1/?limit=1"
req = urllib.request.Request(url, headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon
})
resp = urllib.request.urlopen(req)
print(resp.read().decode('utf8')[:3000])
