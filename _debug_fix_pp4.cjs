var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
var start=2661;

// The entry looks like:  "function placePin(tp){...}",
// Need to find where this string ends:  ..."}",
// It ends with: }",\n or similar
// Find the next code array element start:  ...",\n  "function ...
var end=c.indexOf('",\n  "', start+5);
if(end<0) end=c.indexOf('",\n"', start+5);
if(end<0){
  // might be last element
  end=c.indexOf('"];
', start+5);
  if(end>=0) end+=2;
}
if(end<0){
  console.log('Could not find end');
} else {
  end+=1; // include closing quote
  console.log('Start:', start, 'End:', end);
  console.log('Old value:', c.substring(start, end));
  
  // New placePin with type lookup
  var newEntry='"function placePin(tp){if(!localStorage.getItem(\'abi_token\')){alert(\'Login required to submit\');loginGitHub();return;}var cv=document.getElementById(\'cv\');if(!cv||cv.textContent===\'-\'){alert(\'Click map first\');return;}var parts=cv.textContent.split(\',\');var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);if(isNaN(x)||isNaN(y)){alert(\'Invalid pos\');return;}var uname=localStorage.getItem(\'abi_user\')||\'Anon\';var p={name:tp,x:x,y:y,note:\'\',images:[],comments:[]};pins.push(p);renderMarkers();cv.textContent=\'-\';document.getElementById(\'ab\').style.display=\'none\';var btn=document.getElementById(\'mdBtn\');if(btn)btn.textContent=\'[B] \\u6d4f\\u89c8\';var type=\'other\';for(var cat in layerData){if(layerData[cat].indexOf(tp)>=0){type=cat;break;}}supabase(\'pins\',\'POST\',{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:\'\',note:\'\',images:[]}).then(function(r){alert(\'Submitted for review\');})[\'catch\'](function(e){alert(\'Upload failed: \'+e.message);});}"';
  
  if(newEntry.length !== (end-start)){
    console.log('Length mismatch: old='+(end-start)+' new='+newEntry.length);
    console.log('Old:', c.substring(start, start+80));
    console.log('New:', newEntry.substring(0,80));
  }
  
  c=c.substring(0,start) + newEntry + c.substring(end);
  fs.writeFileSync('F:\\暗区突围网站\\_mod03_picker.cjs',c);
  console.log('DONE');
}
