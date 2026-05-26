/**
 * approve-changes.js — 审核并合并用户提交的点位修改
 * 
 * 工作流程：
 * 1. 从 data/review-queue.json 读取待审批队列（用户浏览器提交的）
 * 2. 从 data/pins.json 读取当前云端点位
 * 3. 合并新增、删除、修改
 * 4. 清空审核队列，写入 data/pins.json
 * 5. user 也可以自己手动造这个 json 文件来批量审核
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PINS_FILE = path.join(DATA_DIR, 'pins.json');
const REVIEW_FILE = path.join(DATA_DIR, 'review-queue.json');

// 如果审核队列不存在，正常退出
if (!fs.existsSync(REVIEW_FILE)) {
  console.log('✅ 没有待审核的队列');
  process.exit(0);
}

let queue;
try {
  queue = JSON.parse(fs.readFileSync(REVIEW_FILE, 'utf8'));
} catch (e) {
  console.log('❌ 审核队列解析失败:', e.message);
  process.exit(1);
}

// 检查是否有待审批项
const total = (queue.additions||[]).length + (queue.deletions||[]).length + (queue.edits||[]).length + (queue.mapComments||[]).length;
if (total === 0) {
  console.log('✅ 没有待审核的内容');
  fs.unlinkSync(REVIEW_FILE); // 删除空文件
  process.exit(0);
}

// 读取当前云端点位
let cloudData = { pins: [], mapComments: [] };
try {
  cloudData = JSON.parse(fs.readFileSync(PINS_FILE, 'utf8'));
} catch (e) {
  console.log('⚠️ 无法读取 pins.json，将创建新的');
}

// --- 合并新增 ---
let added = 0;
(queue.additions||[]).forEach(function(a) {
  cloudData.pins.push({
    x: a.x, y: a.y, name: a.name, type: a.type, ic: a.ic,
    note: a.note || '',
    images: a.images || [],
    comments: (a.comments || []).filter(function(c) { return !c._pending; })
  });
  added++;
});

// --- 合并删除 ---
let deleted = 0;
(queue.deletions||[]).forEach(function(d) {
  for (let i = cloudData.pins.length - 1; i >= 0; i--) {
    const p = cloudData.pins[i];
    if ((p.x === d.x || p.x == d.x) && (p.y === d.y || p.y == d.y) && (!d.type || p.type === d.type)) {
      cloudData.pins.splice(i, 1);
      deleted++;
      break;
    }
  }
});

// --- 合并修改 ---
let edited = 0;
(queue.edits||[]).forEach(function(ed) {
  for (let i = 0; i < cloudData.pins.length; i++) {
    const p = cloudData.pins[i];
    if ((p.x === ed.x || p.x == ed.x) && (p.y === ed.y || p.y == ed.y)) {
      if (ed.note !== undefined) p.note = ed.note;
      edited++;
      break;
    }
  }
});

// --- 合并地图评论 ---
let commentsAdded = 0;
(queue.mapComments||[]).forEach(function(c) {
  cloudData.mapComments.push({
    text: c.text,
    time: c.time
  });
  commentsAdded++;
});

// --- 写入 ---
fs.writeFileSync(PINS_FILE, JSON.stringify(cloudData, null, 2), 'utf8');

// --- 清空审核队列 ---
fs.unlinkSync(REVIEW_FILE);

console.log(`✅ 审核完成，已合并：`);
console.log(`   ➕ 新增点位: ${added} 个`);
console.log(`   ➖ 删除点位: ${deleted} 个`);
console.log(`   ✏️  修改备注: ${edited} 个`);
console.log(`   💬 地图评论: ${commentsAdded} 条`);
console.log(`   📝 共 ${cloudData.pins.length} 个点位`);
