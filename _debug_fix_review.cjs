var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\review.html','utf8');
// Fix adminPass: add map_name to the pins POST
c=c.replace('supabase("pins","POST",{x:p.x,y:p.y,name:p.name,type:p.type,ic:p.ic,note:p.note||"",images:p.images||[],comments:p.comments||[]})',
            'supabase("pins","POST",{x:p.x,y:p.y,name:p.name,type:p.type,map_name:p.map_name||"农场",ic:p.ic,note:p.note||"",images:p.images||[],comments:p.comments||[]})');
// Also fix vote function's admin pass (duplicate logic)
c=c.replace('supabase("pins","POST",{x:a.x,y:a.y,name:a.name,type:a.type,ic:a.ic,note:a.note||"",images:a.images||[],comments:a.comments||[]})',
            'supabase("pins","POST",{x:a.x,y:a.y,name:a.name,type:a.type,map_name:a.map_name||"农场",ic:a.ic,note:a.note||"",images:a.images||[],comments:a.comments||[]})');
fs.writeFileSync('F:\\暗区突围网站\\pages\\review.html',c);
console.log('DONE');
// verify
var c2=fs.readFileSync('F:\\暗区突围网站\\pages\\review.html','utf8');
console.log('map_name in adminPass:', c2.indexOf('map_name:p.map_name')>=0?'YES':'NO');
console.log('map_name in vote:', c2.indexOf('map_name:a.map_name')>=0?'YES':'NO');
