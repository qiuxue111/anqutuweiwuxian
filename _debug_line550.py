c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
lines = c.split('\n')
if len(lines) >= 551:
    print(f"Line 550: {lines[549]}")
else:
    # Find it by char position
    print(f"File has {len(lines)} lines")
    # Find position ~550 chars from end of script
    import re
    scripts = re.findall(r'<script>([\s\S]*?)</script>', c)
    if scripts:
        s = scripts[0]
        lines_in_script = s.split('\n')
        if len(lines_in_script) >= 550:
            print(f"Script line 550: {lines_in_script[549]}")
        else:
            # Print last few lines
            print(f"Script has {len(lines_in_script)} lines")
            for i in range(max(0, len(lines_in_script)-5), len(lines_in_script)):
                print(f"  Script line {i}: {lines_in_script[i][:150]}")
