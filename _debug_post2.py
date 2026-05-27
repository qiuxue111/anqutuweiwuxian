c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
scripts = ['']
depth = 0
in_script = False
i = 0
while i < len(c):
    if c[i:i+8] == '<script>':
        in_script = True
        depth = 0
        j = i + 8
        script_text = ''
        while j < len(c):
            if c[j:j+9] == '</script>':
                scripts.append(script_text)
                i = j + 8
                break
            script_text += c[j]
            j += 1
        continue
    i += 1

# Check order: db, esc, loadPosts, submitPost
for s in ['function db(', 'function esc(', 'function loadPosts(', 'function submitPost(', 'function fabOpenPostForm(']:
    for idx, scr in enumerate(scripts):
        if s in scr:
            print(s + ' found in script block ' + str(idx))
            break
    else:
        print(s + ' NOT FOUND')
