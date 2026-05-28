const fs = require('fs');

const layerHTML = `style="display:flex;flex-wrap:wrap;max-width:400px;gap:4px;">`; // 统一用 flex

const replaceFloorButtons = [
  { eng: 'beishan', labels: ['北山全境', '北山酒店一楼', '北山酒店二楼', '北山酒店三楼'] },
  { eng: 'tvstation', labels: ['电视台全境', '电视台二楼'] },
  { eng: 'airport', labels: ['机场全境', '机场塔内一层', '机场塔内二层'] },
];

replaceFloorButtons.forEach(({ eng, labels }) => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  
  // 找到楼层容器
  // 前线要塞用的结构：背景rgba(0,0,0,0.6) padding:5px 6px border-radius:8px
  // 找旧的楼层按钮容器（从flex-wrap:wrap开始到</div>结束的楼层按钮容器）
  const oldStart = c.indexOf('flex-wrap:wrap');
  const oldEnd = c.indexOf('</div>', oldStart);
  if (oldStart < 0) { console.log(`${eng}: no flex-wrap found`); return; }
  
  const oldBlock = c.substring(oldStart, oldEnd + 6);
  
  // 构造新按钮
  const btns = labels.map((label, i) => 
    `<button class="floor-btn${i === 0 ? ' active' : ''}" data-floor="${i}" onclick="switchFloor(${i})">${label}</button>`
  ).join('\n  ');
  
  const newBlock = `flex-wrap:wrap;max-width:400px;gap:4px;background:rgba(0,0,0,0.6);padding:5px 6px;border-radius:8px;">\n  ${btns}\n</div>`;
  
  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(`${eng}: ✅ 更新楼层按钮`);
});
