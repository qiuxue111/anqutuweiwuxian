var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
// Find the supabase call inside placePin and fix the fields
// Old: {name:tp,x:x,y:y,map:mapNameEng,notes:'',images:[],submitter:uname}
// New: {name:tp,x:x,y:y,map_name:mapNameCN,ic:'',note:'',images:[]}
var old="map:mapNameEng,notes:'',images:[],submitter:uname";
var neww="map_name:mapNameCN,ic:'',note:'',images:[]";
if(c.indexOf(old)>=0){
  c=c.replace(old, neww);
  fs.writeFileSync('F:\\暗区突围网站\\_mod03_picker.cjs',c);
  console.log('REPLACED');
} else {
  console.log('NOT FOUND');
  // find the exact string in the file
  var idx=c.indexOf('mapNameEng');
  console.log('Found:', c.substring(idx-5, idx+80));
}
