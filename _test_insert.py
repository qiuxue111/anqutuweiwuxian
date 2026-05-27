# Test insert directly with anon key (open access)
import urllib.request
import json

url = "https://hanrfbciinkhgcumvous.supabase.co/rest/v1/map_posts"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok",
    "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}
body = json.dumps({
    "title": "测试帖子",
    "content": "这是从前端脚本的测试发帖",
    "category": "general",
    "author": "测试用户"
}).encode()

req = urllib.request.Request(url, data=body, headers=headers, method="POST")
try:
    resp = urllib.request.urlopen(req)
    print("Status:", resp.status)
    print("Response:", resp.read().decode()[:200])
except urllib.request.HTTPError as e:
    print("Error status:", e.code)
    print("Error body:", e.read().decode()[:500])
