import re

c = open('F:\\暗区突围网站\\pages\\maps.html', 'r', encoding='utf-8').read()

# 1. 北山
c = c.replace(
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>PC 版北山画面更远，观景台可以狙到酒店门</li>\n          <li>鼠标压枪更精准，远距离对 AR 也能</li>\n          <li>建议调高视角 FOV，增加视野范</li>\n          <li>夜战模式记得调低亮度设置</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 山谷 (ABI 专属) -->',
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>PC 版北山画面更远，观景台可以狙到酒店门</li>\n          <li>鼠标压枪更精准，远距离对 AR 也能</li>\n          <li>建议调高视角 FOV，增加视野范</li>\n          <li>夜战模式记得调低亮度设置</li>\n        </ul>\n      </div>\n      <div style="margin-top:1rem;">\n        <a href="map-beishan.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 山谷 (ABI 专属) -->'
)

# 2. 山谷
c = c.replace(
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>山谷 PC 版特色大图，远距离交火极</li>\n          <li>推荐带高倍镜 DMR 或狙击枪</li>\n          <li>别墅区资源最丰富但争夺最激</li>\n          <li>利用地形起伏做掩护，不要在开阔地奔跑</li>\n          <li>PC 版草丛渲染距离更远，伏地魔更难发</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 军械 (ABI 核心 -->',
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>山谷 PC 版特色大图，远距离交火极</li>\n          <li>推荐带高倍镜 DMR 或狙击枪</li>\n          <li>别墅区资源最丰富但争夺最激</li>\n          <li>利用地形起伏做掩护，不要在开阔地奔跑</li>\n          <li>PC 版草丛渲染距离更远，伏地魔更难发</li>\n        </ul>\n      </div>\n      <div style="margin-top:1rem;">\n        <a href="map-valley.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 军械 (ABI 核心 -->'
)

# 3. 军械库
c = c.replace(
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>军械库三层结构，垂直交战多，注意头顶和脚</li>\n          <li>PC 端听声辨位更清晰，可以精确判断楼上楼</li>\n          <li>推荐冲锋枪或短管 AR，转弯多长枪吃亏</li>\n          <li>手雷在室内战极其重要，清角落神器</li>\n          <li>建议带夜视仪，地下层光线极暗</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 农场 -->',
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>军械库三层结构，垂直交战多，注意头顶和脚</li>\n          <li>PC 端听声辨位更清晰，可以精确判断楼上楼</li>\n          <li>推荐冲锋枪或短管 AR，转弯多长枪吃亏</li>\n          <li>手雷在室内战极其重要，清角落神器</li>\n          <li>建议带夜视仪，地下层光线极暗</li>\n        </ul>\n      </div>\n      <div style="margin-top:1rem;">\n        <a href="map-armory.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 农场 -->'
)

# 4. 港口 -> 机场
c = c.replace(
    '      <div class="map-section">\n        <h3>💡 攻略要点</h3>\n        <ul>\n          <li>图小节奏快，推荐冲锋枪或霰弹</li>\n          <li>港口掩体多，适合迂回作战</li>\n          <li>指挥楼楼顶视野好，但容易被集</li>\n          <li>码头方向经常刷撤离点，提前规划路</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 电视-->',
    '      <div class="map-section">\n        <h3>💡 攻略要点</h3>\n        <ul>\n          <li>图小节奏快，推荐冲锋枪或霰弹</li>\n          <li>港口掩体多，适合迂回作战</li>\n          <li>指挥楼楼顶视野好，但容易被集</li>\n          <li>码头方向经常刷撤离点，提前规划路</li>\n        </ul>\n      </div>\n      <div style="margin-top:1rem;">\n        <a href="map-airport.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 电视-->'
)

# 5. 电视台
c = c.replace(
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>全室内地图，狙击枪无用，推荐冲锋 霰弹</li>\n          <li>PC 版脚步声方向感更准，电视台室内战利用好这</li>\n          <li>控制室有多个入口，守点的话要封两侧门</li>\n          <li>转角多容易遭遇，推荐腰射流配</li>\n        </ul>\n      </div>\n    </div>\n\n    <div style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">',
    '      <div class="map-section">\n        <h3>💡 PC 端攻略要</h3>\n        <ul>\n          <li>全室内地图，狙击枪无用，推荐冲锋 霰弹</li>\n          <li>PC 版脚步声方向感更准，电视台室内战利用好这</li>\n          <li>控制室有多个入口，守点的话要封两侧门</li>\n          <li>转角多容易遭遇，推荐腰射流配</li>\n        </ul>\n      </div>\n      <div style="margin-top:1rem;">\n        <a href="map-tvstation.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <div style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">'
)

# Rename 港口 -> 机场
c = c.replace('<h2>港口 <span class="badge badge-med">中等</span></h2>', '<h2>机场 <span class="badge badge-med">中等</span></h2>')
c = c.replace('id="port"', 'id="airport"')

with open('F:\\暗区突围网站\\pages\\maps.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('maps.html updated')

# Verify
for m in re.findall(r'href="map-([^"]+)"', c):
    print(f'  link: map-{m}')
