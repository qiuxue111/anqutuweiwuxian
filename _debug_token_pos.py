c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Show context around position 16654 and 20528
for pos in [16654, 20528, 21265, 23766]:
    st = max(0, pos-100)
    en = min(len(c), pos+200)
    print(f"=== Position {pos} ===")
    print(c[st:en])
    print()
