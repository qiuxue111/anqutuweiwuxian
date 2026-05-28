const cmd = require('child_process').execSync;
try {
  cmd("curl -s -X PATCH \"https://hanrfbciinkhgcumvous.supabase.co/rest/v1/pins?id=eq.46\" -H \"apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok\" -H \"Content-Type: application/json\" -H \"Prefer: return=minimal\" -d \"{\\\"floor\\\": 2}\" 2>&1");
  const r = cmd("curl -s \"https://hanrfbciinkhgcumvous.supabase.co/rest/v1/pins?id=eq.46\" -H \"apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok\" 2>&1");
  console.log(r.toString());
} catch(e) {
  console.log('Error:', e.message);
}
