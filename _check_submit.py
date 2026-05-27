# Test if the existing RLS policy actually works
# Try INSERT with a fake authenticated token
import urllib.request
import json

# Use anon key - this should fail with 42501 (role=anon)
# But with authenticated role it should pass
# Let's test if there's a way to confirm the policy works

# The issue might be different - maybe the token the user has is expired or wrong
# Or maybe the submitPost isn't getting the right token

# Let's check the actual submitPost code to see what token it uses
c = open("F:/暗区突围网站/pages/gear.html", "r", encoding="utf8").read()
st = c.index("function submitPost")
en = c.index("function fabOpenPostForm", st)
print(c[st:en])
