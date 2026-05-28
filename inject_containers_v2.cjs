// 重写：安全注入容器和 iconUrls
const fs = require('fs');
const pages = ['farm','beishan','valley','armory','airport','tvstation'];

const newNames = ['三色灯','共鸣球','奉献雕像','小保险','空调罐','长条武器箱'];

// 分类
const categoryMap = {
  '三色灯':'物资','共鸣球':'贵重','奉献雕像':'贵重',
  '小保险':'贵重','空调罐':'物资','长条武器箱':'武器'
};

// URL编码
function enc(s) {
  return encodeURIComponent(s)
    .replace(/%2F/g,'/');
}

// iconUrls 条目
const newIconEntries = {};
newNames.forEach(n => {
  newIconEntries[n] = 'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/' + enc(n) + '.png';
});

pages.forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  const orig = c;
  
  // 1. iconUrls - 在最后一个条目后加逗号和新的条目
  // 找到 iconUrls 的结束 };
  const iStart = c.indexOf('var iconUrls={');
  const iEnd = c.indexOf('};', iStart);
  if (iStart < 0 || iEnd < 0) {
    console.log(`${eng}: ❌ 找不到 iconUrls`);
    return;
  }
  
  // 构建新图标条目
  let iconAdd = '';
  Object.keys(newIconEntries).forEach(name => {
    iconAdd += `,"${name}":"${newIconEntries[name]}"`;
  });
  c = c.slice(0, iEnd) + iconAdd + c.slice(iEnd);
  
  // 2. layerData - 在每个分类末尾添加
  Object.keys(categoryMap).forEach(name => {
    const cat = categoryMap[name];
    // 匹配 '分类':['item1','item2'] 或 "分类":["item1","item2"]
    // 找最后一个单引号/双引号前的逗号位置
    const search = ':' + (cat.indexOf("'") >= 0 ? '' : "'") + cat + (cat.indexOf("'") >= 0 ? '' : "'");
    // 更简单：匹配 var layerData={'贵重':[...
    const ptn = `'${cat}':['`;
    const ptn2 = `"${cat}":["`;
    let catStart = c.indexOf(ptn);
    if (catStart < 0) catStart = c.indexOf(ptn2);
    if (catStart < 0) {
      console.log(`${eng}: ❌ 找不到分类 ${cat}`);
      return;
    }
    // 找到这个分类数组的结束 ]
    let arrEnd = c.indexOf(']', catStart + ptn.length);
    if (arrEnd < 0) {
      console.log(`${eng}: ❌ 找不到 ${cat} 的数组结束`);
      return;
    }
    // 在最后一个 item 后面加逗号和新item
    const beforeEnd = c[arrEnd - 1];
    if (beforeEnd === "'" || beforeEnd === '"') {
      c = c.slice(0, arrEnd) + `,'${name}'` + c.slice(arrEnd);
    } else {
      c = c.slice(0, arrEnd) + `'${name}'` + c.slice(arrEnd);
    }
  });
  
  if (c !== orig) {
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(`${eng}: ✅`);
  } else {
    console.log(`${eng}: ⚠️ unchanged`);
  }
});

// 验证
console.log('\n=== 验证 ===');
pages.forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  if (c.indexOf('\ufffd') >= 0) { console.log(`${eng}: ❌ 乱码`); return; }
  // 语法检查
  const m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + '\\ci_' + eng + '.js';
    fs.writeFileSync(tmp, m[1], 'utf-8');
    const r = require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe', encoding: 'utf-8' });
    let ok = 0;
    newNames.forEach(n => { if (c.indexOf(n) >= 0) ok++; });
    console.log(`${eng}: ✅ (${ok}/6)`);
  }
});

// 清理
fs.unlinkSync('F:\\暗区突围网站\\_check_icon.cjs');
