var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
// Change placePin to POST to pending_pins instead of pins
c=c.replace("supabase('pins','POST',{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[],status:'pending'})", 
            "supabase('pending_pins','POST',{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[],status:'pending'})");
// Also revert loadCloudPins: don't filter by status.approved since pins table only has approved data
fs.writeFileSync('F:\\暗区突围网站\\_mod03_picker.cjs',c);
console.log('DONE');

// Verify
var c2=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
console.log('pending_pins:', c2.indexOf('pending_pins')>=0?'YES':'NO');
console.log("supabase('pins'):", c2.indexOf("supabase('pins','POST')")>=0?'YES':'NO');
