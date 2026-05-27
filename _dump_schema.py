import json
anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok"
url = "https://api.supabase.com"
import urllib.request
# Use the SQL API to describe the table
sql = "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'map_comments' ORDER BY ordinal_position;"
data = json.dumps({"query": sql}).encode('utf8')
# Can't use management API without token, skip
print("Use Supabase SQL Editor directly to check schema")
