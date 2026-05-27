const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

var supabaseFn = 
`function supabase(table,method,body,filter){
  var url='https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+table;
  var opt={method:method||'GET',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok','Content-Type':'application/json'}};
  if(body)opt.body=JSON.stringify(body);
  if(filter)url+='?'+filter;
  if(localStorage.getItem('abi_token'))opt.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');
  return fetch(url,opt).then(function(r){if(r.status===204)return{id:null};if(r.status>=400)throw new Error(r.status);return r.json();});
}

`;

var idx = c.indexOf('function getIconUrl');
c = c.substring(0, idx) + supabaseFn + c.substring(idx);
fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Added supabase fn OK');
