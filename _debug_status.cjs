var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
// Find the supabase POST call inside placePin and add status:'pending'
var old="ic:'',note:'',images:[]}).then(function(r){alert('Submitted for review');})['catch']";
var neww="ic:'',note:'',images:[],status:'pending'}).then(function(r){alert('Submitted for review');})['catch']";
if(c.indexOf(old)>=0){
  c=c.replace(old, neww);
  fs.writeFileSync('F:\\暗区突围网站\\_mod03_picker.cjs',c);
  console.log('DONE');
} else {
  console.log('NOT FOUND');
  var idx=c.indexOf('images:[]');
  console.log('Found at', idx, ':', c.substring(idx, idx+60));
}
