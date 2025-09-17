-- Update is_admin function first to include superadmin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = user_uuid AND role IN ('admin', 'editor', 'superadmin')
  );
$$;

-- Drop RLS policies that depend on role (use function or direct)
DROP POLICY IF EXISTS "Admins can insert translations" ON translations;
DROP POLICY IF EXISTS "Admins can view translations" ON translations;
DROP POLICY IF EXISTS "Admins can update translations" ON translations;
DROP POLICY IF EXISTS "Admins can insert content" ON content;
DROP POLICY IF EXISTS "Admins can view content" ON content;
DROP POLICY IF EXISTS "Admins can update content" ON content;
DROP POLICY IF EXISTS "Admins can insert episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can view episodes" ON episodes;
DROP POLICY IF EXISTS "Admins can update episodes" ON episodes;

-- Drop CHECK constraint on profiles role
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new CHECK constraint including superadmin
ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'editor', 'viewer', 'superadmin'));

-- Recreate RLS policies using updated is_admin function
CREATE POLICY "Admins can insert translations" ON translations FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view translations" ON translations FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update translations" ON translations FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert content" ON content FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view content" ON content FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update content" ON content FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert episodes" ON episodes FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view episodes" ON episodes FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update episodes" ON episodes FOR UPDATE
USING (is_admin(auth.uid()));

-- Enhance newsletter_subscribers table
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed'));

ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS unsub_token UUID DEFAULT gen_random_uuid();

-- Update RLS policies for newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
-- CREATE POLICY "Users can insert pending subscriptions" ON newsletter_subscribers FOR INSERT WITH CHECK (status = 'pending');

-- CREATE POLICY "Admins can view all subscribers" ON newsletter_subscribers FOR SELECT USING (is_admin(auth.uid()));

-- CREATE POLICY "Admins can update subscribers" ON newsletter_subscribers FOR UPDATE USING (is_admin(auth.uid()));

-- Enable realtime if needed
-- ALTER PUBLICATION supabase_realtime ADD TABLE newsletter_subscribers;