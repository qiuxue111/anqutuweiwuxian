const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/sharp');

const dir = 'F:/暗区突围网站/assets/containers';
const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

const cliArg = process.argv[2];

async function run() {
  // 统一为 256x256，居中 pad 透明，保持比例
  const TARGET = 512;
  
  for (const f of files) {
    const fp = path.join(dir, f);
    const meta = await sharp(fp).metadata();
    const w = meta.width, h = meta.height;
    const maxSide = Math.max(w, h);
    
    // 先缩放到最大边 = TARGET（保持比例）
    const scaled = await sharp(fp)
      .resize(TARGET, TARGET, { fit: 'inside', withoutEnlargement: false })
      .toBuffer();
    
    const sm = await sharp(scaled).metadata();
    const sw = sm.width, sh = sm.height;
    
    // 然后 pad 到 TARGETxTARGET，居中
    const left = Math.round((TARGET - sw) / 2);
    const top = Math.round((TARGET - sh) / 2);
    
    await sharp({
      create: {
        width: TARGET,
        height: TARGET,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: scaled, top, left }])
    .png()
    .toFile(fp + '.tmp.png');
    
    fs.renameSync(fp + '.tmp.png', fp);
    console.log(f + ': ' + w + 'x' + h + ' → ' + TARGET + 'x' + TARGET + ' (scaled: ' + sw + 'x' + sh + ')');
  }
  
  console.log('All done!');
}

if (cliArg === 'run') {
  run();
} else {
  console.log('Preview mode - first 5 images:');
  files.slice(0, 5).forEach(f => {
    const fp = path.join(dir, f);
    sharp(fp).metadata().then(m => {
      console.log('  ' + f + ': ' + m.width + 'x' + m.height);
    });
  });
  console.log('\nRun with "run" arg to process all ' + files.length + ' images to 256x256 square with transparent padding');
}
