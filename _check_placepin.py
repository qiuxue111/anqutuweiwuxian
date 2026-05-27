files = ["map-farm", "map-airport", "map-armory", "map-beishan", "map-tvstation", "map-valley"]
for f in files:
    with open(f"F:/暗区突围网站/pages/{f}.html", "r", encoding="utf8") as fh:
        c = fh.read()
    idx = c.find("function placePin")
    if idx >= 0:
        end = c.find("function renderLayers", idx)
        if end < 0:
            end = c.find("function ", idx + 20)
        fn = c[idx:end]
        # Show just the submission part
        supabase_idx = fn.find("supabase(")
        if supabase_idx >= 0:
            print(f"--- {f} ---")
            print(fn[supabase_idx-20:supabase_idx+200])
            print()
