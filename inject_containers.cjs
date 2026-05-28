// 注入新容器到所有地图页面
const fs = require('fs');
const pages = ['farm','beishan','valley','armory','airport','tvstation'];

// 新容器名称（按文件名）
const newNames = ['三色灯','共鸣球','奉献雕像','小保险','空调罐','长条武器箱'];

// URL编码（raw.githubusercontent 路径用）
function urlEncodeCn(s) {
  return encodeURIComponent(s)
    .replace(/%2F/g,'/')
    .replace(/%20/g,'%20');
}

// 生成 iconUrls 条目
const newIconEntries = {};
newNames.forEach(n => {
  const url = 'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/' + urlEncodeCn(n) + '.png';
  newIconEntries[n] = url;
});

// layerData 分类
const categoryMap = {
  '三色灯': '物资',
  '共鸣球': '贵重',
  '奉献雕像': '贵重',
  '小保险': '贵重',
  '空调罐': '物资',
  '长条武器箱': '武器'
};

// 处理每个页面
pages.forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  let changed = false;

  // 1. 注入 iconUrls
  Object.keys(newIconEntries).forEach(name => {
    const url = newIconEntries[name];
    const entryStr = `"${name}":"${url}"`;
    // 在 iconUrls 结束前插入
    const iconEnd = c.lastIndexOf('};', c.indexOf('var iconUrls'));
    if (iconEnd < 0) {
      const iconStart = c.indexOf('var iconUrls={');
      const endIdx = c.indexOf('}', iconStart);
      if (endIdx >= 0) {
        // 直接找到结束
        c = c.slice(0, endIdx) + ',' + entryStr + c.slice(endIdx);
        changed = true;
      }
    }
  });

  // 2. 注入 layerData
  Object.keys(categoryMap).forEach(name => {
    const cat = categoryMap[name];
    // 找该分类的结束括号
    const catIdx = c.indexOf("'" + cat + "':['");
    const catIdx2 = c.indexOf('"' + cat + '":["');
    const catSearch = catIdx >= 0 ? catIdx : catIdx2;
    if (catSearch >= 0) {
      // 找到该分类数组结束位置
      const arrEnd = c.indexOf(']', catSearch);
      if (arrEnd >= 0) {
        const before = c.substring(arrEnd - 1, arrEnd);
        // 如果数组不为空，需要加逗号
        const lineStart = c.lastIndexOf("'", arrEnd - 1);
        const lineStart2 = c.lastIndexOf('"', arrEnd - 1);
        if (c[arrEnd-1] === "'" || c[arrEnd-1] === '"') {
          // 已有内容，加逗号
          c = c.slice(0, arrEnd) + ",'" + name + "'" + c.slice(arrEnd);
        } else {
          // 空数组？
          c = c.slice(0, arrEnd) + "'" + name + "'" + c.slice(arrEnd);
        }
        changed = true;
      }
    }
  });

  if (changed) {
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(`${eng}: ✅ injected`);
  } else {
    console.log(`${eng}: ⚠️ no change needed`);
  }
});

// 验证
console.log('\n=== 验证 ===');
pages.forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  // 检查有无乱码
  if (c.indexOf('\ufffd') >= 0) {
    console.log(`${eng}: ❌ 编码错误`);
    return;
  }
  // 检查脚本是否正常 (用 node -c)
  const m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + '\\ck_' + eng + '.js';
    fs.writeFileSync(tmp, m[1], 'utf-8');
    require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' });
    // 检查是否包含新容器名
    let found = 0;
    newNames.forEach(n => {
      if (c.indexOf(n) >= 0) found++;
    });
    console.log(`${eng}: ✅ (${found}/6 个容器)`);
  }
});
