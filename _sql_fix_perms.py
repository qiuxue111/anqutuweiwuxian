sql = """
-- 先给匿名 key 的 schema 权限，否则无法引用序列
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON post_comments TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 或者更简单的办法：直接调整策略允许所有认证用户
DROP POLICY IF EXISTS "认证用户可评论" ON post_comments;
CREATE POLICY "认证用户可评论" ON post_comments 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- 也检查一下有没有给 anon 读取序列的权限
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
"""
print(sql)
