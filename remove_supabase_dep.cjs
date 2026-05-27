const fs = require('fs');

['weapons', 'strategy', 'gear'].forEach(file => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, 'utf8');
  
  // Remove the supabase.js script tag reference
  c = c.replace('<script src="../supabase.js"></script>\n', '');
  c = c.replace('<script src="supabase.js"></script>\n', '');
  
  // Remove the leftover "supabase.js" include
  c = c.replace(/<!--.*supabase\.js.*-->\n/g, '');
  
  // Fix login to not need supabasejs
  c = c.replace(`function loginGitHub(){
  var s=supabasejs.createClient('https://hanrfbciinkhgcumvous.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok');
  s.auth.signInWithOAuth({provider:'github'});}`, 
    `function loginGitHub(){
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(window.location.href.split('?')[0].split('#')[0]);
  window.location.href=u;}`);

  fs.writeFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, c);
  console.log(`${file}: OK`);
});

// Fix index.html and search.html and map-editor
const mainFiles = [
  { path: 'F:\\暗区突围网站\\index.html', supabasePath: 'supabase.js', fixLogin: true },
  { path: 'F:\\暗区突围网站\\search.html', supabasePath: 'supabase.js', fixLogin: true },
  { path: 'F:\\暗区突围网站\\pages\\maps.html', supabasePath: '../supabase.js', fixLogin: true },
  { path: 'F:\\暗区突围网站\\pages\\map-editor.html', supabasePath: '../supabase.js', fixLogin: true },
];

mainFiles.forEach(({path, supabasePath, fixLogin}) => {
  if (!fs.existsSync(path)) return;
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(`<script src="${supabasePath}"></script>`, '');
  
  if (fixLogin && c.includes('supabasejs')) {
    c = c.replace(/function loginGitHub[\s\S]*?\}/, `function loginGitHub(){
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(window.location.href.split('?')[0].split('#')[0]);
  window.location.href=u;}`);
  }
  
  fs.writeFileSync(path, c);
  console.log(`${path}: OK`);
});

console.log('Done');
