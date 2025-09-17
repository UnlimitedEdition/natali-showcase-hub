-- Provera i podešavanje RLS politika za tabele

-- Za content tabelu
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Politike za content tabelu
DROP POLICY IF EXISTS "Users can read published content" ON content;
DROP POLICY IF EXISTS "Admins can read all content" ON content;
DROP POLICY IF EXISTS "Admins can insert content" ON content;
DROP POLICY IF EXISTS "Admins can update content" ON content;
DROP POLICY IF EXISTS "Admins can delete content" ON content;

CREATE POLICY "Users can read published content" 
ON content FOR SELECT 
TO authenticated, anon 
USING (is_published = true);

CREATE POLICY "Admins can read all content" 
ON content FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

CREATE POLICY "Admins can insert content" 
ON content FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

CREATE POLICY "Admins can update content" 
ON content FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

CREATE POLICY "Admins can delete content" 
ON content FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

-- Za episodes tabelu
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Politike za episodes tabelu
DROP POLICY IF EXISTS "Users can read published episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can read all episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can insert episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can update episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can delete episodes" ON episodes;

CREATE POLICY "Users can read published episodes" 
ON episodes FOR SELECT 
TO authenticated, anon 
USING (is_published = true);

CREATE POLICY "Admins can read all episodes" 
ON episodes FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

CREATE POLICY "Admins can insert episodes" 
ON episodes FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

CREATE POLICY "Admins can update episodes" 
ON episodes FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

CREATE POLICY "Admins can delete episodes" 
ON episodes FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'editor')
  )
);

-- Za profiles tabelu
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politike za profiles tabelu
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;

CREATE POLICY "Users can read their own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());