c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
import re
ms = re.findall(r'<script>([\s\S]*?)</script>', c)
s = ';'.join(ms)

# Count braces in HTML file context
total_ob = c.count('{')
total_cb = c.count('}')
print(f"HTML file: {'{'}={total_ob} {'}'}={total_cb}")
# The last script only
last_script = ms[-1] if ms else ''
ob = last_script.count('{')
cb = last_script.count('}')
print(f"Last script only: {'{'}={ob} {'}'}={cb}")

# Show last 300 chars of last script
print("\n--- Last 300 chars ---")
print(last_script[-300:])
