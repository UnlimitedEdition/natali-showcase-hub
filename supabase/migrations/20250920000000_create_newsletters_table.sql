-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all newsletters" ON newsletters
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
  ));

CREATE POLICY "Admins can insert newsletters" ON newsletters
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
  ));

CREATE POLICY "Admins can update newsletters" ON newsletters
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
  ));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS newsletters_status_idx ON newsletters(status);
CREATE INDEX IF NOT EXISTS newsletters_created_at_idx ON newsletters(created_at);

-- Insert sample newsletter
INSERT INTO newsletters (subject, content, status)
VALUES 
  ('Welcome to Our Newsletter', 'Thank you for subscribing to our newsletter. We are excited to share our latest updates with you!', 'sent'),
  ('Weekly Digest', 'Here is your weekly digest of our latest episodes and content.', 'draft')
ON CONFLICT DO NOTHING;