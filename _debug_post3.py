c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()

# Find submitPost and print it
st = c.index('function submitPost')
depth = 0
in_func = False
i = st
while i < len(c):
    if c[i] == '{':
        depth += 1
        in_func = True
    elif c[i] == '}':
        depth -= 1
        if in_func and depth == 0:
            print(c[st:i+1])
            break
    i += 1
