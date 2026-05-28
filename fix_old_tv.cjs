const tab = require('child_process').execSync;
// 查所有 floor=0 的电视台点位
const r = tab("curl -s \"https://hanrfbciinkhgcumvous.supabase.co/rest/v1/pins?map_name=eq.%E7%94%B5%E8%A7%86%E5%8F%B0&order=created_at.desc\" -H \"apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok\"");
const pins = JSON.parse(r.toString());
pins.forEach(p => {
  console.log(`id=${p.id} name=${p.name} floor=${p.floor}`);
});
