import re

path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Change ALL sessionStorage.getItem('abi_token') to also check localStorage
# Actually, the real fix: change all sessionStorage to localStorage for abi_* keys
count = 0
t = t.replace("sessionStorage.getItem('abi_token')", "localStorage.getItem('abi_token')")
t = t.replace("sessionStorage.setItem('abi_token'", "localStorage.setItem('abi_token'")
t = t.replace("sessionStorage.getItem('abi_user')", "localStorage.getItem('abi_user')")
t = t.replace("sessionStorage.setItem('abi_user'", "localStorage.setItem('abi_user'")
t = t.replace("sessionStorage.removeItem('abi_token')", "localStorage.removeItem('abi_token')")
t = t.replace("sessionStorage.removeItem('abi_user')", "localStorage.removeItem('abi_user')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3 switched sessionStorage -> localStorage')
