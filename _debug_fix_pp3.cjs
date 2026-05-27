var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
// Find placePin function and replace
var start=c.indexOf('function placePin(tp){if(!');
var end=c.indexOf('\"}', start)+2;
console.log('Found placePin from', start, 'to', end);
console.log('Old:', c.substring(start, end).substring(0,100));

// Build new placePin with type lookup
var newFunc='function placePin(tp){if(!localStorage.getItem(\'abi_token\')){alert(\'Login required to submit\');loginGitHub();return;}var cv=document.getElementById(\'cv\');if(!cv||cv.textContent===\'-\'){alert(\'Click map first\');return;}var parts=cv.textContent.split(\',\');var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);if(isNaN(x)||isNaN(y)){alert(\'Invalid pos\');return;}var uname=localStorage.getItem(\'abi_user\')||\'Anon\';var p={name:tp,x:x,y:y,note:\'\',images:[],comments:[]};pins.push(p);renderMarkers();cv.textContent=\'-\';document.getElementById(\'ab\').style.display=\'none\';var btn=document.getElementById(\'mdBtn\');if(btn)btn.textContent=\'[B] \\u6d4f\\u89c8\';var type=\'other\';for(var cat in layerData){if(layerData[cat].indexOf(tp)>=0){type=cat;break;}}supabase(\'pins\',\'POST\',{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:\'\',note:\'\',images:[]}).then(function(r){alert(\'Submitted for review\');})[\'catch\'](function(e){alert(\'Upload failed: \'+e.message);});}';

console.log('New length:', newFunc.length);
c=c.substring(0, start) + newFunc + c.substring(end);
fs.writeFileSync('F:\\暗区突围网站\\_mod03_picker.cjs',c);
console.log('REPLACED');

// verify
var c2=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
console.log('placePin contains type:', c2.indexOf('type:type')>=0?'YES':'NO');
