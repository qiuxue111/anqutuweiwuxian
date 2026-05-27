files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

old = """    <div class="pd-comments">
      <div class="pdc-title">💬 评论区</div>
      <textarea id="pdcInput" placeholder="对这个容器有什么想说的？"></textarea>
      <button class="pdc-btn" onclick="submitPinComment()">发表</button>
      <div class="pdc-list" id="pdcList"></div>
    </div>"""

new = """    <div class="pd-comments">
      <div class="pdc-title">💬 评论区</div>
      <div style="display:flex;gap:4px;align-items:flex-start;">
        <textarea id="pdcInput" placeholder="对这个容器有什么想说的？" style="flex:1;min-height:50px;"></textarea>
        <button class="pdc-btn" onclick="submitPinComment()" style="white-space:nowrap;">\u53d1\u8868</button>
      </div>
      <div class="pdc-file-row" style="display:flex;gap:6px;margin:4px 0;align-items:center;">
        <label style="width:32px;height:32px;border-radius:50%;background:#333;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;color:#fff;">+<input type="file" id="pdcFileInput" accept="image/*" multiple style="display:none" onchange="previewPinCommentFiles(this)"></label>
        <span id="pdcFileCount" style="font-size:0.7rem;color:#888;">\u672a\u9009\u62e9\u56fe\u7247</span>
      </div>
      <div id="pdcFilePreview" style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0;"></div>
      <div class="pdc-list" id="pdcList"></div>
    </div>"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    if old in c:
        c = c.replace(old, new)
        print(f'{fp.split("/")[-1]}: added file upload UI')
    else:
        print(f'{fp.split("/")[-1]}: OLD HTML NOT FOUND')
        # Show what's actually there
        idx = c.find('pd-comments')
        if idx >= 0:
            end = c.find('</div>', idx) + 6
            for _ in range(5):
                end = c.find('</div>', end) + 6
            print(f'  Found area: {c[idx:end][:200]}...')
    open(fp, 'w', encoding='utf8').write(c)
