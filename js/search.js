/**
 * 暗区突围：无限 攻略站 — 全文搜索
 * 基于 Fuse.js 轻量模糊搜索
 */

const searchIndex = [
  // ========== 地图 ==========
  { type: '地图', title: '北山',    keywords: '北山 北山酒店 污水处理厂 观景台 雷达站 伐木场 中型 中等',       url: 'pages/maps.html#beishan' },
  { type: '地图', title: '山谷',    keywords: '山谷 别墅区 坠机点 雷达站 高地 大型 开放式 困难 PC',             url: 'pages/maps.html#valley' },
  { type: '地图', title: '军械库',   keywords: '军械库 地下 三层 CQB 室内 困难 高强度',                            url: 'pages/maps.html#armory' },
  { type: '地图', title: '农场',    keywords: '农场 汽车旅馆 仓库区 麦田 新手 入门 简单 交互地图',       url: 'pages/map-farm.html' },
  { type: '地图', title: '港口',    keywords: '港口 仓库 集装箱 码头 巷战 中等',                                   url: 'pages/maps.html#port' },
  { type: '地图', title: '电视台',   keywords: '电视台 演播大厅 控制室 地下车库 CQB 室内 中等',                    url: 'pages/maps.html#tvstation' },

  // ========== 枪械 ==========
  { type: '枪械', title: 'H416',       keywords: 'H416 AR 满改 后坐力 中距离 10万 15万',                  url: 'pages/weapons.html#h416' },
  { type: '枪械', title: 'M4A1',       keywords: 'M4 M4A1 AR 稳定 泛用 新手 压枪',                         url: 'pages/weapons.html#m4a1' },
  { type: '枪械', title: 'MPX',        keywords: 'MPX SMG 冲锋枪 近战 消音 室内 高射速',                  url: 'pages/weapons.html#mpx' },
  { type: '枪械', title: 'AX50',       keywords: 'AX50 狙击 狙 SR 一发 高倍镜 双脚架 北山 山谷',            url: 'pages/weapons.html#ax50' },
  { type: '枪械', title: 'Vector',     keywords: 'Vector 9mm 冲锋 SMG 射速 腰射 贴脸 一秒融化',            url: 'pages/weapons.html#vector' },
  { type: '枪械', title: 'FAL',        keywords: 'FAL DMR 精确射手 半自动 点射 中远',                     url: 'pages/weapons.html#fal' },
  { type: '枪械', title: 'AK74N',      keywords: 'AK74N AK AKM AR 平民 新手 3万 5万 过渡 压枪',            url: 'pages/weapons.html#ak74n' },
  { type: '枪械', title: 'MK14',       keywords: 'MK14 EBR DMR 精确射手 高伤害',                          url: 'pages/weapons.html#mk14' },

  // ========== 技巧 ==========
  { type: '技巧', title: '搜刮优先级',       keywords: '搜刮 路线 高价值 保险箱 撤离 舔包 PC',                      url: 'pages/strategy.html#looting' },
  { type: '技巧', title: '听声辨位',         keywords: '听声 脚步 换弹 开镜 耳机 声音 定位 PC 方向感',             url: 'pages/strategy.html#sound' },
  { type: '技巧', title: '经济管理',         keywords: '经济 仓库 免保 跑刀 全装 理财',                             url: 'pages/strategy.html#economy' },
  { type: '技巧', title: '架枪与反架',       keywords: '架枪 反架 peek 预瞄 点位 卡视角 PC 鼠标',                  url: 'pages/strategy.html#peek' },
  { type: '技巧', title: '组队配合',         keywords: '组队 配合 突破 架枪 支援 语音 三人队',                     url: 'pages/strategy.html#team' },
  { type: '技巧', title: '撤离路线',         keywords: '撤离 路线 条件撤离 固定撤离 时间',                          url: 'pages/strategy.html#extract' },
  { type: '技巧', title: '弹药选择',         keywords: '弹药 子弹 穿透 肉弹 三级 四级 五级 肉伤 护甲',            url: 'pages/strategy.html#ammo' },
  { type: '技巧', title: '医疗系统',         keywords: '医疗 治疗 手术包 止痛 止血 状态 骨折',                     url: 'pages/strategy.html#medic' },
  { type: '技巧', title: 'PC 键位设置',      keywords: '键位 键盘 鼠标 设置 灵敏度 按键 操作 PC',                  url: 'pages/strategy.html#keybind' },

  // ========== 配装 ==========
  { type: '配装', title: '跑刀装',     keywords: '跑刀 刀 免费 零成本 摸金 赌命',                         url: 'pages/gear.html#knife' },
  { type: '配装', title: '贫民装',     keywords: '贫民 3万 5万 跑刀 AK74N AKS 三级甲 耳机 低成本',        url: 'pages/gear.html#budget' },
  { type: '配装', title: '标准装',     keywords: '标准 8万 12万 H416 M4A1 四级甲 四级弹 均衡',           url: 'pages/gear.html#standard' },
  { type: '配装', title: '满配装',     keywords: '满配 20万 攻坚 H416 Vector 五级甲 六级甲 高级弹',       url: 'pages/gear.html#premium' },
  { type: '配装', title: '狙击装',     keywords: '狙击 架枪 远程 AX50 高倍镜 消音 山谷 北山',             url: 'pages/gear.html#sniper' },
];

// Fuse.js 搜索配置
let fuse = null;

function initFuse() {
  if (typeof Fuse === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0';
    script.onload = () => {
      fuse = new Fuse(searchIndex, {
        keys: ['title', 'keywords'],
        threshold: 0.4,
        includeScore: true,
      });
    };
    document.head.appendChild(script);
  } else {
    fuse = new Fuse(searchIndex, {
      keys: ['title', 'keywords'],
      threshold: 0.4,
      includeScore: true,
    });
  }
}

function doSearch(query) {
  if (!fuse) return [];
  if (!query.trim()) return searchIndex.slice(0, 8);
  const results = fuse.search(query);
  return results.map(r => r.item);
}

function renderResults(results, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = '<div class="search-empty">没有找到相关内容，试试其他关键词</div>';
    return;
  }

  container.innerHTML = results.map(item => `
    <a href="${item.url}" class="search-result-item">
      <span class="sr-type">${item.type}</span>
      <span class="sr-title">${item.title}</span>
      <span class="sr-desc">${item.keywords.split(' ').slice(0, 4).join(' · ')}</span>
    </a>
  `).join('');
}

function setupSearchInput(inputId, resultsId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener('input', (e) => {
    const results = doSearch(e.target.value);
    renderResults(results, resultsId);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const results = doSearch(e.target.value);
      renderResults(results, resultsId);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFuse();
  setupSearchInput('search-input', 'search-results');
});
