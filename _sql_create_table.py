sql = """
-- 第一步：创建评论表
CREATE TABLE post_comments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id bigint REFERENCES map_posts(id) ON DELETE CASCADE,
  author text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 第二步：开启 RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 第三步：所有人可看评论
CREATE POLICY "所有人看评论" ON post_comments FOR SELECT TO anon, authenticated USING (true);

-- 第四步：认证用户可发评论
CREATE POLICY "认证用户可评论" ON post_comments FOR INSERT TO authenticated WITH CHECK (true);

-- 第五步：自己的评论可删
CREATE POLICY "自己可删评论" ON post_comments FOR DELETE TO authenticated 
  USING (author = (auth.jwt() ->> 'preferred_username'));

-- 第六步：帖子表加删除策略
CREATE POLICY "作者可删帖" ON map_posts FOR DELETE TO authenticated 
  USING (author = (auth.jwt() ->> 'preferred_username'));
"""
print(sql)
