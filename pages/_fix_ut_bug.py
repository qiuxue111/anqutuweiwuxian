maps = ['map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = f'F:/暗区突围网站/pages/{m}.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    if 'panY = (h - ih * scaleM) / 2;\n    ut();' in t:
        t = t.replace('panY = (h - ih * scaleM) / 2;\n    ut();',
                      'panY = (h - ih * scaleM) / 2;\n    if (typeof ut === \'function\') ut();')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(t)
        print(f'{m}: fixed')
    else:
        print(f'{m}: already fixed or pattern not found')
