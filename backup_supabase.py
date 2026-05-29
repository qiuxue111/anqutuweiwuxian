#!/usr/bin/env python3
"""
Supabase 数据备份脚本
用法：python backup_supabase.py
导出的 JSON 文件保存在 F:/暗区突围网站/backups/ 目录下
然后可以手动 git add/commit/push
"""

import urllib.request, json, os, sys
from datetime import datetime

SUPABASE_URL = "https://brrpbtuxgecufcvnmcdb.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycnBidHV4Z2VjdWZjdm5tY2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTI1NzEsImV4cCI6MjA2MTEyODU3MX0.RFXfEqUj5Z5YjSLxTMjk7kjlo14ggcPpLMxVsrceHqg"

TABLES = ["pins", "pending_pins", "deletion_requests", "map_comments"]

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": "Bearer " + ANON_KEY,
    "Accept": "application/json"
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKUP_DIR = os.path.join(BASE_DIR, "backups")

def fetch_table(name):
    """Fetch all rows from a Supabase table"""
    url = f"{SUPABASE_URL}/rest/v1/{name}?select=*"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
            print(f"  {name}: {len(data)} 条记录")
            return data
    except Exception as e:
        print(f"  {name}: 获取失败 - {e}")
        return None

def main():
    print(f"=== Supabase 数据备份 === {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    all_data = {}
    total = 0
    for table in TABLES:
        data = fetch_table(table)
        if data is not None:
            all_data[table] = data
            total += len(data)
    
    if total == 0:
        print("没有获取到任何数据，备份中止")
        return 1
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"supabase_backup_{timestamp}.json"
    filepath = os.path.join(BACKUP_DIR, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    file_size = os.path.getsize(filepath) / 1024
    print(f"\n备份完成：{filename} ({file_size:.1f} KB, {total} 条记录)")
    print(f"路径：{filepath}")
    
    # 下一步提示
    print("\n提交到 Git：")
    print(f"  git add backups/{filename}")
    print("  git commit -m \"backup: supabase 数据备份\"")
    print("  git push")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
