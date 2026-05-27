const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pagesDir = 'F:\\暗区突围网站';

// Get all HTML files
const files = [
  'index.html',
  'search.html',
  ...fs.readdirSync(pagesDir + '\\pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f)
];

// Known bad patterns and their fixes (character-level)
// Many HTML tags have U+FFFD before the > or <
// e.g. 类�?/span> should be </span>
//      攻略�?/span> should be 攻略站</span>

const fixes = {
  // Navigation
  '攻略�?/span>': '攻略站</span>',
  '技�?/a>': '技术</a>',
  
  // Map list page common endings
  '地图攻略': '地图攻略',  // emoji is fine

  // h3 tags  
  '撤离�?/h3>': '撤离点</h3>',
  '攻略要�?/h3>': '攻略要点</h3>',
  
  // li endings with FFFD
  '酒店�?/li>': '酒店</li>',
  '污水处理�?/li>': '污水处理</li>',
  '观景�?/li>': '观景台</li>',
  '雷达�?/li>': '雷达站</li>',
  '伐木�?/li>': '伐木场</li>',
  '撤离�?/div>': '撤离点</div>',
  '信号�?/div>': '信号枪</div>',
  '别墅�?/li>': '别墅</li>',
  '坠机�?/li>': '坠机点</li>',
  '高�?/li>': '高点</li>',
  '极�?/li>': '极多</li>',
  '争夺最激�?/li>': '争夺最激烈</li>',
  '更难发�?/li>': '更难发现</li>',
  '装卸区出�?/div>': '装卸区出口</div>',
  '门�?/li>': '门</li>',
  '楼�?/li>': '楼</li>',
  '脚�?/li>': '脚</li>',
  '可以狙到酒店门�?/li>': '可以狙到酒店门</li>',
  '也能�?/li>': '也能</li>',
  '视野范�?/li>': '视野范围</li>',
  '压�?/li>': '压枪</li>',
  '更精�?/li>': '更精确</li>',
  '更多�?/li>': '更多</li>',
  
  // farm specific
  '仓库�?/li>': '仓库</li>',
  '三�?/li>': '三人</li>',
  '图小节奏快，推荐冲锋枪或霰弹�?/li>': '图小节奏快，推荐冲锋枪或霰弹</li>',
  '容易被集�?/li>': '容易被集火</li>',
  '提前规划路�?/li>': '提前规划路线</li>',
  '冲锋�?霰弹�?/li>': '冲锋枪、霰弹枪</li>',
  '好这�?/li>': '好这一点</li>',
  '配�?/li>': '配置</li>',
  '攻略�?· 持续更新�?/p>': '攻略站 · 持续更新</p>',
  '仅�?/p>': '仅供</p>',
  '发行�?/div>': '发行</div>',
  '审核发�?/p>': '审核发布</p>',
  '地图编辑�?/a>': '地图编辑器</a>',
  '购买�?/div>': '购买</div>',
  '配置�?/div>': '配置</div>',
  '持续更新�?/p>': '持续更新</p>',
};

function fixFile(relPath) {
  const fullPath = pagesDir + '\\' + relPath.replace(/\//g, '\\');
  let c = fs.readFileSync(fullPath, 'utf8');
  let origLen = c.length;
  let fixCount = 0;
  
  for (const [bad, good] of Object.entries(fixes)) {
    const re = new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = c.match(re);
    if (matches) {
      fixCount += matches.length;
      c = c.replace(re, good);
    }
  }
  
  // Also fix generic patterns:
  // Any �?</span> or </span> with FFFD before close
  c = c.replace(/�?<\/([a-z]+)>/g, '</$1>');
  c = c.replace(/\ufffd<\/([a-z]+)>/g, '</$1>');
  c = c.replace(/<\/([a-z]+)�?>/g, '</$1>');
  
  if (c.length !== origLen) {
    fs.writeFileSync(fullPath, c);
    console.log(`${relPath}: fixed ${fixCount} patterns, ${origLen} -> ${c.length} bytes`);
  } else {
    console.log(`${relPath}: no changes`);
  }
  
  const fffdCount = (c.match(/\ufffd/g) || []).length;
  if (fffdCount > 0) {
    console.log(`  Remaining FFFD: ${fffdCount}`);
  }
  
  return { fixCount, fffd: (c.match(/\ufffd/g) || []).length };
}

files.forEach(f => fixFile(f));

console.log('\nDone. Now committing...');
