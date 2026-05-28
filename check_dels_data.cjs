const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');

// 找 loadData 中 deletion_requests 的查询
const ldIdx = c.indexOf('function loadData');
const nextFn = c.indexOf('\nfunction', ldIdx + 20);
const loadDataCode = c.substring(ldIdx, nextFn > ldIdx ? nextFn : ldIdx + 5000);

// 找 deletion_requests 相关
const delIdx = loadDataCode.indexOf('deletion_requests');
const supIndex = loadDataCode.indexOf('supabase', delIdx);
console.log('loadData deletion query:', loadDataCode.substring(supIndex, supIndex + 120));

// 找渲染时 p.floor 的来源——dels 数据
const thenIdx = loadDataCode.indexOf('renderDels', delIdx);
console.log('renderDels附近:', loadDataCode.substring(thenIdx - 100, thenIdx + 200));
