import json
anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"
# Use the OpenAPI spec endpoint to see the table schema
import urllib.request
r = urllib.request.Request("https://hanrfbciinkhgcumvous.supabase.co/rest/v1/", headers={
    'apiKey': anon,
    'Authorization': 'Bearer ' + anon,
    'Accept': 'application/openapi+json'
})
resp = urllib.request.urlopen(r)
print(resp.read().decode('utf8')[:4000])
