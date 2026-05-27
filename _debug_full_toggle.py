c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
idx = c.index("async function toggleLike")
# Find the next function after toggleLike
end_idx = c.index("\n\nasync ", idx+1) if "\n\nasync " in c[idx+1:] else idx + 500
print(f"Full toggleLike ({idx}-{end_idx}):")
print(c[idx:end_idx])
