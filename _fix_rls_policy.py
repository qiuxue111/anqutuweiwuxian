import urllib.request, json

# Try to get the actual column names from auth.users
# First, let's see what a user token looks like
# The website stores the JWT payload, not the raw user data

# Actually, the issue is the SQL uses auth.jwt() which returns the JWT payload
# auth.jwt()->'user_metadata' might not exist, but maybe it's at a different path
# Let's test the actual JWT
import base64

# The anon key won't help - we need a real user token
# But we know from the website JS that payload structure is:
# payload.user_metadata.preferred_username

# In SQL, auth.jwt() returns the JWT payload, which has the same structure
# So auth.jwt()->'user_metadata'->>'preferred_username' should work
# Unless the Supabase version uses a different path

# Let's try a simpler policy:
# Just check if the author matches the authenticated user's email
# auth.jwt() ->> 'email' is more commonly available

print("Use this SQL instead:")

sql = """
CREATE POLICY "作者可删帖" ON map_posts FOR DELETE TO authenticated 
  USING (author = (auth.jwt() ->> 'preferred_username'));

CREATE POLICY "自己可删评论" ON post_comments FOR DELETE TO authenticated 
  USING (author = (auth.jwt() ->> 'preferred_username'));
"""
print(sql)
