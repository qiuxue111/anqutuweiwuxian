c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()

# Find submitMapComment and related functions
for func in ['submitMapComment', 'submitPinComment', 'postPinComment', 'postMapComment', 'loadCloudMarkers', 'renderMapComments']:
    if func in c:
        idx = c.index(func)
        # Find function body
        end = c.find('\nfunction', idx+1) if '\nfunction' in c[idx+100:] else idx+500
        print(f"=== {func} ===")
        print(c[idx:min(end, idx+500)])
        print()
    else:
        print(f"=== {func} === NOT FOUND\n")
