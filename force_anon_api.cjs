const fs = require('fs');
const base = 'F:\\暗区突围网站';

['pages/weapons.html', 'pages/strategy.html', 'pages/gear.html', 'pages/maps.html', 'pages/map-editor.html', 'index.html', 'search.html'].forEach(f => {
  const fp = base + '\\' + f;
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Force supabase() to always use anon key for requests
  // Token only used for UI login state, not for API auth
  c = c.replace(`function supabase(method, table, body, q) {
  var token=localStorage.getItem('abi_token');
  var key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
  var bearer=key;
  if(token){try{var p=JSON.parse(atob(token.split('.')[1]));if(p.exp&&p.exp*1000>Date.now())bearer=token;}catch(e){}}`,
    `function supabase(method, table, body, q) {
  var key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
  var bearer=key;`);
  
  fs.writeFileSync(fp, c);
  console.log(f + ': OK');
});
