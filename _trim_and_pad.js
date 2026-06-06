const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/sharp');

const dir = 'F:/暗区突围网站/assets/containers';
const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

async function trimAndPad(filePath) {
  // sharp 没有自动裁剪透明边的内置函数，变通：读取原始，找到非透明边界
  const meta = await sharp(filePath).metadata();
  const pixels = await sharp(filePath).ensureAlpha().raw().toBuffer();
  
  const w = meta.width, h = meta.height;
  let minX = w, maxX = 0, minY = h, maxY = 0;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = pixels[(y * w + x) * 4 + 3];
      if (alpha > 10) {  // 非透明阈值
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  if (minX > maxX || minY > maxY) {
    // 全透明图，跳过
    console.log('  skip (fully transparent): ' + path.basename(filePath));
    return false;
  }
  
  // 裁剪非透明区域
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  
  const cropped = await sharp(filePath)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .toBuffer();
  
  // 缩放到 512 最大边保持比例
  const TARGET = 512;
  const scaled = await sharp(cropped)
    .resize(TARGET, TARGET, { fit: 'inside', withoutEnlargement: false })
    .toBuffer();
  
  const sm = await sharp(scaled).metadata();
  const sw = sm.width, sh = sm.height;
  
  // pad 成正方形
  const left = Math.round((TARGET - sw) / 2);
  const top = Math.round((TARGET - sh) / 2);
  
  await sharp({
    create: { width: TARGET, height: TARGET, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
  .composite([{ input: scaled, top, left }])
  .png()
  .toFile(filePath + '.tmp.png');
  
  fs.renameSync(filePath + '.tmp.png', filePath);
  console.log(path.basename(filePath) + ': cropped ' + cropW + 'x' + cropH + ' → ' + TARGET + 'x' + TARGET);
  return true;
}

async function run() {
  for (const f of files) {
    await trimAndPad(path.join(dir, f));
  }
  console.log('All done!');
}

const cliArg = process.argv[2];
if (cliArg === 'run') {
  run();
} else {
  console.log('Trim transparent edges and repad to 512x512 square for ' + files.length + ' files');
  console.log('Run with "run" arg to process');
}
