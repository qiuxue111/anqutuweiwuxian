import re

with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

for m in re.finditer(r"onclick='viewOnMap\(", c):
    # Find the closing
    start = m.start()
    i = m.end()
    depth = 1
    while depth > 0 and i < len(c):
        if c[i] == '(':
            depth += 1
        elif c[i] == ')':
            depth -= 1
        i += 1
    
    chunk = c[start:i]
    last10 = chunk[-10:]
    print(f"Last 10 chars: {repr(last10)}")
    print(f"Last 10 bytes: {last10.encode('utf8')}")
