c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Find all script tags
import re
scripts = re.findall(r'<script>(.*?)</script>', c, re.DOTALL)
print("Number of script blocks:", len(scripts))
for i, s in enumerate(scripts):
    first_line = s.split('\n')[0][:100] if s.split('\n')[0].strip() else '(empty)'
    # Check for key functions
    has_init = "function initAuth" in s
    has_toggle = "function toggleMenu" in s
    has_login = "function loginGitHub" in s
    has_open = "function openPostModal" in s
    print(f"  Block {i}: {first_line[:80]}...")
    print(f"    toggleMenu={has_toggle} loginGitHub={has_login} openPostModal={has_open}")
