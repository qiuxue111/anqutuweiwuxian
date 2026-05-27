const fs = require('fs');

// 帖子 page title + 发帖区标题用 titleMap
const titleMap = {
  'weapons': { title: '帖子', icon: '📝' },
  'strategy': { title: '闲聊', icon: '💬' },
  'gear': { title: '攻略', icon: '📖' }
};

Object.entries(titleMap).forEach(([file, info]) => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, 'utf8');

  // Add "发布" button (floating +) next to the page h2
  // Find the h2 line
  const h2Idx = c.indexOf(info.icon + ' ' + info.title);
  if (h2Idx < 0) return console.log(`${file}: h2 not found`);

  // Find the line end
  const h2LineEnd = c.indexOf('</h2>', h2Idx) + 5;
  const h2LineStart = c.lastIndexOf('\n', h2Idx) + 1;

  // We want: h2 | + button (only visible when logged in)
  const h2Line = c.substring(h2LineStart, h2LineEnd);
  const newH2Line = h2Line + '\n  <button id="fabBtn-'+file+'" onclick="window.fabOpenPostForm()" style="display:none;width:36px;height:36px;border-radius:50%;background:#ffc832;color:#0a0a0f;border:none;font-size:1.5rem;cursor:pointer;line-height:1;margin-left:auto;flex-shrink:0;" title="发布帖子">+</button>';

  // Replace the h2 line - need to wrap the h2 area in a flex container
  // Find the section start and add: <div style="display:flex;align-items:center;">
  const sectionStart = c.lastIndexOf('<section', h2Idx);
  const sectionTagEnd = c.indexOf('>', c.indexOf('style', sectionStart));
  // Actually just look for the first line of the section content after the opening tag
  const afterSectionOpen = c.indexOf('\n', sectionStart) + 1;

  c = c.substring(0, h2LineStart) + '<div style="display:flex;align-items:center;">' + newH2Line + '</div>\n' + c.substring(h2LineEnd);

  // Add script to show/hide fab
  const fabScript = `
  function fabOpenPostForm(){
    var pf=document.getElementById('postForm');
    if(pf)pf.style.display=pf.style.display==='none'?'block':'none';
  }`;

  c = c.replace('function init(){', fabScript + '\nfunction init(){');

  // In the init function, add fabBtn show
  c = c.replace("if(currentUser){document.getElementById('postForm').style.display='block';}",
    "if(currentUser){var fb=document.getElementById('fabBtn-"+file+"');if(fb)fb.style.display='';}");

  fs.writeFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, c);
  console.log(`${file}: + button added`);
});
