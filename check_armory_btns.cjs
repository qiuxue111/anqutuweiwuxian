const fs = require('fs');

// 前线要塞的 floor-btn HTML
const armory = fs.readFileSync('F:\\暗区突围网站\\pages\\map-armory.html', 'utf-8');
const btnIdx = armory.indexOf('<button class="floor-btn');
const btnEnd = armory.indexOf('</div>', btnIdx);
// 找楼层按钮容器
const floorContainerStart = armory.lastIndexOf('flex-wrap:wrap;max-width', btnIdx);
const floorHTML = armory.substring(floorContainerStart, btnEnd + 6);
console.log('前线要塞楼层按钮HTML:');
console.log(floorHTML);
