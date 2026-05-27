# Create post_likes table (missing!) and fix all RLS policies
# Run this in Supabase SQL Editor

sql = """
-- ===== 1. post_likes 表（缺失！）=====
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES map_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "所有人可查看点赞" ON post_likes;
CREATE POLICY "所有人可查看点赞" ON post_likes FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "所有人可点赞" ON post_likes;
CREATE POLICY "所有人可点赞" ON post_likes FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "所有人可取消点赞" ON post_likes;
CREATE POLICY "所有人可取消点赞" ON post_likes FOR DELETE TO anon, authenticated USING (true);

GRANT ALL ON post_likes TO anon, authenticated;
GRANT USAGE ON SEQUENCE post_likes_id_seq TO anon, authenticated;

-- ===== 2. like_post 函数 =====
DROP FUNCTION IF EXISTS like_post(integer, text);
CREATE OR REPLACE FUNCTION like_post(post_id integer, user_name text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  existing_id integer;
  new_count integer;
BEGIN
  SELECT id INTO existing_id FROM post_likes WHERE post_id = like_post.post_id AND user_id = like_post.user_name;
  IF existing_id IS NOT NULL THEN
    DELETE FROM post_likes WHERE id = existing_id;
  ELSE
    INSERT INTO post_likes (post_id, user_id) VALUES (like_post.post_id, like_post.user_name);
  END IF;
  SELECT COUNT(*) INTO new_count FROM post_likes WHERE post_id = like_post.post_id;
  UPDATE map_posts SET likes_count = new_count WHERE id = like_post.post_id;
  RETURN new_count;
END;
$$;
GRANT EXECUTE ON FUNCTION like_post(integer, text) TO anon, authenticated;

-- ===== 3. map_posts RLS =====
ALTER TABLE map_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可发帖" ON map_posts;
CREATE POLICY "所有人可发帖" ON map_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "所有人可读帖" ON map_posts;
CREATE POLICY "所有人可读帖" ON map_posts FOR SELECT TO anon, authenticated USING (true);
GRANT ALL ON map_posts TO anon, authenticated;
GRANT USAGE ON SEQUENCE map_posts_id_seq TO anon, authenticated;

-- ===== 4. post_comments RLS =====
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可评论帖子" ON post_comments;
CREATE POLICY "所有人可评论帖子" ON post_comments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "所有人可读帖子评论" ON post_comments;
CREATE POLICY "所有人可读帖子评论" ON post_comments FOR SELECT TO anon, authenticated USING (true);
GRANT ALL ON post_comments TO anon, authenticated;
GRANT USAGE ON SEQUENCE post_comments_id_seq TO anon, authenticated;

-- ===== 5. map_comments RLS =====
ALTER TABLE map_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可评论地图" ON map_comments;
CREATE POLICY "所有人可评论地图" ON map_comments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "所有人可读地图评论" ON map_comments;
CREATE POLICY "所有人可读地图评论" ON map_comments FOR SELECT TO anon, authenticated USING (true);
GRANT ALL ON map_comments TO anon, authenticated;
GRANT USAGE ON SEQUENCE map_comments_id_seq TO anon, authenticated;

-- ===== 6. pending_pins RLS =====
ALTER TABLE pending_pins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可申请点位" ON pending_pins;
CREATE POLICY "所有人可申请点位" ON pending_pins FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "所有人可读待审点位" ON pending_pins;
CREATE POLICY "所有人可读待审点位" ON pending_pins FOR SELECT TO anon, authenticated USING (true);
GRANT ALL ON pending_pins TO anon, authenticated;
GRANT USAGE ON SEQUENCE pending_pins_id_seq TO anon, authenticated;

-- ===== 7. deletion_requests RLS =====
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可申请删除" ON deletion_requests;
CREATE POLICY "所有人可申请删除" ON deletion_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "所有人可读删除申请" ON deletion_requests;
CREATE POLICY "所有人可读删除申请" ON deletion_requests FOR SELECT TO anon, authenticated USING (true);
GRANT ALL ON deletion_requests TO anon, authenticated;
GRANT USAGE ON SEQUENCE deletion_requests_id_seq TO anon, authenticated;

-- ===== 8. pins RLS =====
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "所有人可读已审核点位" ON pins;
CREATE POLICY "所有人可读已审核点位" ON pins FOR SELECT TO anon, authenticated USING (true);
GRANT ALL ON pins TO anon, authenticated;
GRANT USAGE ON SEQUENCE pins_id_seq TO anon, authenticated;

-- ===== 9. Storage bucket =====
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post_images', 'post_images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "所有人可上传图片" ON storage.objects;
CREATE POLICY "所有人可上传图片" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'post_images');
DROP POLICY IF EXISTS "所有人可读图片" ON storage.objects;
CREATE POLICY "所有人可读图片" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'post_images');

-- ===== 10. delete RPC functions =====
CREATE OR REPLACE FUNCTION delete_my_post(post_id integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
AS $$ BEGIN DELETE FROM map_posts WHERE id = post_id; RETURN FOUND; END; $$;
GRANT EXECUTE ON FUNCTION delete_my_post TO anon, authenticated;

CREATE OR REPLACE FUNCTION delete_my_comment(comment_id integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
AS $$ BEGIN DELETE FROM post_comments WHERE id = comment_id; RETURN FOUND; END; $$;
GRANT EXECUTE ON FUNCTION delete_my_comment TO anon, authenticated;
"""

print(sql)
