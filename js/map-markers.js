/**
 * 暗区突围：无限 — 物资点地图图层系统
 * 
 * 用法：
 * 1. 把地图图片放到 assets/maps/ 目录
 * 2. 在 markers 数组中添加物资点坐标
 * 3. 网页上自动生成图层开关
 */

// ========== 地图配置 ==========
const mapConfigs = {
  beishan: {
    name: '北山',
    image: '../assets/maps/beishan.jpg',  // 替换为你的地图图片
    markers: [
      // { x: %, y: %, label: '名字', type: '武器箱|文件柜|保险箱|钥匙房|工具箱|高级物资', icon: '🔫' }
    ]
  },
  valley: {
    name: '山谷',
    image: '../assets/maps/valley.jpg',
    markers: []
  },
  armory: {
    name: '军械库',
    image: '../assets/maps/armory.jpg',
    markers: []
  },
  farm: {
    name: '农场',
    image: '../assets/maps/farm.jpg',
    markers: []
  },
  port: {
    name: '港口',
    image: '../assets/maps/port.jpg',
    markers: []
  },
  tvstation: {
    name: '电视台',
    image: '../assets/maps/tvstation.jpg',
    markers: []
  }
};

// ========== 物资点类型与颜色 ==========
const markerTypes = {
  '武器箱':     { color: '#f66', icon: '🔫', enabled: true },
  '文件柜':     { color: '#66f', icon: '📁', enabled: true },
  '保险箱':     { color: '#ffc832', icon: '💰', enabled: true },
  '钥匙房':     { color: '#f6f', icon: '🔑', enabled: true },
  '工具箱':     { color: '#6f6', icon: '🔧', enabled: true },
  '高级物资':   { color: '#ff6', icon: '💎', enabled: true },
  '刷新点':     { color: '#f90', icon: '👤', enabled: true },
  '撤离点':     { color: '#0f0', icon: '🚁', enabled: true },
  '复活点':     { color: '#0ff', icon: '📍', enabled: true },
};

// ========== 初始化地图查看器 ==========
function initMapViewer(mapId, containerId) {
  const config = mapConfigs[mapId];
  if (!config) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  // 创建地图容器
  container.innerHTML = `
    <div class="map-viewer" data-map="${mapId}">
      <div class="map-image-container">
        <img src="${config.image}" alt="${config.name}" class="map-image"
             onerror="this.parentElement.innerHTML='<div class=\\'map-placeholder\\'><span>📷</span><p>地图图片未上传</p><p style=\\'font-size:0.8rem;color:#666;\\'>请将 ${config.name} 地图图片放到 assets/maps/ 目录</p><p style=\\'font-size:0.8rem;color:#666;\\'>文件名: ${config.image.replace('../','')}</p></div>'">
        <div class="map-markers"></div>
      </div>
      <div class="map-controls">
        <div class="mc-header">
          <span class="mc-title">📌 物资点图层</span>
          <label class="mc-toggle-all">
            <input type="checkbox" checked onchange="toggleAllMarkers('${mapId}', this.checked)">
            <span>全选</span>
          </label>
        </div>
        <div class="mc-types" id="mc-types-${mapId}"></div>
      </div>
    </div>
  `;

  // 生成类型开关
  const typesContainer = document.getElementById(`mc-types-${mapId}`);
  if (typesContainer) {
    Object.entries(markerTypes).forEach(([type, cfg]) => {
      const label = document.createElement('label');
      label.className = 'mc-type-item';
      label.innerHTML = `
        <input type="checkbox" ${cfg.enabled ? 'checked' : ''}
               data-type="${type}" onchange="toggleMarkerType('${mapId}', '${type}', this.checked)">
        <span class="mc-dot" style="background:${cfg.color}"></span>
        <span>${cfg.icon} ${type}</span>
      `;
      typesContainer.appendChild(label);
    });
  }

  // 如果有标记点则渲染
  renderMarkers(mapId, containerId);
}

// ========== 渲染标记点 ==========
function renderMarkers(mapId, containerId) {
  const config = mapConfigs[mapId];
  const container = document.getElementById(containerId);
  if (!container || !config) return;

  const markersContainer = container.querySelector('.map-markers');
  if (!markersContainer) return;

  markersContainer.innerHTML = '';

  config.markers.forEach((marker, i) => {
    const typeConfig = markerTypes[marker.type];
    if (!typeConfig || !typeConfig.enabled) return;

    const el = document.createElement('div');
    el.className = 'map-marker';
    el.setAttribute('data-type', marker.type);
    el.style.left = marker.x + '%';
    el.style.top = marker.y + '%';
    el.style.background = typeConfig.color;
    el.innerHTML = `<span class="mm-icon">${typeConfig.icon}</span>`;
    el.title = `${marker.label} (${marker.type})`;
    
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      showMarkerDetail(marker);
    });

    markersContainer.appendChild(el);
  });
}

// ========== 切换物资点类型 ==========
function toggleMarkerType(mapId, type, enabled) {
  if (markerTypes[type]) {
    markerTypes[type].enabled = enabled;
  }
  
  // 重新渲染标记
  const container = document.querySelector(`[data-map="${mapId}"]`);
  if (container) {
    const markersContainer = container.querySelector('.map-markers');
    if (markersContainer) {
      // 显示/隐藏对应类型的标记
      markersContainer.querySelectorAll('.map-marker').forEach(el => {
        if (el.getAttribute('data-type') === type) {
          el.style.display = enabled ? 'flex' : 'none';
        }
      });
    }
  }
}

// ========== 切换全部 ==========
function toggleAllMarkers(mapId, enabled) {
  const container = document.querySelector(`[data-map="${mapId}"]`);
  if (!container) return;

  // 更新所有 checkbox
  container.querySelectorAll('.mc-type-item input[type="checkbox"]').forEach(cb => {
    cb.checked = enabled;
    const type = cb.getAttribute('data-type');
    if (type && markerTypes[type]) {
      markerTypes[type].enabled = enabled;
    }
  });

  // 更新所有标记显示
  const markersContainer = container.querySelector('.map-markers');
  if (markersContainer) {
    markersContainer.querySelectorAll('.map-marker').forEach(el => {
      el.style.display = enabled ? 'flex' : 'none';
    });
  }
}

// ========== 显示标记详情 ==========
function showMarkerDetail(marker) {
  // 可以扩展为弹窗显示详细信息
  console.log('物资点:', marker);
}

// ========== 添加标记点的辅助函数 ==========
function addMarker(mapId, x, y, label, type) {
  if (!mapConfigs[mapId]) return;
  mapConfigs[mapId].markers.push({ x, y, label, type });
}

// 批量添加标记
function addMarkers(mapId, markers) {
  if (!mapConfigs[mapId]) return;
  mapConfigs[mapId].markers.push(...markers);
}

// ========== DOM 就绪后初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-map-viewer]').forEach(el => {
    const mapId = el.getAttribute('data-map-viewer');
    initMapViewer(mapId, el.id);
  });
});
