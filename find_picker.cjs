const fs = require('fs');
['F:\\temp_check.html', 'F:\\temp_check2.html', 'F:\\temp_map_full.cjs.html'].forEach(function(f) {
  try {
    var c = fs.readFileSync(f, 'utf8');
    var idx = c.indexOf('chooseContainer') >= 0 ? c.indexOf('chooseContainer') : c.indexOf('function showPicker');
    if (idx >= 0) {
      console.log(f + ': found at', idx);
      console.log(c.substring(idx, idx + 2000));
    } else {
      console.log(f + ': not found');
    }
  } catch(e) {}
});
