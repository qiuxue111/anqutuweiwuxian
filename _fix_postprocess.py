with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The outer wrapper is html+="..." (double quotes)
# Inside, the data-map-name needs to be part of the HTML attribute value
# 
# Current (broken): data-map-name=\'\\+(p.map_name||"")+\\\'
#                 Note the unescaped " in the middle -> JS syntax error
#
# We need: data-map-name=\'+(p.map_name||\"\")+\'
#           The \" is escaped double quote inside the JS double-quoted string
#           The ' is a regular character (HTML attribute delimiter)
#
# The JS evaluates to HTML: data-map-name='+(p.map_name||"")+'
# Which means data-map-name gets the literal string '+(map_name||"")+'
# 
# ACTUALLY, let me think again. The html+="..." is JS string inside <script>.
# The innerHTML gets set to the value of this string.
# So after JS executes:
#   data-map-name=\'+(p.map_name||\"\")+\'
# The \" becomes " (escaped double quote in double-quoted JS string)
# The \' becomes ' (which in HTML is an attribute delimiter)
# So the DOM gets: data-map-name='+(p.map_name||"")+'
# Which sets data-map-name to the literal text: '"+(p.map_name||"")+"'
#
# The CORRECT way: make data-map-name use the VALUE of p.map_name:
# data-map-name=\'\"+p.map_name+\"\'
# In the JS string: data-map-name=\'\"+p.map_name+\"\'
# Which renders HTML: data-map-name='"+p.map_name+"'
# Which is invalid HTML (double quote inside single quote attribute)
#
# Alternative: use double quotes for data-map-name:
# data-map-name=\"+p.map_name+\"
# In JS string: data-map-name=\"+p.map_name+\"
# After JS execution: data-map-name="+p.map_name+"  
# Wait, the +p.map_name+ is INSIDE the JS string, not JS code
#
# The fundamental problem: we're inside a JS string, so +p.map_name+ doesn't execute
# 
# For JS template strings with variables, we'd use:
#   html += "...' data-map-name=" + p.map_name + "' ..."
# But the current code doesn't use this pattern for data-map-name
#
# ACTUAL FIX: Don't embed data-map-name inside html+= string directly
# Instead, add it as a string concatenation:
#   html += "...' data-ic='...' " + " data-map-name='" + (p.map_name||"") + "' style='...'>"
# Or simpler: just set the attribute via JS after rendering

# Simplest approach: add data-map-name via .setAttribute after innerHTML
# But that requires changing the rendering architecture
#
# Next simplest: compute mapPage in the viewOnMap function from the data 
# that's ALREADY available. Since p.map_name contains "map-tvstation", 
# we can create a mapping from available data.
#
# OR: change the click handler to determine map from the button's position
# or other attributes already present
#
# BEST SIMPLE FIX: stop using data-map-name, instead look up the map from
# the button's parent chain. Find the card with the map name in it.
# OR: store map_name as data-map instead (using different quoting)

# Let me try the simplest approach: 
# Use data-map-name=\"+p.map_name+\" (double-quoted HTML attribute)
# Inside the JS double-quoted string, this means:
# ... data-map-name=\\\"+p.map_name+\\\" ...
# But that's inside html+="..." - we can't interpolate p.map_name

# OK THE SIMPLEST WORKING APPROACH:
# Don't use innerHTML interpolation at all. 
# After setting innerHTML, go through all .view-on-map-btn and set their
# data-map-name from the data JSON.

# Find the renderList function end to add post-processing
idx = c.find("function renderList")
if idx >= 0:
    # Find the end of renderList - look for "function" after it
    next_fn = c.find("function renderDels", idx)
    render_list_end = c.rfind("}", 0, next_fn)
    
    # After innerHTML assignment, add code to set map-name
    innerhtml_assign = "document.getElementById(\"list\").innerHTML=html;"
    post_process = """document.getElementById("list").innerHTML=html;
  // Fix data-map-name from window.__reviewData
  var __cards=document.querySelectorAll('.view-on-map-btn');
  var __data=window.__reviewPending||[];
  __cards.forEach(function(btn,i){
    if(__data[i])btn.dataset.mapName=__data[i].map_name||'';
  });"""
    
    if innerhtml_assign in c:
        c = c.replace(innerhtml_assign, post_process)
        print("renderList: Added post-process for map names")

# Also need to store __reviewPending when data loads
idx2 = c.find("function renderDels")
if idx2 >= 0:
    next_fn2 = c.find("function ", c.find("function ", idx2) + 1)
    innerhtml_assign2 = "document.getElementById(\"list\").innerHTML=html;"
    
    if innerhtml_assign2 in c[c.index("renderDels"):]:
        # There might be two innerHTML assignments - this is the second one
        # Count occurrences
        cnt = c.count(innerhtml_assign2)
        print(f"Found {cnt} innerHTML assignments")
        # Replace the second occurrence
        # Let's just replace both
        post_process2 = """document.getElementById("list").innerHTML=html;
  // Fix data-map-name from window.__reviewData
  var __cards2=document.querySelectorAll('.view-on-map-btn');
  var __data2=window.__reviewDels||[];
  __cards2.forEach(function(btn,i){
    if(__data2[i])btn.dataset.mapName=__data2[i].map_name||'';
  });"""

# Actually let's use a simpler approach: set __reviewPending when loading data
# Find where loadData stores the response
idx3 = c.find("function loadData")
if idx3 >= 0:
    # Find where Promise.all resolves
    if "Promise.all" in c:
        # Replace the .then callback to store data
        old_promise = "Promise.all([p,d,pin]).then(function(res){"
        new_promise = "Promise.all([p,d,pin]).then(function(res){window.__reviewPending=res[0];window.__reviewDels=res[1];"
        c = c.replace(old_promise, new_promise)
        print("Added data storage")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
if "__reviewPending" in c2:
    print("OK - data stored")
if "__cards=document.querySelectorAll" in c2:
    print("OK - post-process added")
    
# Remove the console.log debug line
old_log = "console.log('[viewOnMap] mapName:',mapName);"
if old_log in c2:
    c2 = c2.replace(old_log, "")
    with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
        f.write(c2)
    print("Debug log removed")
