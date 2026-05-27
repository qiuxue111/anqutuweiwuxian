import re

with open("F:/暗区突围网站/pages/review.html", "rb") as f:
    data = f.read()

for m in re.finditer(b"viewOnMap", data):
    # Find the end - look for \') which closes the onclick
    end = data.find(b"')", m.start())
    if end < 0:
        end = m.start() + 200
    chunk = data[m.start():end+2]
    print(f"Found at {m.start()}")
    print(f"  Last 25 bytes: {chunk[-25:]}")
