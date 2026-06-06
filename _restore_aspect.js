const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/sharp');

const dir = 'F:/暗区突围网站/assets/containers';
const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
const TARGET = 512;

async function run() {
  for (const f of files) {
    const fp = path.join(dir, f);
    const meta = await sharp(fp).metadata();
    const w = meta.width, h = meta.height;
    const maxSide = Math.max(w, h);
    
    // 缩放到最长边 = TARGET，保持比例（不裁切）
    const scaled = await sharp(fp)
      .resize(TARGET, TARGET, { fit: 'inside', withoutEnlargement: false })
      .toBuffer();
    
    const sm = await sharp(scaled).metadata();
    const sw = sm.width, sh = sm.height;
    
    // pad 到 TARGET x TARGET 正方形，透明边
    const left = Math.round((TARGET - sw) / 2);
    const top = Math.round((TARGET - sh) / 2);
    
    await sharp({
      create: { width: TARGET, height: TARGET, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    })
    .composite([{ input: scaled, top, left }])
    .png()
    .toFile(fp + '.tmp.png');
    
    fs.renameSync(fp + '.tmp.png', fp);
    console.log(f + ': ' + w + 'x' + h + ' → ' + sw + 'x' + sh + ' padded to ' + TARGET + 'x' + TARGET);
  }
  console.log('All done!');
}

const cliArg = process.argv[2];
if (cliArg === 'run') {
  run();
} else {
  console.log('Will resize ' + files.length + ' images: max side = ' + TARGET + ', keep aspect ratio, pad transparent');
  console.log('Run with "run" arg');
}
